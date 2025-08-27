#!/usr/bin/env python3
"""
PMエージェント自動振り分けシステム
タスクの説明から適切なエージェントを自動選定
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

# カラー出力用
class Colors:
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    RED = '\033[0;31m'
    NC = '\033[0m'  # No Color

def load_agent_definitions():
    """エージェント定義の読み込み"""
    definitions_file = Path("AGENT_DEFINITIONS.md")
    if not definitions_file.exists():
        print(f"{Colors.RED}エラー: AGENT_DEFINITIONS.md が見つかりません{Colors.NC}")
        return []
    
    agents = []
    current_agent = None
    
    with open(definitions_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        # エージェント名を抽出
        if line.startswith("## "):
            if current_agent:
                agents.append(current_agent)
            agent_name = line[3:].strip()
            # PMエージェントは除外
            if agent_name.lower() != "pm":
                current_agent = {
                    'name': agent_name,
                    'keywords': [],
                    'description': '',
                    'score': 0
                }
            else:
                current_agent = None
        
        # キーワードを抽出
        elif current_agent and '**キーワード**' in line:
            # 次の行からキーワードを抽出
            idx = lines.index(line) + 1
            while idx < len(lines) and lines[idx].strip():
                keyword_line = lines[idx].strip()
                if keyword_line.startswith('-'):
                    keyword = keyword_line[1:].strip()
                    current_agent['keywords'].append(keyword.lower())
                idx += 1
        
        # 説明を抽出
        elif current_agent and '**説明**' in line:
            idx = lines.index(line) + 1
            description_lines = []
            while idx < len(lines) and not lines[idx].startswith('#'):
                if lines[idx].strip():
                    description_lines.append(lines[idx].strip())
                idx += 1
            current_agent['description'] = ' '.join(description_lines)
    
    if current_agent:
        agents.append(current_agent)
    
    return agents

def analyze_task(task_description):
    """タスクの内容を解析"""
    task_lower = task_description.lower()
    
    # 特定のパターンを検出
    patterns = {
        'api': r'(api|endpoint|rest|graphql|swagger|openapi)',
        'frontend': r'(ui|ux|画面|コンポーネント|component|react|vue|angular)',
        'backend': r'(バックエンド|backend|サーバー|server|database|db)',
        'test': r'(テスト|test|spec|単体|結合|e2e)',
        'security': r'(セキュリティ|security|脆弱性|vulnerability|認証|authorization)',
        'performance': r'(パフォーマンス|performance|最適化|optimization|速度|speed)',
        'docs': r'(ドキュメント|document|docs|readme|仕様書)',
        'infra': r'(インフラ|infrastructure|docker|kubernetes|aws|gcp|azure)',
        'data': r'(データ|data|分析|analysis|集計|aggregate)',
        'mobile': r'(モバイル|mobile|ios|android|react native)',
    }
    
    detected_patterns = []
    for pattern_name, pattern_regex in patterns.items():
        if re.search(pattern_regex, task_lower):
            detected_patterns.append(pattern_name)
    
    return detected_patterns

def calculate_agent_score(agent, task_description, detected_patterns):
    """エージェントのスコアを計算"""
    score = 0
    task_lower = task_description.lower()
    
    # キーワードマッチング
    for keyword in agent['keywords']:
        if keyword in task_lower:
            score += 10
    
    # パターンマッチング
    agent_name_lower = agent['name'].lower()
    for pattern in detected_patterns:
        if pattern in agent_name_lower:
            score += 15
    
    # 説明文との類似度（簡易版）
    description_words = set(agent['description'].lower().split())
    task_words = set(task_lower.split())
    common_words = description_words & task_words
    if common_words:
        score += len(common_words) * 2
    
    return score

def select_agent(task_description):
    """最適なエージェントを選択"""
    agents = load_agent_definitions()
    if not agents:
        return None
    
    detected_patterns = analyze_task(task_description)
    
    # 各エージェントのスコアを計算
    for agent in agents:
        agent['score'] = calculate_agent_score(agent, task_description, detected_patterns)
    
    # スコアでソート
    agents.sort(key=lambda x: x['score'], reverse=True)
    
    # 最高スコアのエージェントを選択
    if agents[0]['score'] > 0:
        return agents[0]
    
    # スコアがゼロの場合はデフォルトエージェントを返す
    return {'name': 'general', 'score': 0, 'description': 'デフォルト汎用エージェント'}

def save_dispatch_history(task_description, selected_agent):
    """振り分け履歴を保存"""
    history_dir = Path(".claude/pm/state")
    history_dir.mkdir(parents=True, exist_ok=True)
    
    history_file = history_dir / "dispatch_history.json"
    
    # 既存の履歴を読み込み
    if history_file.exists():
        with open(history_file, 'r', encoding='utf-8') as f:
            history = json.load(f)
    else:
        history = []
    
    # 新しい履歴を追加
    history.append({
        'timestamp': datetime.now().isoformat(),
        'task': task_description,
        'agent': selected_agent['name'],
        'score': selected_agent['score']
    })
    
    # 最新100件のみ保持
    history = history[-100:]
    
    # 保存
    with open(history_file, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)
    
    # last_dispatch.jsonも保存（pm_auto_dispatch.shから参照される）
    last_dispatch_file = Path(".claude/hooks/last_dispatch.json")
    last_dispatch_file.parent.mkdir(parents=True, exist_ok=True)
    
    dispatch_data = {
        'timestamp': datetime.now().isoformat(),
        'task': task_description,
        'task_info': {
            'primary_agent': selected_agent['name'],
            'requires_pm': False,  # 単一エージェントの場合は常にFalse
            'related_agents': [selected_agent['name']],
            'confidence_score': selected_agent['score']
        }
    }
    
    with open(last_dispatch_file, 'w', encoding='utf-8') as f:
        json.dump(dispatch_data, f, ensure_ascii=False, indent=2)

def main():
    """メイン処理"""
    if len(sys.argv) < 2:
        print(f"{Colors.RED}エラー: タスクの説明を指定してください{Colors.NC}")
        print("使用方法: task-dispatcher.py \"タスクの説明\"")
        sys.exit(1)
    
    task_description = ' '.join(sys.argv[1:])
    
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.NC}")
    print(f"{Colors.BLUE}🤖 PMエージェント自動振り分けシステム{Colors.NC}")
    print(f"{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.NC}")
    print()
    
    print(f"{Colors.BLUE}📋 タスク内容:{Colors.NC}")
    print(f"  {task_description}")
    print()
    
    print(f"{Colors.BLUE}🔍 タスクを解析中...{Colors.NC}")
    selected_agent = select_agent(task_description)
    
    if selected_agent:
        print(f"{Colors.GREEN}✅ 最適なエージェントを選定しました{Colors.NC}")
        print()
        print(f"{Colors.CYAN}📊 選定結果:{Colors.NC}")
        print(f"  エージェント: {selected_agent['name']}")
        print(f"  信頼度スコア: {selected_agent['score']}")
        print()
        
        # 履歴を保存
        save_dispatch_history(task_description, selected_agent)
        
        # 結果を出力（他のスクリプトから利用可能）
        print(f"{Colors.GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.NC}")
        print(f"SELECTED_AGENT={selected_agent['name']}")
    else:
        print(f"{Colors.YELLOW}⚠️  適切なエージェントが見つかりませんでした{Colors.NC}")
        print(f"  デフォルトエージェントを使用します")
        print(f"{Colors.YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.NC}")
        print("SELECTED_AGENT=general")

if __name__ == "__main__":
    main()