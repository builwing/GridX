#!/usr/bin/env bash
# pmディレクトリを.claude内に移動するマイグレーションスクリプト
set -euo pipefail

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📁 PM ディレクトリ構造の最適化${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 現在の状態を確認
echo -e "${BLUE}🔍 現在の構造を確認中...${NC}"

# .claudeディレクトリの作成（存在しない場合）
if [[ ! -d ".claude" ]]; then
    echo -e "${YELLOW}📁 .claude ディレクトリを作成します${NC}"
    mkdir -p .claude
fi

# pmディレクトリの移動処理
if [[ -d "pm" ]]; then
    echo -e "${BLUE}📋 既存のpmディレクトリを検出${NC}"
    
    # .claude/pm が既に存在する場合の確認
    if [[ -d ".claude/pm" ]]; then
        echo -e "${YELLOW}⚠️  .claude/pm が既に存在します${NC}"
        read -p "既存の .claude/pm をバックアップして上書きしますか？ [y/N]: " overwrite
        
        if [[ "$overwrite" == "y" || "$overwrite" == "Y" ]]; then
            backup_dir=".claude/pm_backup_$(date +%Y%m%d_%H%M%S)"
            mv .claude/pm "$backup_dir"
            echo -e "${GREEN}✅ 既存のpmディレクトリをバックアップ: $backup_dir${NC}"
        else
            echo -e "${RED}処理を中止しました${NC}"
            exit 1
        fi
    fi
    
    # pmディレクトリを移動
    echo -e "${BLUE}📦 pmディレクトリを .claude 内に移動中...${NC}"
    mv pm .claude/
    echo -e "${GREEN}✅ pmディレクトリを移動しました${NC}"
    
elif [[ -d ".claude/pm" ]]; then
    echo -e "${GREEN}✅ pmディレクトリは既に .claude 内にあります${NC}"
else
    echo -e "${YELLOW}📁 新規にpmディレクトリ構造を作成します${NC}"
    mkdir -p .claude/pm/{prompts,policies,registry}
fi

# 基本構造の確認と作成
echo -e "${BLUE}📁 ディレクトリ構造を整備中...${NC}"

# 必要なディレクトリを作成
mkdir -p .claude/agents
mkdir -p .claude/pm/{prompts,policies,registry}
mkdir -p docs/agents

# PM設定ファイルの作成（存在しない場合）
if [[ ! -f ".claude/pm/registry.json" ]]; then
    echo -e "${BLUE}📝 PM registry.json を作成中...${NC}"
    cat > .claude/pm/registry.json << 'EOF'
{
  "agents": {
    "requirements": {
      "name": "requirements",
      "description": "要件定義の作成と管理",
      "priority": "high",
      "status": "active"
    },
    "pm": {
      "name": "pm",
      "description": "プロジェクト管理とタスク振り分け",
      "priority": "high",
      "status": "active"
    },
    "api": {
      "name": "api",
      "description": "バックエンドAPI開発",
      "priority": "high",
      "status": "active"
    },
    "logic": {
      "name": "logic",
      "description": "ビジネスロジック実装",
      "priority": "high",
      "status": "active"
    },
    "next": {
      "name": "next",
      "description": "Next.jsフロントエンド開発",
      "priority": "medium",
      "status": "active"
    },
    "expo": {
      "name": "expo",
      "description": "モバイルアプリ開発",
      "priority": "medium",
      "status": "active"
    },
    "infra": {
      "name": "infra",
      "description": "インフラストラクチャ管理",
      "priority": "high",
      "status": "active"
    },
    "qa": {
      "name": "qa",
      "description": "品質保証とテスト",
      "priority": "high",
      "status": "active"
    },
    "uiux": {
      "name": "uiux",
      "description": "UI/UXデザイン",
      "priority": "medium",
      "status": "active"
    },
    "security": {
      "name": "security",
      "description": "セキュリティ監査",
      "priority": "high",
      "status": "active"
    },
    "docs": {
      "name": "docs",
      "description": "ドキュメント作成",
      "priority": "medium",
      "status": "active"
    },
    "setup": {
      "name": "setup",
      "description": "環境構築と初期設定",
      "priority": "high",
      "status": "active"
    }
  },
  "version": "1.0.0",
  "updated": "$(date +%Y-%m-%d)"
}
EOF
fi

if [[ ! -f ".claude/pm/policies.md" ]]; then
    echo -e "${BLUE}📝 PM policies.md を作成中...${NC}"
    cat > .claude/pm/policies.md << 'EOF'
# PM（プロジェクトマネージャー）ポリシー

## 基本方針

### 1. タスク振り分けルール
- 要件定義書（REQUIREMENTS.md）に基づいて判断
- エージェントの専門性と現在の負荷を考慮
- 優先度（High/Medium/Low）に従って処理

### 2. エージェント管理
- 各エージェントの状態を registry.json で管理
- 定期的に健全性をチェック
- 問題発生時は代替エージェントを検討

### 3. 品質管理
- すべての成果物はチェックリストで検証
- テスト結果を必須とする
- ドキュメント更新を忘れない

## 連携ルール

### エージェント間の依存関係
```
requirements → pm → 各専門エージェント → qa → docs
```

### 優先順位
1. セキュリティ関連タスク
2. 本番環境影響タスク
3. 機能開発タスク
4. ドキュメント更新

## エスカレーション

### 自動エスカレーション条件
- エラー率が10%を超える
- レスポンスタイムアウト
- リソース不足

### 手動エスカレーション
- 要件の不明確さ
- 技術的な判断が必要
- 複数エージェントの調整が必要
EOF
fi

# スクリプトのパス更新を提案
echo ""
echo -e "${BLUE}📝 スクリプトのパス更新が必要な箇所:${NC}"
echo ""

# パスを更新する必要のあるスクリプトを検索
SCRIPTS_TO_UPDATE=$(grep -l "pm/" scripts/*.sh 2>/dev/null | head -5 || true)

if [[ -n "$SCRIPTS_TO_UPDATE" ]]; then
    echo -e "${YELLOW}以下のスクリプトでパス更新が必要です:${NC}"
    for script in $SCRIPTS_TO_UPDATE; do
        echo "  • $(basename $script)"
    done
    echo ""
    echo -e "${CYAN}これらのスクリプトのパスを pm/ から .claude/pm/ に更新してください${NC}"
else
    echo -e "${GREEN}✅ パス更新が必要なスクリプトは見つかりませんでした${NC}"
fi

# .claude/README.md の作成
echo -e "${BLUE}📝 .claude/README.md を作成中...${NC}"
cat > .claude/README.md << 'EOF'
# Claude エージェント設定ディレクトリ

このディレクトリには、ClaudeCodeのサブエージェントとPM（プロジェクトマネージャー）の設定が含まれています。

## ディレクトリ構造

```
.claude/
├── agents/           # 各エージェントの定義ファイル
│   ├── requirements.md
│   ├── api.md
│   ├── logic.md
│   ├── next.md
│   ├── expo.md
│   ├── infra.md
│   ├── qa.md
│   ├── uiux.md
│   ├── security.md
│   ├── docs.md
│   └── setup.md
├── pm/              # プロジェクトマネージャー設定
│   ├── registry.json   # エージェント登録情報
│   ├── policies.md     # 運用ポリシー
│   └── prompts/       # PMプロンプト集
└── README.md        # このファイル
```

## 使用方法

### エージェントの追加
```bash
./scripts/setup_custom_agents.sh -i
```

### エージェントの更新
```bash
./scripts/update_requirements.sh update
```

### PM設定の編集
- `pm/registry.json`: エージェント登録情報
- `pm/policies.md`: タスク振り分けルール

## 注意事項

- このディレクトリはGitで管理されます
- エージェント定義の変更は慎重に行ってください
- REQUIREMENTS.md との整合性を保つこと
EOF

# 完了メッセージ
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ディレクトリ構造の最適化が完了しました${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📁 新しい構造:${NC}"
echo "  .claude/"
echo "  ├── agents/     # エージェント定義"
echo "  ├── pm/        # PM設定（移動済み）"
echo "  └── README.md  # 説明書"
echo ""
echo -e "${CYAN}📝 次のステップ:${NC}"
echo "  1. 必要に応じてスクリプトのパスを更新"
echo "  2. ./scripts/generate_agents_from_requirements.sh でエージェント生成"
echo "  3. README.md のディレクトリ構造説明を確認"
echo ""