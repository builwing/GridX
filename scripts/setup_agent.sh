#!/usr/bin/env bash
# 選択したエージェントのみをセットアップするスクリプト
set -euo pipefail

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# プロジェクトルートからの実行を確認
if [[ ! -f "README.md" ]] || [[ ! -d "scripts" ]]; then
    echo -e "${RED}エラー: プロジェクトルートから実行してください${NC}"
    echo "使用方法: ./scripts/setup_agent.sh"
    exit 1
fi

# エージェントの順序を定義（表示順）
AGENT_ORDER=("api" "docs" "expo" "infra" "logic" "next" "qa" "requirements" "security" "setup" "uiux")

# エージェントの説明を関数で取得
get_agent_description() {
    case "$1" in
        "api") echo "Go-Zero APIエージェント - REST/RPC エンドポイント実装" ;;
        "docs") echo "ドキュメント管理エージェント - README、API仕様書作成" ;;
        "expo") echo "Expo/React Nativeエージェント - モバイルアプリ開発" ;;
        "infra") echo "インフラエージェント - Docker、Kubernetes、CI/CD" ;;
        "logic") echo "ビジネスロジックエージェント - ドメイン駆動設計" ;;
        "next") echo "Next.jsエージェント - SSR/SSG/ISR実装" ;;
        "qa") echo "品質保証エージェント - テスト自動化" ;;
        "requirements") echo "要件定義エージェント - プロジェクト要件管理" ;;
        "security") echo "セキュリティエージェント - 認証認可、脆弱性対策" ;;
        "setup") echo "環境構築エージェント - プロジェクト初期化" ;;
        "uiux") echo "UI/UXエージェント - コンポーネント設計、スタイリング" ;;
        *) echo "不明なエージェント" ;;
    esac
}

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║           SubAgent 選択的セットアップツール               ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo

# 既存のエージェントをチェック
existing_agents=()
for agent in "${AGENT_ORDER[@]}"; do
    if [[ -d "docs/agents/$agent" ]]; then
        existing_agents+=("$agent")
    fi
done

if [[ ${#existing_agents[@]} -gt 0 ]]; then
    echo -e "${YELLOW}📁 既存のエージェント:${NC}"
    for agent in "${existing_agents[@]}"; do
        echo -e "   ${GREEN}✓${NC} $agent - $(get_agent_description "$agent")"
    done
    echo
fi

# メニュー表示
echo -e "${BLUE}📋 利用可能なエージェント:${NC}"
echo
index=1
for agent in "${AGENT_ORDER[@]}"; do
    if [[ " ${existing_agents[@]} " =~ " $agent " ]]; then
        echo -e "  ${GREEN}[$index]${NC} $agent ${GREEN}(セットアップ済み)${NC}"
    else
        echo -e "  ${CYAN}[$index]${NC} $agent"
    fi
    echo -e "      $(get_agent_description "$agent")"
    ((index++))
done

echo
echo -e "  ${MAGENTA}[A]${NC} すべてのエージェントをセットアップ"
echo -e "  ${MAGENTA}[M]${NC} 複数選択モード（カンマ区切りで指定）"
echo -e "  ${RED}[Q]${NC} 終了"
echo

# ユーザー入力を取得
read -p "$(echo -e ${CYAN}選択してください [1-${#AGENT_ORDER[@]}/A/M/Q]: ${NC})" choice

# 終了処理
if [[ "$choice" == "Q" ]] || [[ "$choice" == "q" ]]; then
    echo -e "${YELLOW}セットアップをキャンセルしました${NC}"
    exit 0
fi

# セットアップするエージェントのリスト
selected_agents=()

# 全エージェント選択
if [[ "$choice" == "A" ]] || [[ "$choice" == "a" ]]; then
    selected_agents=("${AGENT_ORDER[@]}")
    echo -e "${GREEN}すべてのエージェントをセットアップします${NC}"
# 複数選択モード
elif [[ "$choice" == "M" ]] || [[ "$choice" == "m" ]]; then
    echo -e "${CYAN}複数のエージェントを選択します${NC}"
    echo "番号をカンマ区切りで入力してください（例: 1,3,5）"
    read -p "選択: " multi_choice
    
    IFS=',' read -ra choices <<< "$multi_choice"
    for c in "${choices[@]}"; do
        c=$(echo "$c" | tr -d ' ')  # スペースを削除
        if [[ "$c" =~ ^[0-9]+$ ]] && [[ $c -ge 1 ]] && [[ $c -le ${#AGENT_ORDER[@]} ]]; then
            selected_agents+=("${AGENT_ORDER[$((c-1))]}")
        else
            echo -e "${RED}警告: 無効な選択 '$c' をスキップしました${NC}"
        fi
    done
# 単一選択
elif [[ "$choice" =~ ^[0-9]+$ ]] && [[ $choice -ge 1 ]] && [[ $choice -le ${#AGENT_ORDER[@]} ]]; then
    selected_agents+=("${AGENT_ORDER[$((choice-1))]}")
else
    echo -e "${RED}エラー: 無効な選択です${NC}"
    exit 1
fi

# 選択されたエージェントがない場合
if [[ ${#selected_agents[@]} -eq 0 ]]; then
    echo -e "${RED}エラー: エージェントが選択されていません${NC}"
    exit 1
fi

# 選択確認
echo
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🎯 以下のエージェントをセットアップします:${NC}"
for agent in "${selected_agents[@]}"; do
    echo -e "   ${GREEN}→${NC} $agent - $(get_agent_description "$agent")"
done
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

read -p "$(echo -e ${YELLOW}続行しますか？ [Y/n]: ${NC})" confirm
if [[ "$confirm" == "n" ]] || [[ "$confirm" == "N" ]]; then
    echo -e "${YELLOW}セットアップをキャンセルしました${NC}"
    exit 0
fi

# セットアップ関数
setup_agent() {
    local agent="$1"
    local description="$(get_agent_description "$agent")"
    
    echo -e "${CYAN}📦 $agent エージェントをセットアップ中...${NC}"
    
    # ディレクトリ作成
    mkdir -p "docs/agents/$agent"
    
    # 要件定義ファイル作成
    if [[ ! -f "docs/agents/$agent/REQUIREMENTS.md" ]]; then
        cat > "docs/agents/$agent/REQUIREMENTS.md" << EOF
# $agent エージェント要件定義

## 概要
$description

## 目的
- [具体的な目的を記載]

## 機能要件
### 必須機能
- [ ] 機能1
- [ ] 機能2

### オプション機能
- [ ] 機能3

## 非機能要件
### パフォーマンス
- レスポンスタイム: XXms以内
- スループット: XXrps

### セキュリティ
- [セキュリティ要件を記載]

## 技術スタック
- 言語/フレームワーク: [使用技術]
- ライブラリ: [依存ライブラリ]

## 受け入れ基準
- [ ] 基準1
- [ ] 基準2

## 制約事項
- [制約事項を記載]

## 参考資料
- [参考URL]
- [ドキュメント]
EOF
        echo -e "  ${GREEN}✓${NC} REQUIREMENTS.md を作成しました"
    else
        echo -e "  ${YELLOW}→${NC} REQUIREMENTS.md は既に存在します"
    fi
    
    # チェックリスト作成
    if [[ ! -f "docs/agents/$agent/CHECKLIST.md" ]]; then
        cat > "docs/agents/$agent/CHECKLIST.md" << EOF
# $agent エージェント実装チェックリスト

## セットアップ
- [ ] 開発環境構築
- [ ] 依存関係インストール
- [ ] 設定ファイル作成

## 実装
- [ ] コア機能実装
- [ ] エラーハンドリング
- [ ] ログ出力

## テスト
- [ ] ユニットテスト作成
- [ ] 統合テスト作成
- [ ] E2Eテスト作成

## ドキュメント
- [ ] API仕様書
- [ ] 実装ガイド
- [ ] トラブルシューティング

## レビュー
- [ ] コードレビュー
- [ ] セキュリティレビュー
- [ ] パフォーマンステスト

## デプロイ
- [ ] ステージング環境テスト
- [ ] 本番環境デプロイ
- [ ] 監視設定
EOF
        echo -e "  ${GREEN}✓${NC} CHECKLIST.md を作成しました"
    else
        echo -e "  ${YELLOW}→${NC} CHECKLIST.md は既に存在します"
    fi
    
    # 履歴ファイル作成
    if [[ ! -f "docs/agents/$agent/HISTORY.md" ]]; then
        cat > "docs/agents/$agent/HISTORY.md" << EOF
# $agent エージェント作業履歴

## $(date '+%Y-%m-%d %H:%M:%S')
- エージェントを初期化
- 要件定義とチェックリストを作成
EOF
        echo -e "  ${GREEN}✓${NC} HISTORY.md を作成しました"
    else
        echo -e "  ${YELLOW}→${NC} HISTORY.md は既に存在します"
    fi
    
    echo -e "${GREEN}✅ $agent エージェントのセットアップが完了しました${NC}"
    echo
}

# 選択されたエージェントをセットアップ
echo -e "${BLUE}🚀 セットアップを開始します...${NC}"
echo

for agent in "${selected_agents[@]}"; do
    setup_agent "$agent"
done

# 完了メッセージ
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ セットアップが完了しました！${NC}"
echo
echo -e "${YELLOW}📝 次のステップ:${NC}"
echo "1. 各エージェントの要件定義を確認・更新:"
for agent in "${selected_agents[@]}"; do
    echo "   - docs/agents/$agent/REQUIREMENTS.md"
done
echo
echo "2. 実装を開始:"
echo "   - 各エージェントのチェックリストに従って作業"
echo "   - 作業履歴は HISTORY.md に記録"
echo
echo -e "${CYAN}💡 ヒント:${NC}"
echo "   - './scripts/generate_claude_md.sh' でCLAUDE.mdを更新"
echo "   - 既存エージェントの再セットアップも可能です"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"