# 📚 GridX VPSデプロイ手順書

## 📋 概要
このドキュメントでは、GridX数独パズルアプリケーションをVPSサーバー（x8）にデプロイし、Nginxで配信する手順を説明します。

**対象ドメイン**: `gridx.winroad.biz`  
**デプロイ先**: `/var/www/gridx`  
**Webサーバー**: Nginx

---

## 🔧 前提条件

### ローカル環境
- Node.js 18以上がインストール済み
- SSHでVPSサーバー（x8）に接続可能
- rsyncコマンドが使用可能

### VPSサーバー環境
- Ubuntu/Debian系OS（推奨）
- Nginx がインストール済み
- Node.js 18以上がインストール済み（PM2実行用）
- PM2がインストール済み（オプション：Node.jsアプリケーション管理用）

---

## 📝 セットアップ手順

### 1. ローカル環境でのビルド

```bash
# プロジェクトディレクトリに移動
cd /Users/hide/Desktop/GridX

# 依存関係の確認とインストール
npm install

# プロダクションビルドの実行
npm run build

# ビルド成功の確認（.nextディレクトリが作成される）
ls -la .next/
```

### 2. VPSサーバーの準備

```bash
# SSHでVPSサーバーに接続
ssh x8

# デプロイ先ディレクトリの作成
sudo mkdir -p /var/www/gridx
sudo chown -R $USER:$USER /var/www/gridx

# 必要なディレクトリ権限の設定
sudo chmod -R 755 /var/www/gridx
```

### 3. Nginxの設定

```bash
# Nginx設定ファイルの作成
sudo nano /etc/nginx/sites-available/gridx.winroad.biz

# 設定ファイルの内容は gridx_nginx_setup_sample_document.md を参照

# シンボリックリンクの作成
sudo ln -s /etc/nginx/sites-available/gridx.winroad.biz /etc/nginx/sites-enabled/

# Nginx設定のテスト
sudo nginx -t

# Nginxの再起動
sudo systemctl reload nginx
```

### 4. SSL証明書の設定（Let's Encrypt）

```bash
# Certbotのインストール（未インストールの場合）
sudo apt update
sudo apt install certbot python3-certbot-nginx

# SSL証明書の取得
sudo certbot --nginx -d gridx.winroad.biz

# 自動更新の確認
sudo certbot renew --dry-run
```

### 5. ファイルのデプロイ

#### 方法1: rsyncスクリプトを使用（推奨）

```bash
# ローカル環境で実行
cd /Users/hide/Desktop/GridX

# デプロイスクリプトに実行権限を付与
chmod +x deploy_to_vps.sh

# デプロイ実行
./deploy_to_vps.sh
```

#### 方法2: 手動でrsync実行

```bash
# ローカル環境から実行
cd /Users/hide/Desktop/GridX

# ビルドファイルと必要なファイルを転送
rsync -avz --delete \
  -e "ssh" \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.env.local' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --include '.next/' \
  --include 'public/' \
  --include 'package.json' \
  --include 'package-lock.json' \
  --include 'next.config.js' \
  ./ x8:/var/www/gridx/
```

### 6. VPSサーバーでの初期設定

```bash
# VPSサーバーにSSH接続
ssh x8

# デプロイ先ディレクトリに移動
cd /var/www/gridx

# 本番用の依存関係をインストール
npm install --production

# PM2のインストール（未インストールの場合）
sudo npm install -g pm2

# PM2でアプリケーションを起動
pm2 start npm --name "gridx" -- start

# PM2の自動起動設定
pm2 startup systemd
pm2 save

# PM2のステータス確認
pm2 status
```

### 7. 環境変数の設定

```bash
# VPSサーバーで実行
cd /var/www/gridx

# 環境変数ファイルの作成
nano .env.production

# 以下の内容を追加
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://gridx.winroad.biz

# ファイルの権限設定
chmod 600 .env.production
```

---

## 🔄 更新手順

### 自動デプロイ（スクリプト使用）

```bash
# ローカル環境で実行
cd /Users/hide/Desktop/GridX

# コード変更後、ビルドを実行
npm run build

# デプロイスクリプトで自動更新
./deploy_to_vps.sh

# VPSサーバーでPM2を再起動
ssh x8 "cd /var/www/gridx && pm2 restart gridx"
```

### 手動更新

```bash
# 1. ローカルでビルド
npm run build

# 2. rsyncで転送
rsync -avz --delete \
  -e "ssh" \
  --exclude 'node_modules' \
  --exclude '.git' \
  ./ x8:/var/www/gridx/

# 3. VPSサーバーで再起動
ssh x8
cd /var/www/gridx
npm install --production
pm2 restart gridx
```

---

## 🐛 トラブルシューティング

### 1. 502 Bad Gateway エラー

```bash
# PM2の状態確認
pm2 status
pm2 logs gridx

# アプリケーションの再起動
pm2 restart gridx

# ポート3000が使用されているか確認
sudo netstat -tlnp | grep 3000
```

### 2. 権限エラー

```bash
# ディレクトリ権限の修正
sudo chown -R www-data:www-data /var/www/gridx
sudo chmod -R 755 /var/www/gridx
```

### 3. Nginxエラー

```bash
# Nginxエラーログの確認
sudo tail -f /var/log/nginx/error.log

# Nginx設定のテスト
sudo nginx -t

# Nginxの再起動
sudo systemctl restart nginx
```

### 4. SSL証明書の問題

```bash
# 証明書の更新
sudo certbot renew

# 強制更新
sudo certbot renew --force-renewal
```

---

## 📊 監視とログ

### PM2によるモニタリング

```bash
# リアルタイムモニタリング
pm2 monit

# ログの確認
pm2 logs gridx --lines 100

# プロセス情報
pm2 info gridx
```

### Nginxログの確認

```bash
# アクセスログ
sudo tail -f /var/log/nginx/access.log

# エラーログ
sudo tail -f /var/log/nginx/error.log
```

---

## 🔒 セキュリティ設定

### 1. ファイアウォール設定

```bash
# UFWの有効化
sudo ufw enable

# 必要なポートを開放
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# ステータス確認
sudo ufw status
```

### 2. Nginxセキュリティヘッダー

Nginx設定ファイルに以下を追加：

```nginx
# セキュリティヘッダー
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 📈 パフォーマンス最適化

### 1. Nginx Gzip圧縮

```nginx
# /etc/nginx/nginx.conf に追加
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml application/atom+xml image/svg+xml text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype;
```

### 2. PM2クラスターモード

```bash
# CPUコア数に応じてインスタンスを起動
pm2 start npm --name "gridx" -i max -- start

# または特定の数を指定
pm2 start npm --name "gridx" -i 4 -- start
```

---

## 🔄 バックアップ戦略

### 定期バックアップスクリプト

```bash
#!/bin/bash
# /home/user/backup_gridx.sh

BACKUP_DIR="/home/user/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# バックアップディレクトリ作成
mkdir -p $BACKUP_DIR

# アプリケーションファイルのバックアップ
tar -czf $BACKUP_DIR/gridx_$DATE.tar.gz -C /var/www gridx/

# 古いバックアップの削除（30日以上）
find $BACKUP_DIR -name "gridx_*.tar.gz" -mtime +30 -delete
```

### Cronジョブの設定

```bash
# 毎日午前3時にバックアップ実行
crontab -e
0 3 * * * /home/user/backup_gridx.sh
```

---

## 📞 サポート情報

- **プロジェクト**: GridX 数独パズル
- **URL**: https://gridx.winroad.biz
- **サーバー**: x8 VPS
- **デプロイ先**: /var/www/gridx

---

## 📅 更新履歴

- 2025-01-22: 初版作成
- デプロイ手順、Nginx設定、トラブルシューティングガイドを含む

---

**このドキュメントは定期的に更新してください。**