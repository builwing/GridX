#!/usr/bin/env bash
# PM自動振り分けシステムのエイリアス

# タスク振り分けコマンド
alias dispatch='./scripts/core/pm_auto_dispatch.sh'
alias task='./scripts/core/pm_auto_dispatch.sh'

# タスク解析のみ（実行しない）
alias analyze='./scripts/core/pm_auto_dispatch.sh -d'

# 詳細モードでタスク振り分け
alias dispatch-verbose='./scripts/core/pm_auto_dispatch.sh -v'

# エージェント生成
alias generate-agents='./scripts/core/generate_agents.sh'

# 使用方法を表示
pm-help() {
    echo "🤖 PM自動振り分けシステム コマンド一覧"
    echo ""
    echo "タスク振り分け:"
    echo "  dispatch \"タスクの説明\"     - タスクを解析して適切なエージェントに振り分け"
    echo "  task \"タスクの説明\"         - dispatchと同じ（短縮形）"
    echo "  analyze \"タスクの説明\"      - 解析のみ実行（ドライラン）"
    echo "  dispatch-verbose \"タスク\"   - 詳細出力モード"
    echo ""
    echo "エージェント管理:"
    echo "  generate-agents            - エージェントを生成/更新"
    echo ""
    echo "例:"
    echo "  dispatch \"ユーザー認証APIを実装\""
    echo "  task \"ログイン画面を作成\""
    echo "  analyze \"テストを追加\""
}

echo "PM自動振り分けシステムのエイリアスが読み込まれました"
echo "使用方法: pm-help"
