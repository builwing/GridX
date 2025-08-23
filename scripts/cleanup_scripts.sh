#!/usr/bin/env bash
# スクリプト整理・クリーンアップツール
set -euo pipefail

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧹 スクリプト整理ツール${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# バックアップディレクトリ作成
BACKUP_DIR="scripts/.deprecated_$(date +%Y%m%d_%H%M%S)"

# 削除対象のバックアップファイル
echo -e "${BLUE}📋 削除対象ファイルの確認...${NC}"
BAK_FILES=$(find scripts -name "*.bak" 2>/dev/null | wc -l | tr -d ' ')

if [[ "$BAK_FILES" -gt 0 ]]; then
    echo -e "${YELLOW}発見: ${BAK_FILES}個の.bakファイル${NC}"
    echo ""
    find scripts -name "*.bak" -exec basename {} \;
    echo ""
    
    read -p "これらのバックアップファイルを削除しますか？ [y/N]: " confirm
    if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
        find scripts -name "*.bak" -delete
        echo -e "${GREEN}✅ バックアップファイルを削除しました${NC}"
    fi
else
    echo -e "${GREEN}✅ バックアップファイルは見つかりませんでした${NC}"
fi

echo ""
echo -e "${BLUE}📋 統合候補スクリプトの確認...${NC}"
echo ""

# 統合候補のスクリプト
DEPRECATED_SCRIPTS=(
    "scripts/setup_requirements_agent.sh"
    "scripts/create-requirements.sh"
)

FOUND_DEPRECATED=false
for script in "${DEPRECATED_SCRIPTS[@]}"; do
    if [[ -f "$script" ]]; then
        FOUND_DEPRECATED=true
        echo -e "${YELLOW}• $(basename $script)${NC}"
        echo "  → generate_agents_from_requirements.sh に統合済み"
    fi
done

if [[ "$FOUND_DEPRECATED" == true ]]; then
    echo ""
    echo -e "${CYAN}これらの旧スクリプトは新しいワークフローでは不要です。${NC}"
    echo -e "${CYAN}ただし、互換性のため残すことも可能です。${NC}"
    echo ""
    read -p "旧スクリプトを非推奨ディレクトリに移動しますか？ [y/N]: " move_old
    
    if [[ "$move_old" == "y" || "$move_old" == "Y" ]]; then
        mkdir -p "$BACKUP_DIR"
        
        for script in "${DEPRECATED_SCRIPTS[@]}"; do
            if [[ -f "$script" ]]; then
                mv "$script" "$BACKUP_DIR/"
                echo -e "${GREEN}✅ $(basename $script) を移動しました${NC}"
            fi
        done
        
        echo ""
        echo -e "${CYAN}旧スクリプトは $BACKUP_DIR に保存されました${NC}"
    fi
else
    echo -e "${GREEN}✅ 統合候補のスクリプトは見つかりませんでした${NC}"
fi

echo ""
echo -e "${BLUE}📋 推奨スクリプト構成...${NC}"
echo ""

# 推奨構成の確認
RECOMMENDED_SCRIPTS=(
    "scripts/setup.sh:初期セットアップ"
    "scripts/generate_agents_from_requirements.sh:要件定義書からエージェント生成"
    "scripts/update_requirements.sh:要件変更管理"
    "scripts/setup_custom_agents.sh:カスタムエージェント作成"
    "scripts/generate_claude_md.sh:CLAUDE.md生成"
    "scripts/install_scripts.sh:PMスクリプト生成"
    "scripts/install_pm_prompts.sh:プロンプト設定"
    "scripts/install_hooks.sh:Git Hooks設定"
)

echo -e "${CYAN}推奨されるコアスクリプト:${NC}"
for item in "${RECOMMENDED_SCRIPTS[@]}"; do
    IFS=':' read -r script desc <<< "$item"
    if [[ -f "$script" ]]; then
        echo -e "  ${GREEN}✓${NC} $(basename $script) - $desc"
    else
        echo -e "  ${RED}✗${NC} $(basename $script) - $desc (見つかりません)"
    fi
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ スクリプト整理が完了しました${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📝 次のステップ:${NC}"
echo "  1. REQUIREMENTS.md を編集して要件を定義"
echo "  2. ./scripts/generate_agents_from_requirements.sh でエージェント生成"
echo "  3. ./scripts/update_requirements.sh で要件変更を管理"
echo ""