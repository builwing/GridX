# 🤖 Agentix - SubAgent開発システム／ClaudeCode

高度なAI駆動のSubAgentシステムで、複雑なソフトウェア開発タスクを自動化・最適化します。

## 📖 概要

Agentixは、専門特化した複数のAIエージェントを統合管理し、効率的なソフトウェア開発を実現するフレームワークです。
PM（プロジェクトマネージャー）が中心となり、タスクを適切なエージェントに振り分け、品質を保証しながら開発を進めます。

このシステムは、**Go-Zero、Next.js、Expo**を活用したモダンなアプリケーション開発における**AI駆動の開発システム構築の初期設定**として設計されています。

### ✨ 主な特徴

- 🎯 **9つの専門エージェント** - API、ロジック、フロントエンド、モバイル、インフラ、QA、UI/UX、セキュリティ、ドキュメント
- 🤖 **インテリジェントPM** - AIによるタスク分析と最適な振り分け
- 📝 **要件駆動開発** - すべての実装が要件定義に基づく
- 🔄 **完全自動化** - セットアップから実行、レポート生成まで
- 📊 **可視化ダッシュボード** - リアルタイムでプロジェクト状態を監視
- 🌐 **日本語優先** - すべてのコミュニケーションとドキュメントが日本語対応

## 🚀 クイックスタート

### 前提条件

- Bash 4.0以上
- Node.js 18以上（要件定義ツール用）
- Git

### インストール

```bash
# リポジトリのクローン
git clone git@github.com:builwing/Agentix.git my-project
cd my-project
```
### 新規プロジェクト化

```bash
# 既存クローンのルートで
rm -rf .git
git init
git add -A
git commit -m "Initial commit (based on <source>)"

# 初期セットアップ（基礎構築）
# ※ Context7 MCPサーバーのセットアップも自動実行されます

./scripts/setup.sh

# デフォルトサブエージェント生成

./scripts/setup_default_agents.sh
```

これにより以下が作成されます：
- 📁 `docs/agents/` - 各エージェントの要件定義とチェックリスト
- 📁 `pm/` - PMの設定とポリシー
- 📄 `CLAUDE.md` - ClaudeCode用の自動生成された指示書
- 🔧 **Context7 MCPサーバー** - 高度なコンテキスト管理システム（自動セットアップ）

## 📦 システム構成

### 基礎構築

| スクリプト | 説明 |
|-----------|------|
| `scripts/setup.sh` | 初期ディレクトリ構造とPM設定を作成、**Context7 MCPサーバーも自動セットアップ** |
| `scripts/setup_default_agents.sh` | **11個のデフォルトサブエージェントを生成（setupエージェント追加）** |
| `scripts/setup_custom_agents.sh` | **カスタムエージェントを対話式で作成** |
| `scripts/generate_claude_md.sh` | CLAUDE.mdを実際の構成に基づいて自動生成 |
| `scripts/setup_requirements_agent.sh` | Node.jsベースの要件定義ツールをセットアップ |
| `scripts/install_scripts.sh` | PMスクリプト群（pm_dispatch, pm_validate等）を生成 |
| `scripts/install_pm_prompts.sh` | PMとAgent用のSystemプロンプト設定 |
| `scripts/install_hooks.sh` | Git HooksとCI/CD設定 |

### 自動化

| スクリプト | 説明 |
|-----------|------|
| `scripts/install_llm_router.sh` | LLM統合による高度な振り分けシステム |
| `scripts/install_mcp_tools.sh` | MCPツールとの連携設定 |
| `scripts/install_auto_testing.sh` | 自動テスト実行システム |
| `scripts/install_metrics.sh` | メトリクス収集と分析システム |

### 高度化

| スクリプト | 説明 |
|-----------|------|
| `scripts/install_rag_system.sh` | RAG/埋め込み検索システム |
| `scripts/install_multi_llm.sh` | 複数LLMプロバイダー対応 |
| `scripts/install_realtime_dashboard.sh` | リアルタイム監視ダッシュボード |
| `scripts/install_cordination.sh` | Agent間自動協調システム |

## 🔄 作業フローの標準化

### **「読む→計画→実装→記録」サイクル**

1. **先読み強制**
   - `docs/agents/`内の要件定義を必ず読み込み
   - 7行以内での要約を義務化

2. **計画提示**
   - 実装計画を根拠付きで提示
   - 受け入れ基準（AC）との紐付け

3. **実装/提案**
   - 要件定義の根拠を常に参照
   - ACを満たす実装のみ許可

4. **履歴記録**
   - HISTORY.mdへの自動追記
   - タイムスタンプ、タスク内容、参照、コミットIDを記録

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────┐
│       PM (Project Manager)           │
│   タスク分析・振り分け・管理         │
└─────────────┬───────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────┐        ┌─────────┐
│   API   │        │  Logic  │
│ Go-Zero │        │ Business│
└─────────┘        └─────────┘
    
┌─────────┐        ┌─────────┐
│  Next   │        │  Expo   │
│ Web App │        │ Mobile  │
└─────────┘        └─────────┘

┌─────────┐        ┌─────────┐
│  Infra  │        │   QA    │
│ DevOps  │        │  Test   │
└─────────┘        └─────────┘

┌─────────┐        ┌─────────┐
│  UI/UX  │        │Security │
│ Design  │        │  Auth   │
└─────────┘        └─────────┘

┌─────────┐
│  Docs   │
│Markdown │
└─────────┘
```

## 📋 エージェント一覧

| Agent | 役割 | 主要技術 | サブエージェントファイル |
|-------|------|----------|-------------------|
| **requirements** | 要件定義管理と振り分け ⭐ | 要件収集, 分析, 配布 | `.claude/agents/requirements.md` |
| **setup** | 環境構築・セットアップ ⭐NEW | プロジェクト構造生成, 依存関係管理 | `.claude/agents/setup.md` |
| **api** | バックエンドAPI開発 | Go-Zero, MariaDB, Redis | `.claude/agents/api.md` |
| **logic** | ビジネスロジック設計 | ドメイン駆動設計, 状態管理 | `.claude/agents/logic.md` |
| **next** | Webフロントエンド | Next.js 14+, React, TypeScript | `.claude/agents/next.md` |
| **expo** | モバイルアプリ | Expo, React Native | `.claude/agents/expo.md` |
| **infra** | インフラ・DevOps | Docker, Nginx, CI/CD | `.claude/agents/infra.md` |
| **qa** | 品質保証・テスト | Jest, Playwright, E2E | `.claude/agents/qa.md` |
| **uiux** | UI/UXデザイン | Figma連携, アクセシビリティ | `.claude/agents/uiux.md` |
| **security** | セキュリティ | JWT, RBAC, OWASP | `.claude/agents/security.md` |
| **docs** | ドキュメント管理 | Markdown, OpenAPI | `.claude/agents/docs.md` |

## 🔄 基本的な使い方

### 1. セットアップフロー

```bash
# 基礎構築
./scripts/setup.sh                        # PMとディレクトリ構造作成、Context7 MCPセットアップ
./scripts/setup_default_agents.sh        # 10個のデフォルトサブエージェント生成
./scripts/setup_requirements_agent.sh    # 要件定義ツールのセットアップ
./scripts/install_scripts.sh             # PMスクリプト群生成
./scripts/install_pm_prompts.sh          # プロンプト設定
./scripts/install_hooks.sh               # Git Hooks

# 自動化（オプション）
./scripts/install_llm_router.sh          # LLM振り分け
./scripts/install_mcp_tools.sh           # MCPツール
./scripts/install_auto_testing.sh        # 自動テスト
./scripts/install_metrics.sh             # メトリクス

# 高度化（オプション）
./scripts/install_rag_system.sh          # RAG検索
./scripts/install_multi_llm.sh           # マルチLLM
./scripts/install_realtime_dashboard.sh  # ダッシュボード
./scripts/install_coordination.sh        # Agent協調
```

### 2. 要件定義の作成

```bash
# 対話式で要件を収集
./scripts/create-requirements.sh

# またはClaudeCode内でrequirementsサブエージェントを使用
# 「要件定義を作成してください」
```

### 3. カスタムエージェント作成

```bash
# 対話モードで作成（推奨）
./scripts/setup_custom_agents.sh -i

# コマンドラインで直接作成
./scripts/setup_custom_agents.sh -n database -d "データベース管理" -t "Read,Write,Bash"
```

### 4. タスク実行

```bash
# PMによるタスク振り分け
./scripts/pm_dispatch.sh "ユーザー認証APIを実装"

# 特定Agentで実行
./scripts/agent_start.sh api "JWT認証実装"

# カスタムエージェントで実行
./agents/instances/nextjs-app/run.sh "ランディングページ実装"

# 作業履歴の記録
./scripts/agent_log.sh api "実装完了" "REQUIREMENTS.md#L30"

# システム検証
./scripts/pm_validate.sh
```

## 📊 ドキュメント構成

```
.claude/                  # ClaudeCodeサブエージェント設定
├── agents/              # サブエージェント定義（11ファイル）
│   ├── requirements.md  # 要件定義管理
│   ├── setup.md        # 環境構築・セットアップ
│   ├── api.md          # API開発
│   ├── logic.md        # ビジネスロジック
│   ├── next.md         # Webフロントエンド
│   ├── expo.md         # モバイルアプリ
│   ├── infra.md        # インフラ
│   ├── qa.md           # 品質保証
│   ├── uiux.md         # UI/UX
│   ├── security.md     # セキュリティ
│   └── docs.md         # ドキュメント
├── claude.json          # プロジェクト設定
└── README.md            # 使用ガイド

docs/
├── agents/
│   ├── api/
│   │   ├── REQUIREMENTS.md  # 要件定義
│   │   ├── CHECKLIST.md     # チェックリスト
│   │   └── HISTORY.md       # 作業履歴
│   ├── logic/
│   ├── next/
│   ├── expo/
│   ├── infra/
│   ├── qa/
│   ├── uiux/
│   ├── security/
│   └── docs/

pm/
├── registry.json           # Agent登録情報
├── policies.md            # 運用方針
└── prompts/              # プロンプト集

scripts/                  # 実行スクリプト
├── setup.sh             # 初期セットアップ（Context7 MCP含む）
├── setup_default_agents.sh  # 11個のサブエージェント生成
├── setup_custom_agents.sh   # カスタムエージェント作成
├── setup_requirements_agent.sh  # 要件定義ツール
├── setup_project_structure.sh   # プロジェクト構造自動生成
├── create-requirements.sh   # 要件収集実行
├── install_scripts.sh       # PMスクリプト生成
├── pm_dispatch.sh          # タスク振り分け（生成）
├── pm_validate.sh          # システム検証（生成）
├── pm_register_agent.sh    # エージェント登録
└── requirements/            # 要件定義ツール
    ├── requirements-agent.js     # Node.jsツール
    ├── requirements-agent-cli.js # CLI版
    └── package.json              # 依存関係
```

## 🎯 ベストプラクティス

### 1. PM（プロジェクトマネージャー）中心の設計
- Routerではなく「PM」として位置づけ
- ルールベース＋LLM分類のハイブリッド判定
- 信頼度スコア（confidence）による自動/手動レビュー

### 2. 要件駆動開発
- すべての実装は要件定義書に基づく
- 受け入れ基準（AC）の明確化
- 作業前に必ず要件を確認

### 3. 履歴管理
- すべての作業をHISTORY.mdに記録
- タイムスタンプと参照を含める
- 知識の蓄積と共有

### 4. 品質保証
- チェックリストの完全実施
- 自動テストの活用
- メトリクスによる継続的改善

## 🔧 トラブルシューティング

### セットアップが失敗する場合
```bash
# 権限の確認
chmod +x *.sh

# 依存関係の確認
node --version  # v18以上
bash --version  # v4.0以上
```

### CLAUDE.mdが生成されない場合
```bash
# 手動で生成
./scripts/generate_claude_md.sh
```

### Agentが見つからない場合
```bash
# ディレクトリ構造の再作成
./scripts/setup.sh
```

## 📝 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📞 サポート

- 📧 Email: wingnakaada@gmail.com

## 🙏 謝辞

このプロジェクトは、Claude (Anthropic)、Go-Zero、Next.js、Expo などのオープンソースプロジェクトに支えられています。

---

**Made with ❤️ by the Agentix Team**