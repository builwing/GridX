#!/bin/bash

# ================================================================
# GridX VPSデプロイスクリプト
# ================================================================
# 説明: GridX数独パズルアプリケーションをVPSサーバーにデプロイする
# 対象サーバー: x8
# デプロイ先: /var/www/gridx
# ================================================================

# カラー出力の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 設定変数
SERVER_HOST="x8"
REMOTE_DIR="/var/www/gridx"
LOCAL_DIR="$(pwd)"
APP_NAME="gridx"

# タイムスタンプ関数
timestamp() {
    date +"%Y-%m-%d %H:%M:%S"
}

# ログ出力関数
log_info() {
    echo -e "${BLUE}[$(timestamp)] INFO:${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(timestamp)] SUCCESS:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(timestamp)] WARNING:${NC} $1"
}

log_error() {
    echo -e "${RED}[$(timestamp)] ERROR:${NC} $1"
}

# ヘッダー表示
echo ""
echo "=========================================="
echo "   GridX VPS デプロイスクリプト"
echo "=========================================="
echo ""

# 現在のディレクトリ確認
log_info "現在のディレクトリ: $LOCAL_DIR"

# package.jsonの存在確認
if [ ! -f "package.json" ]; then
    log_error "package.jsonが見つかりません。GridXプロジェクトのルートディレクトリで実行してください。"
    exit 1
fi

# .nextディレクトリの存在確認
if [ ! -d ".next" ]; then
    log_warning ".nextディレクトリが見つかりません。ビルドを実行します..."
    
    # ビルド実行
    log_info "プロダクションビルドを開始..."
    npm run build
    
    if [ $? -ne 0 ]; then
        log_error "ビルドに失敗しました。エラーを確認してください。"
        exit 1
    fi
    log_success "ビルドが完了しました。"
else
    # ビルドの更新確認
    echo ""
    read -p "既存のビルドを使用しますか？ 新しくビルドする場合は 'n' を入力: " rebuild
    if [ "$rebuild" = "n" ] || [ "$rebuild" = "N" ]; then
        log_info "プロダクションビルドを開始..."
        npm run build
        
        if [ $? -ne 0 ]; then
            log_error "ビルドに失敗しました。エラーを確認してください。"
            exit 1
        fi
        log_success "ビルドが完了しました。"
    fi
fi

# SSH接続テスト
log_info "VPSサーバーへの接続を確認中..."
ssh -q -o BatchMode=yes -o ConnectTimeout=5 $SERVER_HOST exit

if [ $? -ne 0 ]; then
    log_error "サーバー $SERVER_HOST への接続に失敗しました。SSH設定を確認してください。"
    exit 1
fi
log_success "サーバー接続確認完了。"

# リモートディレクトリの存在確認と作成
log_info "リモートディレクトリを確認中..."
ssh $SERVER_HOST "[ -d $REMOTE_DIR ] || mkdir -p $REMOTE_DIR"

if [ $? -ne 0 ]; then
    log_error "リモートディレクトリの作成に失敗しました。"
    exit 1
fi

# デプロイ前のバックアップ（オプション）
echo ""
read -p "デプロイ前にバックアップを作成しますか？ (y/n): " backup
if [ "$backup" = "y" ] || [ "$backup" = "Y" ]; then
    log_info "バックアップを作成中..."
    BACKUP_NAME="gridx_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    ssh $SERVER_HOST "cd /var/www && tar -czf ~/$BACKUP_NAME gridx/ 2>/dev/null || true"
    log_success "バックアップを作成しました: ~/$BACKUP_NAME"
fi

# rsyncでファイル転送
log_info "ファイルの転送を開始..."
echo ""

rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.gitignore' \
    --exclude '.env.local' \
    --exclude '.env.development' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    --exclude 'npm-debug.log*' \
    --exclude 'yarn-debug.log*' \
    --exclude 'yarn-error.log*' \
    --exclude '.next/cache' \
    --exclude 'out' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude '*.md' \
    --exclude 'deploy_to_vps.sh' \
    --include '.next/' \
    --include '.next/static/' \
    --include '.next/server/' \
    --include 'public/' \
    --include 'package.json' \
    --include 'package-lock.json' \
    --include 'next.config.js' \
    --include 'next.config.mjs' \
    --include 'tsconfig.json' \
    --progress \
    -e "ssh -o StrictHostKeyChecking=no" \
    ./ ${SERVER_HOST}:${REMOTE_DIR}/

if [ $? -ne 0 ]; then
    log_error "ファイル転送に失敗しました。"
    exit 1
fi

log_success "ファイル転送が完了しました。"

# リモートでの依存関係インストール
log_info "本番用依存関係をインストール中..."
ssh $SERVER_HOST "cd $REMOTE_DIR && npm install --production"

if [ $? -ne 0 ]; then
    log_warning "依存関係のインストールで警告が発生しましたが、続行します。"
fi

# PM2でアプリケーションを再起動
log_info "アプリケーションを再起動中..."

# PM2がインストールされているか確認
ssh $SERVER_HOST "which pm2 > /dev/null 2>&1"
if [ $? -eq 0 ]; then
    # PM2でアプリケーションを管理
    ssh $SERVER_HOST "cd $REMOTE_DIR && pm2 describe $APP_NAME > /dev/null 2>&1"
    
    if [ $? -eq 0 ]; then
        # 既存のプロセスを再起動
        log_info "PM2でアプリケーションを再起動..."
        ssh $SERVER_HOST "cd $REMOTE_DIR && pm2 restart $APP_NAME"
    else
        # 新規にプロセスを開始
        log_info "PM2でアプリケーションを起動..."
        ssh $SERVER_HOST "cd $REMOTE_DIR && pm2 start npm --name $APP_NAME -- start"
        ssh $SERVER_HOST "pm2 save"
        ssh $SERVER_HOST "pm2 startup systemd -u \$(whoami) --hp /home/\$(whoami) || true"
    fi
    
    # PM2のステータス表示
    echo ""
    log_info "PM2プロセスステータス:"
    ssh $SERVER_HOST "pm2 status"
else
    log_warning "PM2がインストールされていません。手動でアプリケーションを起動してください。"
    echo ""
    echo "以下のコマンドでPM2をインストールして起動できます:"
    echo "  ssh $SERVER_HOST"
    echo "  sudo npm install -g pm2"
    echo "  cd $REMOTE_DIR"
    echo "  pm2 start npm --name $APP_NAME -- start"
    echo "  pm2 save"
    echo "  pm2 startup"
fi

# Nginxの設定確認とリロード
log_info "Nginx設定を確認中..."
ssh $SERVER_HOST "sudo nginx -t > /dev/null 2>&1"

if [ $? -eq 0 ]; then
    log_info "Nginxをリロード中..."
    ssh $SERVER_HOST "sudo systemctl reload nginx"
    log_success "Nginxのリロードが完了しました。"
else
    log_warning "Nginx設定にエラーがある可能性があります。手動で確認してください。"
fi

# デプロイ完了
echo ""
echo "=========================================="
log_success "デプロイが完了しました！"
echo "=========================================="
echo ""
echo "📌 アプリケーションURL: https://gridx.winroad.biz"
echo ""

# ヘルスチェック（オプション）
log_info "ヘルスチェックを実行中..."
sleep 3

# curlでアプリケーションの応答を確認
response=$(curl -s -o /dev/null -w "%{http_code}" https://gridx.winroad.biz)

if [ "$response" = "200" ]; then
    log_success "アプリケーションは正常に動作しています。(HTTP $response)"
elif [ "$response" = "301" ] || [ "$response" = "302" ]; then
    log_success "アプリケーションは正常に動作しています。(リダイレクト: HTTP $response)"
else
    log_warning "アプリケーションの応答を確認してください。(HTTP $response)"
fi

echo ""
echo "デプロイログ:"
echo "  - 日時: $(timestamp)"
echo "  - サーバー: $SERVER_HOST"
echo "  - デプロイ先: $REMOTE_DIR"
echo "  - ステータス: 成功"
echo ""

# オプション: デプロイ履歴をローカルに記録
echo "[$(timestamp)] Deployed to $SERVER_HOST:$REMOTE_DIR" >> .deploy_history.log

exit 0