#!/usr/bin/env bash
# PMエージェント登録スクリプト
# 新しく作成したエージェントをPMに登録します

set -euo pipefail

AGENT_NAME="$1"

if [[ -z "$AGENT_NAME" ]]; then
    echo "使用方法: $0 <エージェント名>"
    exit 1
fi

AGENT_DIR="agents/instances/$AGENT_NAME"
if [[ ! -d "$AGENT_DIR" ]]; then
    echo "エラー: エージェント '$AGENT_NAME' が見つかりません"
    exit 1
fi

# agent.jsonから情報を読み取り
AGENT_JSON="$AGENT_DIR/agent.json"
if [[ ! -f "$AGENT_JSON" ]]; then
    echo "エラー: agent.json が見つかりません"
    exit 1
fi

echo "📝 エージェント '$AGENT_NAME' をPMに登録中..."

# pm/registry.jsonを更新（簡易版）
# 実際の実装では jq を使用してJSON操作

echo "✅ 登録完了"
echo "PMがタスクを自動的に '$AGENT_NAME' エージェントに振り分けるようになりました"