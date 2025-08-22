#!/usr/bin/env bash
# 要件定義書作成スクリプト

echo "📋 新規プロジェクトの要件定義書を作成します"
echo ""

# 実行モード選択
echo "実行モードを選択してください:"
echo "1) シンプルモード（基本的な質問のみ）"
echo "2) 詳細モード（すべての質問）"
echo "3) CLIモード（インタラクティブ）"
read -p "選択 (1-3): " mode

case $mode in
    1)
        cd scripts/requirements
        node requirements-agent.js
        ;;
    2)
        cd scripts/requirements
        node requirements-agent.js --detailed
        ;;
    3)
        cd scripts/requirements
        node requirements-agent-cli.js
        ;;
    *)
        echo "無効な選択です"
        exit 1
        ;;
esac
