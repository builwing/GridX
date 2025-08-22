#!/usr/bin/env node
/**
 * Requirements Definition Agent CLI
 * インタラクティブな要件定義書作成ツール
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import yaml from 'yaml';

class RequirementsAgentCLI {
    constructor() {
        this.projectData = {};
        this.templates = {};
    }

    async run() {
        console.log(chalk.bold.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     📋 Requirements Definition Agent CLI                     ║
║        インタラクティブ要件定義書作成システム                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `));

        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '実行する操作を選択してください',
                choices: [
                    { name: '🆕 新規プロジェクトの要件定義', value: 'new' },
                    { name: '📝 既存プロジェクトの編集', value: 'edit' },
                    { name: '📄 テンプレートから作成', value: 'template' },
                    { name: '✅ 要件定義書の検証', value: 'validate' },
                    { name: '📤 エクスポート', value: 'export' },
                    { name: '❌ 終了', value: 'exit' }
                ]
            }
        ]);

        switch (action) {
            case 'new':
                await this.createNewProject();
                break;
            case 'edit':
                await this.editProject();
                break;
            case 'template':
                await this.createFromTemplate();
                break;
            case 'validate':
                await this.validateRequirements();
                break;
            case 'export':
                await this.exportRequirements();
                break;
            case 'exit':
                console.log(chalk.green('👋 終了します'));
                process.exit(0);
        }
    }

    async createNewProject() {
        console.log(chalk.bold('\n📋 新規プロジェクト要件定義\n'));

        // 基本情報
        const basicInfo = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'プロジェクト名',
                validate: input => input.length > 0 || '必須項目です'
            },
            {
                type: 'editor',
                name: 'description',
                message: 'プロジェクトの詳細説明（エディタが開きます）'
            },
            {
                type: 'list',
                name: 'type',
                message: 'プロジェクトタイプ',
                choices: [
                    'Webアプリケーション',
                    'モバイルアプリ',
                    'API開発',
                    'フルスタック',
                    'マイクロサービス',
                    'その他'
                ]
            },
            {
                type: 'input',
                name: 'version',
                message: 'バージョン',
                default: '1.0.0'
            }
        ]);

        // ビジネス要件
        console.log(chalk.bold('\n💼 ビジネス要件\n'));
        const businessReq = await inquirer.prompt([
            {
                type: 'input',
                name: 'targetUsers',
                message: '想定ユーザー（例: B2C、社内向け、企業向け）'
            },
            {
                type: 'input',
                name: 'userScale',
                message: '想定ユーザー規模（例: 1000人、10万人）'
            },
            {
                type: 'checkbox',
                name: 'mainFeatures',
                message: '主要機能（複数選択可）',
                choices: [
                    'ユーザー認証',
                    'データ管理（CRUD）',
                    '検索機能',
                    '通知機能',
                    '決済機能',
                    'レポート生成',
                    'リアルタイム通信',
                    'ファイルアップロード',
                    'メール送信',
                    'スケジュール管理',
                    'ダッシュボード',
                    'API提供',
                    'その他'
                ]
            }
        ]);

        // 技術要件
        console.log(chalk.bold('\n⚙️ 技術要件\n'));
        const techReq = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'platforms',
                message: '対象プラットフォーム',
                choices: ['Web', 'iOS', 'Android', 'Desktop']
            },
            {
                type: 'list',
                name: 'architecture',
                message: 'アーキテクチャ',
                choices: [
                    'モノリシック',
                    'マイクロサービス',
                    'サーバーレス',
                    'イベント駆動',
                    'その他'
                ]
            },
            {
                type: 'confirm',
                name: 'needsScaling',
                message: 'スケーラビリティは重要ですか？',
                default: true
            },
            {
                type: 'input',
                name: 'performanceReq',
                message: 'パフォーマンス要件（例: レスポンス200ms以内）'
            }
        ]);

        // 制約事項
        console.log(chalk.bold('\n📅 制約事項\n'));
        const constraints = await inquirer.prompt([
            {
                type: 'input',
                name: 'deadline',
                message: 'プロジェクト期限（YYYY-MM-DD）',
                validate: input => {
                    const date = new Date(input);
                    return !isNaN(date.getTime()) || '有効な日付を入力してください';
                }
            },
            {
                type: 'list',
                name: 'budget',
                message: '予算規模',
                choices: [
                    '小規模（〜100万円）',
                    '中規模（100万円〜1000万円）',
                    '大規模（1000万円〜）',
                    '未定'
                ]
            },
            {
                type: 'input',
                name: 'teamSize',
                message: 'チーム規模（人数）',
                validate: input => !isNaN(parseInt(input)) || '数値を入力してください'
            }
        ]);

        // データ統合
        this.projectData = {
            id: uuidv4(),
            ...basicInfo,
            business: businessReq,
            technical: techReq,
            constraints,
            createdAt: new Date().toISOString(),
            status: 'draft'
        };

        // 保存確認
        const { shouldSave } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'shouldSave',
                message: '要件定義書を生成して保存しますか？',
                default: true
            }
        ]);

        if (shouldSave) {
            await this.saveAllRequirements();
        }
    }

    async saveAllRequirements() {
        const spinner = ora('要件定義書を生成中...').start();

        try {
            // マスター要件定義書
            spinner.text = 'マスター要件定義書を作成中...';
            const masterDoc = this.generateMasterDocument();
            await fs.mkdir('doc', { recursive: true });
            await fs.writeFile('doc/MASTER_REQUIREMENTS.md', masterDoc);

            // 各Agent用要件定義書
            const agents = ['api', 'logic', 'next', 'expo', 'infra', 'qa', 'uiux', 'security', 'docs'];
            
            for (const agent of agents) {
                spinner.text = `${agent} Agent用要件定義書を作成中...`;
                
                const agentDir = path.join('doc', 'agents', agent);
                await fs.mkdir(agentDir, { recursive: true });
                
                // REQUIREMENTS.md
                const reqDoc = this.generateAgentRequirements(agent);
                await fs.writeFile(path.join(agentDir, 'REQUIREMENTS.md'), reqDoc);
                
                // CHECKLIST.md
                const checklist = this.generateAgentChecklist(agent);
                await fs.writeFile(path.join(agentDir, 'CHECKLIST.md'), checklist);
                
                // HISTORY.md
                const history = this.initializeHistory(agent);
                await fs.writeFile(path.join(agentDir, 'HISTORY.md'), history);
            }

            // セッション保存
            const sessionFile = `requirements/sessions/${this.projectData.id}.json`;
            await fs.mkdir('requirements/sessions', { recursive: true });
            await fs.writeFile(sessionFile, JSON.stringify(this.projectData, null, 2));

            spinner.succeed('要件定義書の生成が完了しました');
            
            this.showSummary();
            
        } catch (error) {
            spinner.fail('エラー: ' + error.message);
        }
    }

    generateMasterDocument() {
        const { name, description, type, version, business, technical, constraints } = this.projectData;
        
        return `# ${name} - マスター要件定義書

## 📋 プロジェクト概要

| 項目 | 内容 |
|------|------|
| **プロジェクト名** | ${name} |
| **バージョン** | ${version} |
| **タイプ** | ${type} |
| **作成日** | ${new Date().toISOString().split('T')[0]} |
| **ステータス** | Draft |

### 説明
${description}

---

## 🎯 ビジネス要件

### ターゲットユーザー
- **対象**: ${business.targetUsers}
- **規模**: ${business.userScale}

### 主要機能
${business.mainFeatures.map(f => `- ${f}`).join('\n')}

---

## 💻 技術要件

### プラットフォーム
${technical.platforms.map(p => `- ${p}`).join('\n')}

### アーキテクチャ
- **タイプ**: ${technical.architecture}
- **スケーラビリティ**: ${technical.needsScaling ? '必要' : '不要'}

### パフォーマンス要件
${technical.performanceReq}

---

## 📅 制約事項

| 項目 | 内容 |
|------|------|
| **期限** | ${constraints.deadline} |
| **予算** | ${constraints.budget} |
| **チーム規模** | ${constraints.teamSize}人 |

---

## ✅ 成功基準

1. すべての主要機能が実装される
2. パフォーマンス要件を満たす
3. 期限内に完成する
4. 予算内で完成する

---

## 📊 リスク管理

### 技術的リスク
- スケーラビリティの課題
- セキュリティ脆弱性
- 技術的負債

### プロジェクトリスク
- スケジュール遅延
- 要件変更
- リソース不足

---

## 🔄 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|-----------|----------|--------|
| ${new Date().toISOString().split('T')[0]} | 1.0.0 | 初版作成 | Requirements Agent |
`;
    }

    generateAgentRequirements(agent) {
        const agentConfigs = {
            api: {
                purpose: 'バックエンドAPIの設計と実装',
                priority: 'high',
                mainTasks: [
                    'RESTful API設計',
                    'データベース設計',
                    'ビジネスロジック実装',
                    'セキュリティ実装'
                ]
            },
            next: {
                purpose: 'Webフロントエンドの実装',
                priority: this.projectData.technical.platforms.includes('Web') ? 'high' : 'low',
                mainTasks: [
                    'UIコンポーネント開発',
                    'ページ実装',
                    'API統合',
                    'SEO最適化'
                ]
            },
            expo: {
                purpose: 'モバイルアプリケーションの開発',
                priority: (this.projectData.technical.platforms.includes('iOS') || 
                          this.projectData.technical.platforms.includes('Android')) ? 'high' : 'low',
                mainTasks: [
                    'モバイルUI実装',
                    'ナビゲーション実装',
                    'プッシュ通知',
                    'オフライン対応'
                ]
            },
            // 他のAgentも同様に定義...
        };

        const config = agentConfigs[agent] || agentConfigs.api;
        
        return `---
agent: ${agent}
project: ${this.projectData.name}
version: 1.0.0
owners:
  - name: "ProductOwner"
  - name: "TechLead"
status: draft
last_updated: ${new Date().toISOString().split('T')[0]}
priority: ${config.priority}
---

# 目的
${config.purpose}

# 主要タスク
${config.mainTasks.map(t => `- ${t}`).join('\n')}

# プロジェクト固有要件
${this.getAgentSpecificRequirements(agent)}

# 受け入れ基準
${this.getAgentAcceptanceCriteria(agent)}

# テスト観点
- 単体テスト実装
- 統合テスト実装
- パフォーマンステスト
`;
    }

    getAgentSpecificRequirements(agent) {
        // プロジェクトデータに基づいて各Agent固有の要件を生成
        const features = this.projectData.business.mainFeatures;
        let requirements = [];

        switch(agent) {
            case 'api':
                if (features.includes('ユーザー認証')) {
                    requirements.push('- JWT認証システムの実装');
                }
                if (features.includes('決済機能')) {
                    requirements.push('- 決済APIの統合');
                }
                break;
            case 'next':
                if (this.projectData.technical.platforms.includes('Web')) {
                    requirements.push('- レスポンシブデザイン対応');
                    requirements.push('- ' + this.projectData.technical.performanceReq);
                }
                break;
            // 他のAgentも同様
        }

        return requirements.join('\n') || '- プロジェクト要件に準拠';
    }

    getAgentAcceptanceCriteria(agent) {
        const criteria = [
            '1. 要件定義書の内容を満たしている',
            '2. テストが実装されている',
            '3. ドキュメントが作成されている'
        ];

        // Agent固有の基準を追加
        if (agent === 'api' && this.projectData.business.mainFeatures.includes('ユーザー認証')) {
            criteria.push('4. 認証システムが正常に動作する');
        }

        return criteria.join('\n');
    }

    generateAgentChecklist(agent) {
        return `# ${agent} Agent チェックリスト

## 🔍 着手前チェック
- [ ] REQUIREMENTS.md を読んで理解した
- [ ] 必要な開発環境を準備した
- [ ] 依存関係を確認した

## 🔨 実装中チェック
- [ ] コーディング規約に従っている
- [ ] エラーハンドリングを実装した
- [ ] ログを適切に出力している

## ✅ 完了チェック
- [ ] すべての要件を満たした
- [ ] テストが通っている
- [ ] ドキュメントを更新した
- [ ] HISTORY.mdに記録した
`;
    }

    initializeHistory(agent) {
        return `# ${agent} Agent 作業履歴

## プロジェクト: ${this.projectData.name}

---

## ${new Date().toISOString()}
- task: "要件定義書作成"
- agent: requirements
- status: completed
- notes: "初期セットアップ完了"

---
`;
    }

    showSummary() {
        console.log(chalk.bold.green('\n✅ 要件定義書作成完了\n'));
        
        console.log(chalk.cyan('📊 サマリー:'));
        console.log(`  プロジェクト: ${this.projectData.name}`);
        console.log(`  タイプ: ${this.projectData.type}`);
        console.log(`  主要機能: ${this.projectData.business.mainFeatures.length}個`);
        console.log(`  対象プラットフォーム: ${this.projectData.technical.platforms.join(', ')}`);
        console.log(`  期限: ${this.projectData.constraints.deadline}`);
        
        console.log(chalk.cyan('\n📁 生成ファイル:'));
        console.log('  docs/MASTER_REQUIREMENTS.md');
        console.log('  docs/agents/*/REQUIREMENTS.md (9ファイル)');
        console.log('  docs/agents/*/CHECKLIST.md (9ファイル)');
        console.log('  docs/agents/*/HISTORY.md (9ファイル)');
        
        console.log(chalk.yellow('\n📝 次のアクション:'));
        console.log('  1. 生成された要件定義書をレビュー');
        console.log('  2. 必要に応じて編集');
        console.log('  3. PMエージェントでタスク振り分け開始');
    }

    async editProject() {
        // 既存プロジェクトの編集機能
        console.log(chalk.yellow('この機能は開発中です'));
    }

    async createFromTemplate() {
        // テンプレートからの作成機能
        console.log(chalk.yellow('この機能は開発中です'));
    }

    async validateRequirements() {
        // 要件定義書の検証機能
        console.log(chalk.yellow('この機能は開発中です'));
    }

    async exportRequirements() {
        // エクスポート機能
        console.log(chalk.yellow('この機能は開発中です'));
    }
}

// 実行
const cli = new RequirementsAgentCLI();
cli.run();
