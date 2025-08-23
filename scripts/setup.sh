#!/usr/bin/env bash
# ClaudeCode サブエージェントシステム セットアップスクリプト
set -euo pipefail

echo "🚀 ClaudeCode サブエージェントシステムのセットアップを開始します..."

# 1. 必要なディレクトリの作成
echo "📁 ディレクトリ構造を作成中..."

# .claude/agents ディレクトリ（プロジェクトレベルのサブエージェント用）
mkdir -p .claude/agents

# docs/agents ディレクトリ（ドキュメント用）
mkdir -p docs/agents/{api,logic,next,expo,infra,qa,uiux,security,docs}

# pm (プロジェクトマネージャー) ディレクトリ
mkdir -p .claude/pm/{prompts/subagent_system,logs}

# scripts ディレクトリ
mkdir -p scripts

# .github/workflows ディレクトリ（CI用）
mkdir -p .github/workflows

# 2. デフォルトサブエージェントの生成
if [ -f "./scripts/setup_default_agents.sh" ]; then
    echo "🤖 デフォルトサブエージェントを生成中..."
    chmod +x ./scripts/setup_default_agents.sh
    ./scripts/setup_default_agents.sh
else
    echo "⚠️  setup_default_agents.sh が見つかりません"
    echo "   デフォルトサブエージェントの生成をスキップします"
fi

# 3. プロジェクト設定ファイルを生成
echo "📝 プロジェクト設定ファイルを生成中..."

# PM registry.json - Agent登録情報
cat > ".claude/pm/registry.json" << 'EOF'
{
  "version": "1.0.0",
  "agents": [
    {
      "id": "api",
      "name": "API Agent (Go-Zero)",
      "description": "Go-Zero framework API development specialist",
      "primary_tools": ["goctl", "swagger"],
      "priority": 1
    },
    {
      "id": "logic",
      "name": "Business Logic Agent",
      "description": "Domain-driven design and business rules implementation",
      "primary_tools": ["domain-modeling"],
      "priority": 2
    },
    {
      "id": "next",
      "name": "Next.js Agent",
      "description": "Next.js and React frontend development",
      "primary_tools": ["next", "react", "tailwind"],
      "priority": 1
    },
    {
      "id": "expo",
      "name": "Expo Agent",
      "description": "Expo and React Native mobile development",
      "primary_tools": ["expo", "react-native"],
      "priority": 1
    },
    {
      "id": "infra",
      "name": "Infrastructure Agent",
      "description": "DevOps and infrastructure management",
      "primary_tools": ["docker", "kubernetes", "github-actions"],
      "priority": 3
    },
    {
      "id": "qa",
      "name": "QA/Test Agent",
      "description": "Quality assurance and test automation",
      "primary_tools": ["jest", "playwright", "vitest"],
      "priority": 2
    },
    {
      "id": "uiux",
      "name": "UI/UX Agent",
      "description": "User interface and experience design",
      "primary_tools": ["figma", "css", "animations"],
      "priority": 3
    },
    {
      "id": "security",
      "name": "Security Agent",
      "description": "Application security and vulnerability management",
      "primary_tools": ["auth", "encryption", "audit"],
      "priority": 1
    },
    {
      "id": "docs",
      "name": "Documentation Agent",
      "description": "Technical documentation and guides",
      "primary_tools": ["markdown", "diagrams"],
      "priority": 4
    }
  ]
}
EOF

# 4. プロジェクト設定ファイル（.claude/claude.json）を生成
cat > ".claude/claude.json" << 'EOF'
{
  "version": "1.0.0",
  "project": {
    "name": "Agentix",
    "description": "AI-driven development system with specialized sub-agents",
    "type": "fullstack"
  },
  "agents": {
    "auto_delegate": true,
    "confidence_threshold": 0.7,
    "prefer_specialized": true
  },
  "tools": {
    "default_access": ["Read", "Edit", "MultiEdit", "Write", "Bash", "Grep", "Glob", "LS"],
    "restricted": ["WebSearch", "WebFetch"],
    "mcp_enabled": true
  },
  "workflow": {
    "code_review_after_write": true,
    "test_after_change": true,
    "document_after_major_change": true
  }
}
EOF

# 5. README.md を生成
cat > ".claude/README.md" << 'EOF'
# ClaudeCode サブエージェント設定

このディレクトリには、プロジェクト専用のClaudeCodeサブエージェントが含まれています。

## 利用可能なサブエージェント

1. **api** - Go-Zero API開発
2. **logic** - ビジネスロジック実装
3. **next** - Next.js フロントエンド開発
4. **expo** - Expo モバイル開発
5. **infra** - インフラストラクチャ管理
6. **qa** - 品質保証とテスト
7. **uiux** - UI/UX デザイン実装
8. **security** - セキュリティ実装
9. **docs** - ドキュメント作成

## 使用方法

### 自動委任
ClaudeCodeは、タスクの内容に基づいて適切なサブエージェントを自動的に選択します。

### 明示的な呼び出し
特定のサブエージェントを使用したい場合：

```
> apiサブエージェントを使用してREST APIを実装してください
> qaサブエージェントでテストを実行してください
> securityサブエージェントでセキュリティ監査を実施してください
```

### サブエージェントの管理

```
/agents
```

このコマンドで、サブエージェントの一覧表示、編集、新規作成が可能です。

## カスタマイズ

各サブエージェントのMarkdownファイルを編集することで、動作をカスタマイズできます：

- システムプロンプトの調整
- ツールアクセスの変更
- 説明文の更新

## カスタムエージェントの追加

新しいサブエージェントを追加するには：

1. `.claude/agents/` ディレクトリに新しい `.md` ファイルを作成
2. YAMLフロントマターで設定を定義
3. システムプロンプトを記述

例：
```markdown
---
name: custom-agent
description: カスタムエージェントの説明
tools: Read, Write, Edit
---

システムプロンプトをここに記述
```

## ベストプラクティス

1. サブエージェントは単一の責任に集中させる
2. 明確で具体的な指示を記述する
3. 必要なツールのみにアクセスを制限する
4. 定期的にパフォーマンスを評価し改善する

## トラブルシューティング

問題が発生した場合：

1. `/agents` コマンドでサブエージェントの状態を確認
2. サブエージェントファイルのYAMLフロントマターを検証
3. ツール名が正しいか確認
4. ClaudeCodeを再起動

## 関連スクリプト

- `scripts/setup.sh` - 初期セットアップ
- `scripts/setup_default_agents.sh` - デフォルトエージェントの生成

詳細は[ClaudeCode ドキュメント](https://docs.anthropic.com/ja/docs/claude-code/sub-agents)を参照してください。
EOF

# 6. Context7 MCPサーバーの初期導入
echo "🔧 Context7 MCPサーバーをセットアップ中..."
claude mcp add context7 -- npx --yes @upstash/context7-mcp

echo "✅ セットアップが完了しました！"
echo ""
echo "📊 作成された構造:"
echo ".claude/"
echo "  ├── agents/         (サブエージェント格納ディレクトリ)"
echo "  ├── claude.json     (プロジェクト設定)"
echo "  └── README.md       (使用方法)"
echo ""
echo "pm/"
echo "  └── registry.json   (エージェント登録情報)"
echo ""
echo "docs/agents/          (ドキュメントディレクトリ)"
echo ""
echo "🎉 ClaudeCodeサブエージェントシステムの準備が整いました！"
echo ""
echo "次のステップ:"
echo "1. ClaudeCodeで '/agents' コマンドを実行してサブエージェントを確認"
echo "2. 必要に応じて各サブエージェントのプロンプトをカスタマイズ"
echo "3. タスクを実行して自動委任を体験"
echo ""
echo "例: 'APIエンドポイントを実装してください' と入力すると、"
echo "     自動的にapiサブエージェントが呼び出されます。"