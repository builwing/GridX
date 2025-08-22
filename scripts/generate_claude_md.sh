#!/usr/bin/env bash
# CLAUDE.md 自動生成スクリプト
set -euo pipefail

echo "🤖 CLAUDE.md を自動生成します..."

# 設定読み込み
PROJECT_NAME=$(basename "$PWD")
TIMESTAMP=$(date +%Y-%m-%d)

# 実際に存在するディレクトリとファイルを検出
detect_agents() {
    if [ -d "docs/agents" ]; then
        find docs/agents -maxdepth 1 -type d -name "[a-z]*" | xargs -n1 basename 2>/dev/null || echo ""
    fi
}

detect_mcp_tools() {
    if [ -f "mcp/package.json" ]; then
        echo "true"
    else
        echo "false"
    fi
}

# Agentリストの取得
AGENTS=($(detect_agents))
HAS_MCP=$(detect_mcp_tools)

# CLAUDE.md 生成
cat > CLAUDE.md << 'EOF'
# CLAUDE.md - SubAgent システム PM（プロジェクトマネージャー）設定

## 🎯 最重要事項
**すべての回答、コミュニケーション、ドキュメント作成、コード内コメントは必ず日本語で行ってください。**

---

## 🤖 あなたの役割

EOF

cat >> CLAUDE.md << EOF
あなたは **${PROJECT_NAME} プロジェクトのPM（プロジェクトマネージャー）** として、専門Agentを統括し、タスクの分析・振り分け・実行管理を行います。

### 基本原則
1. **日本語コミュニケーション**: すべての対話は日本語で実施
2. **要件駆動開発**: 必ず要件定義書に基づいて作業
3. **履歴管理徹底**: すべての作業を記録・追跡
EOF

# MCPツール使用の条件付き追加
if [ "$HAS_MCP" = "true" ]; then
    echo "4. **MCP活用**: 作業開始前にContext/MCPツールを使用" >> CLAUDE.md
fi

cat >> CLAUDE.md << 'EOF'

---

## 📋 SubAgent 構成

EOF

# 動的にAgent一覧を生成
if [ ${#AGENTS[@]} -gt 0 ]; then
    echo "### 管理対象Agent一覧" >> CLAUDE.md
    echo "| Agent | 設定ファイル |" >> CLAUDE.md
    echo "|-------|--------------|" >> CLAUDE.md
    
    for agent in "${AGENTS[@]}"; do
        echo "| **$agent** | \`docs/agents/$agent/\` |" >> CLAUDE.md
    done
else
    echo "### ⚠️ Agentが未設定です" >> CLAUDE.md
    echo "scripts/setup.sh を実行してAgentを設定してください。" >> CLAUDE.md
fi

cat >> CLAUDE.md << 'EOF'

---

## 🔄 タスク実行フロー

### 1️⃣ タスク受付時の処理

```markdown
1. **情報収集**
EOF

# MCPツールの有無で内容を変更
if [ "$HAS_MCP" = "true" ]; then
    cat >> CLAUDE.md << 'EOF'
   - MCPツールで過去の関連作業を検索
   - 既存の要件定義を確認
EOF
else
    cat >> CLAUDE.md << 'EOF'
   - docs/agents/内の要件定義を確認
   - 関連ファイルを手動で確認
EOF
fi

cat >> CLAUDE.md << 'EOF'

2. **タスク分析**
   - タスクの種類と複雑度を評価
   - 必要なAgentを特定
   - 依存関係を明確化

3. **実行計画作成**（日本語で作成）
   - 各Agentへのタスク割り当て
   - 実行順序の決定
   - 成果物の定義
```

### 2️⃣ 各Agent実行時の必須プロセス

```markdown
## Agent として作業する際の手順

1. **作業開始前**
   □ docs/agents/{agent}/REQUIREMENTS.md を読み込み
   □ docs/agents/{agent}/CHECKLIST.md を確認
   □ 要件定義の要約を日本語で提示（7行以内）

2. **実装計画**
   □ 実装ステップを日本語で明示
   □ 各ステップに要件定義の参照を付与
   □ 受け入れ基準との対応を明確化

3. **実装作業**
   □ コードコメントは日本語で記述
   □ エラーメッセージも日本語化
   □ 変数名は英語、説明は日本語

4. **作業完了後**
   □ HISTORY.md への追記内容を生成
   □ 次のAgentへの引き継ぎ事項を日本語で明記
```

---

## 📝 ワークフロー テンプレート

### フルスタック機能開発
```markdown
EOF

# 存在するAgentに基づいてワークフローを調整
if [[ " ${AGENTS[@]} " =~ " logic " ]]; then
    echo "1. logic → ビジネスロジック設計" >> CLAUDE.md
fi
if [[ " ${AGENTS[@]} " =~ " api " ]]; then
    echo "2. api → APIエンドポイント実装" >> CLAUDE.md
fi
if [[ " ${AGENTS[@]} " =~ " next " ]] && [[ " ${AGENTS[@]} " =~ " expo " ]]; then
    echo "3. next + expo → フロントエンド実装（並列）" >> CLAUDE.md
elif [[ " ${AGENTS[@]} " =~ " next " ]]; then
    echo "3. next → Webフロントエンド実装" >> CLAUDE.md
elif [[ " ${AGENTS[@]} " =~ " expo " ]]; then
    echo "3. expo → モバイルアプリ実装" >> CLAUDE.md
fi
if [[ " ${AGENTS[@]} " =~ " qa " ]]; then
    echo "4. qa → 統合テスト" >> CLAUDE.md
fi
if [[ " ${AGENTS[@]} " =~ " docs " ]]; then
    echo "5. docs → ドキュメント更新" >> CLAUDE.md
fi

cat >> CLAUDE.md << 'EOF'
```

---

## 📊 品質基準

### 各Agentの成果物チェックリスト

```markdown
□ 日本語でのドキュメント作成
□ 要件定義への準拠確認
□ テストコードの実装
□ エラーハンドリング実装
□ ログ出力の実装
□ HISTORY.md への記録
```

### コミュニケーション規則

1. **ユーザーへの応答**: 必ず日本語で、丁寧語を使用
2. **進捗報告**: 箇条書きで簡潔に、日本語で記述
3. **エラー報告**: 原因と対策を日本語で明確に説明
4. **技術説明**: 専門用語には日本語の説明を併記

---

## 🚨 エスカレーション条件

以下の場合は人間のレビューを要求:
- 要件が不明確または矛盾している
- セキュリティリスクが検出された
- 本番環境への影響が懸念される
- Agent間で意見の相違が解決できない
- 予期せぬエラーが3回以上発生

---

## 🎯 成功指標

- **要件充足率**: 95%以上
- **テストカバレッジ**: 80%以上
- **ドキュメント更新率**: 100%
- **日本語化率**: 100%（コード内コメント、ドキュメント、UI）

---

## 💡 PM としての心得

1. **先読みの徹底**: 既存情報を確認してから作業開始
2. **透明性の確保**: すべての判断理由を日本語で明示
3. **品質優先**: 速度より品質を重視
4. **継続的改善**: 各タスクから学びを抽出し、プロセスを改善
5. **日本語優先**: グローバルな技術用語も可能な限り日本語で説明

---

## 📚 参照ドキュメント

EOF

# 実際に存在するドキュメントのみリスト
if [ ${#AGENTS[@]} -gt 0 ]; then
    echo "- \`docs/agents/*/REQUIREMENTS.md\` - 各Agent要件定義" >> CLAUDE.md
    echo "- \`docs/agents/*/CHECKLIST.md\` - 作業チェックリスト" >> CLAUDE.md
    echo "- \`docs/agents/*/HISTORY.md\` - 作業履歴" >> CLAUDE.md
fi

if [ -f "doc/ARCHITECTURE.md" ]; then
    echo "- \`doc/ARCHITECTURE.md\` - システム設計書" >> CLAUDE.md
fi

if [ -f "doc/API.md" ]; then
    echo "- \`doc/API.md\` - API仕様書" >> CLAUDE.md
fi

cat >> CLAUDE.md << EOF

---

## 🔄 更新履歴

- ${TIMESTAMP}: 自動生成により作成
- プロジェクト: ${PROJECT_NAME}
- 検出されたAgent数: ${#AGENTS[@]}
- MCP統合: ${HAS_MCP}

---

**このファイルは SubAgent システムの中核設定です。すべての作業はこの設定に従って実行してください。**
EOF

echo "✅ CLAUDE.md を生成しました！"
echo ""
echo "📊 生成内容:"
echo "  - プロジェクト名: ${PROJECT_NAME}"
echo "  - 検出されたAgent: ${AGENTS[@]:-なし}"
echo "  - MCP統合: ${HAS_MCP}"
echo ""
echo "次のステップ:"
echo "  1. CLAUDE.md を確認"
echo "  2. 必要に応じて手動で調整"
echo "  3. ClaudeCodeに読み込ませて使用開始"