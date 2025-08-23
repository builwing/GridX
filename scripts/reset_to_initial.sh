#!/usr/bin/env bash
# プロジェクトを初期状態に戻すクリーンアップスクリプト
set -euo pipefail

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧹 プロジェクト初期化クリーンアップ${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}⚠️  警告: このスクリプトは生成されたファイルをすべて削除します${NC}"
echo -e "${YELLOW}以下のディレクトリ/ファイルが削除されます:${NC}"
echo ""
echo "  • .claude/      (エージェント定義とPM設定)"
echo "  • docs/         (エージェントドキュメント)"
echo "  • CLAUDE.md     (自動生成された指示書)"
echo "  • PM_AGENT_GUIDE.md (PMガイド)"
echo "  • .requirements_hash"
echo "  • .requirements_backup"
echo "  • .requirements_changes.log"
echo "  • scripts/.deprecated_*"
echo "  • scripts/.path_update_backup_*"
echo "  • scripts/*.bak"
echo ""
echo -e "${CYAN}以下は保持されます:${NC}"
echo "  ✓ REQUIREMENTS.md (マスター要件定義書)"
echo "  ✓ README.md"
echo "  ✓ scripts/ (スクリプト本体)"
echo ""

read -p "本当に初期状態に戻しますか？ [y/N]: " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${YELLOW}キャンセルしました${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🗑️  クリーンアップを開始...${NC}"

# 生成されたディレクトリの削除
if [[ -d ".claude" ]]; then
    rm -rf .claude
    echo -e "${GREEN}✅ .claude/ を削除しました${NC}"
fi

if [[ -d "docs" ]]; then
    rm -rf docs
    echo -e "${GREEN}✅ docs/ を削除しました${NC}"
fi

# 自動生成ファイルの削除
if [[ -f "CLAUDE.md" ]]; then
    rm -f CLAUDE.md
    echo -e "${GREEN}✅ CLAUDE.md を削除しました${NC}"
fi

if [[ -f "PM_AGENT_GUIDE.md" ]]; then
    rm -f PM_AGENT_GUIDE.md
    echo -e "${GREEN}✅ PM_AGENT_GUIDE.md を削除しました${NC}"
fi

# 追跡ファイルの削除
rm -f .requirements_hash .requirements_backup .requirements_changes.log
echo -e "${GREEN}✅ 追跡ファイルを削除しました${NC}"

# バックアップディレクトリの削除
if ls scripts/.deprecated_* 1> /dev/null 2>&1; then
    rm -rf scripts/.deprecated_*
    echo -e "${GREEN}✅ 非推奨スクリプトのバックアップを削除しました${NC}"
fi

if ls scripts/.path_update_backup_* 1> /dev/null 2>&1; then
    rm -rf scripts/.path_update_backup_*
    echo -e "${GREEN}✅ パス更新バックアップを削除しました${NC}"
fi

# .bakファイルの削除
if ls scripts/*.bak 1> /dev/null 2>&1; then
    rm -f scripts/*.bak
    echo -e "${GREEN}✅ .bakファイルを削除しました${NC}"
fi

# .backup ディレクトリの削除
if [[ -d ".backup" ]]; then
    rm -rf .backup
    echo -e "${GREEN}✅ .backup/ を削除しました${NC}"
fi

# Node.js関連の削除（オプション）
if [[ -d "scripts/requirements" ]]; then
    echo ""
    echo -e "${YELLOW}Node.js要件定義ツールが検出されました${NC}"
    read -p "scripts/requirements/ も削除しますか？ [y/N]: " remove_node
    if [[ "$remove_node" == "y" || "$remove_node" == "Y" ]]; then
        rm -rf scripts/requirements
        echo -e "${GREEN}✅ scripts/requirements/ を削除しました${NC}"
    fi
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ クリーンアップ完了！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📝 現在の状態:${NC}"
echo "  • プロジェクトは初期状態に戻りました"
echo "  • REQUIREMENTS.md は保持されています"
echo "  • すべてのスクリプトは利用可能です"
echo ""
echo -e "${CYAN}🚀 再セットアップ方法:${NC}"
echo ""
echo "  1. 基本セットアップ:"
echo -e "     ${YELLOW}./scripts/setup.sh${NC}"
echo ""
echo "  2. エージェント生成:"
echo -e "     ${YELLOW}./scripts/generate_agents_from_requirements.sh${NC}"
echo ""
echo "  これで、PMによる自動振り分け機能を含む"
echo "  すべての機能が再生成されます。"
echo ""