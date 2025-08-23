#!/usr/bin/env bash
# Agentixプロジェクトのクリーンアップと修正スクリプト
set -euo pipefail

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧹 Agentixプロジェクトのクリーンアップ${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}このスクリプトは以下を実行します:${NC}"
echo "  1. 重複・不要なスクリプトの削除"
echo "  2. パス不整合の修正"
echo "  3. ディレクトリ構造の統一"
echo ""

read -p "続行しますか？ [y/N]: " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${YELLOW}キャンセルしました${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}━━━ Phase 1: 不要なスクリプトの削除 ━━━${NC}"

# 削除対象スクリプト
SCRIPTS_TO_DELETE=(
    "scripts/fix_pm_paths.sh"
    "scripts/setup_agent.sh"
    "scripts/pm_register_agent.sh"
    "scripts/create-requirements.sh"
    "scripts/setup_requirements_agent.sh"
)

deleted_count=0
for script in "${SCRIPTS_TO_DELETE[@]}"; do
    if [ -f "$script" ]; then
        rm "$script"
        echo -e "${GREEN}✅ 削除: $(basename $script)${NC}"
        ((deleted_count++))
    fi
done

if [ $deleted_count -eq 0 ]; then
    echo -e "${CYAN}削除対象のスクリプトは見つかりませんでした${NC}"
else
    echo -e "${GREEN}${deleted_count}個のスクリプトを削除しました${NC}"
fi

echo ""
echo -e "${BLUE}━━━ Phase 2: パス不整合の修正 ━━━${NC}"

# install_pm_prompts.sh の修正
if [ -f "scripts/install_pm_prompts.sh" ]; then
    if grep -q "\.claude/\.claude/" scripts/install_pm_prompts.sh; then
        sed -i.bak 's|\.claude/\.claude/|.claude/|g' scripts/install_pm_prompts.sh
        echo -e "${GREEN}✅ install_pm_prompts.sh のパスを修正${NC}"
        echo "   .claude/.claude/ → .claude/"
    else
        echo -e "${CYAN}install_pm_prompts.sh は既に修正済みです${NC}"
    fi
fi

# setup.sh の修正
if [ -f "scripts/setup.sh" ]; then
    if grep -q "^mkdir -p pm/" scripts/setup.sh; then
        sed -i.bak 's|^mkdir -p pm/|mkdir -p .claude/pm/|g' scripts/setup.sh
        sed -i.bak 's|cat > "pm/|cat > ".claude/pm/|g' scripts/setup.sh
        echo -e "${GREEN}✅ setup.sh のパスを修正${NC}"
        echo "   pm/ → .claude/pm/"
    else
        echo -e "${CYAN}setup.sh は既に修正済みです${NC}"
    fi
fi

# migrate_pm_to_claude.sh の確認
if [ -f "scripts/migrate_pm_to_claude.sh" ]; then
    echo -e "${YELLOW}⚠️  migrate_pm_to_claude.sh は移行完了後に手動で削除してください${NC}"
fi

echo ""
echo -e "${BLUE}━━━ Phase 3: ディレクトリ構造の統一 ━━━${NC}"

# pmディレクトリの移動
if [ -d "pm" ] && [ ! -d ".claude/pm" ]; then
    mkdir -p .claude
    mv pm .claude/
    echo -e "${GREEN}✅ pm/ を .claude/pm/ に移動${NC}"
elif [ -d "pm" ] && [ -d ".claude/pm" ]; then
    echo -e "${YELLOW}⚠️  pm/ と .claude/pm/ の両方が存在します${NC}"
    echo "   手動でマージが必要です"
elif [ ! -d "pm" ] && [ -d ".claude/pm" ]; then
    echo -e "${CYAN}.claude/pm/ は既に正しい場所にあります${NC}"
fi

# .claude/.claude の二重ディレクトリチェック
if [ -d ".claude/.claude" ]; then
    echo -e "${YELLOW}⚠️  .claude/.claude/ という二重ディレクトリを検出${NC}"
    read -p "修正しますか？ [y/N]: " fix_double
    if [[ "$fix_double" == "y" || "$fix_double" == "Y" ]]; then
        if [ -d ".claude/.claude/pm" ]; then
            cp -r .claude/.claude/pm/* .claude/pm/ 2>/dev/null || true
        fi
        rm -rf .claude/.claude
        echo -e "${GREEN}✅ 二重ディレクトリを修正${NC}"
    fi
fi

echo ""
echo -e "${BLUE}━━━ Phase 4: バックアップファイルの整理 ━━━${NC}"

# .bakファイルの削除
bak_count=$(find scripts -name "*.bak" 2>/dev/null | wc -l)
if [ $bak_count -gt 0 ]; then
    read -p ".bakファイルが${bak_count}個見つかりました。削除しますか？ [y/N]: " remove_bak
    if [[ "$remove_bak" == "y" || "$remove_bak" == "Y" ]]; then
        find scripts -name "*.bak" -delete
        echo -e "${GREEN}✅ ${bak_count}個の.bakファイルを削除${NC}"
    fi
fi

echo ""
echo -e "${BLUE}━━━ Phase 5: 検証 ━━━${NC}"

# 必須ディレクトリの確認
REQUIRED_DIRS=(
    ".claude"
    ".claude/pm"
    ".claude/pm/prompts"
    ".claude/agents"
)

all_good=true
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓ $dir${NC}"
    else
        echo -e "${RED}✗ $dir が見つかりません${NC}"
        all_good=false
    fi
done

if [ "$all_good" = true ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ クリーンアップ完了！${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # 残っているスクリプトの数を表示
    script_count=$(ls scripts/*.sh 2>/dev/null | wc -l)
    echo ""
    echo -e "${CYAN}📊 プロジェクト状態:${NC}"
    echo "  • スクリプト数: ${script_count}個"
    echo "  • ディレクトリ構造: 統一済み"
    echo "  • パス設定: 修正済み"
else
    echo ""
    echo -e "${YELLOW}⚠️  一部の必須ディレクトリが見つかりません${NC}"
    echo "   setup.sh を実行して再セットアップしてください:"
    echo -e "   ${CYAN}./scripts/setup.sh${NC}"
fi

echo ""
echo -e "${CYAN}💡 次のステップ:${NC}"
echo "  1. プロジェクトをテスト:"
echo -e "     ${YELLOW}./scripts/generate_agents_from_requirements.sh${NC}"
echo ""
echo "  2. Context7設定を適用:"
echo -e "     ${YELLOW}./scripts/update_pm_context7.sh${NC}"
echo ""
echo "  3. 不要になったマイグレーションスクリプトを削除:"
echo -e "     ${YELLOW}rm scripts/migrate_pm_to_claude.sh${NC}"
echo ""

# 削除されたスクリプトのリストを記録
if [ $deleted_count -gt 0 ]; then
    echo "# 削除されたスクリプト ($(date +%Y-%m-%d))" > .cleanup_log
    for script in "${SCRIPTS_TO_DELETE[@]}"; do
        if [ ! -f "$script" ]; then
            echo "- $(basename $script)" >> .cleanup_log
        fi
    done
    echo -e "${CYAN}削除ログを .cleanup_log に保存しました${NC}"
fi