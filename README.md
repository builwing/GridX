# 🎯 GridX - 数独パズル開発プロジェクト

Next.jsで構築された本格的な数独パズルWebアプリケーションです。美しいUIと直感的な操作性を備え、初心者から上級者まで楽しめる4つの難易度レベルを提供します。

## ✨ 主な機能

### ゲーム機能
- 🎮 **4つの難易度レベル** - 簡単、普通、難しい、上級から選択可能
- 🔢 **直感的な数字入力** - マウスクリックまたはキーボード入力対応
- ⏱️ **タイマー機能** - プレイ時間を自動計測
- 💡 **ヒント機能** - 行き詰まった時のサポート
- ↩️ **元に戻す/やり直し** - 間違えても安心
- ✅ **自動検証** - 入力ミスを即座に確認
- 🎯 **セル選択ハイライト** - 関連するセルを視覚的に表示

### 技術的特徴
- ⚡ **高速パフォーマンス** - Next.js 14による最適化
- 📱 **レスポンシブデザイン** - PC、タブレット、スマートフォン対応
- 🎨 **美しいUI** - Tailwind CSSによるモダンなデザイン
- 🧠 **スマートな数独生成** - 唯一解を保証するアルゴリズム
- 💾 **状態管理** - Zustandによる効率的な状態管理

## 🚀 クイックスタート

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/GridX.git
cd GridX

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてゲームをプレイできます。

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドした結果を実行
npm start
```

## 📁 プロジェクト構成

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ
│   ├── layout.tsx         # レイアウト定義
│   └── api/               # APIルート
│
├── components/            # Reactコンポーネント
│   ├── sudoku/           # 数独専用コンポーネント
│   │   ├── sudoku-grid.tsx      # メイングリッド
│   │   ├── sudoku-cell.tsx      # 個別セル
│   │   └── game-controls.tsx    # ゲームコントロール
│   │
│   └── ui/               # 汎用UIコンポーネント
│       ├── enhanced-sudoku-grid-v2.tsx  # 強化版グリッド
│       ├── enhanced-game-controls.tsx   # 強化版コントロール
│       ├── number-pad.tsx              # 数字入力パッド
│       └── game-starter.tsx           # ゲーム開始UI
│
├── lib/                  # ビジネスロジック
│   └── sudoku/          # 数独関連ロジック
│       ├── generator.ts    # パズル生成
│       ├── generator-v2.ts # 改良版生成アルゴリズム
│       ├── solver.ts       # 数独ソルバー
│       ├── validator.ts    # 検証ロジック
│       ├── utils.ts        # ユーティリティ関数
│       └── types.ts        # TypeScript型定義
│
└── store/               # 状態管理
    └── sudoku-store.ts  # Zustand store

```

## 🎮 遊び方

### 基本ルール
1. **9×9のグリッド** を1-9の数字で埋める
2. **各行** に1-9の数字がそれぞれ一つずつ
3. **各列** に1-9の数字がそれぞれ一つずつ
4. **各3×3ブロック** に1-9の数字がそれぞれ一つずつ

### 操作方法
- 👆 **マスをクリック** して選択
- 🔢 **数字ボタン** または **1-9キー** で入力
- 🗑️ **消去ボタン** または **Delete/Backspace** で削除
- ⌨️ **矢印キー** で選択セルを移動
- 💡 **ヒントボタン** で正解を表示
- ↩️ **元に戻す** で前の状態に戻る

### 難易度レベル
- 😊 **簡単** - 初心者向け（空きマス: 30-35個）
- 🤔 **普通** - ほどよい挑戦（空きマス: 36-45個）
- 😤 **難しい** - 思考力が必要（空きマス: 46-55個）
- 🔥 **上級** - エキスパート専用（空きマス: 56-64個）

## 🛠️ 技術スタック

- **フレームワーク**: [Next.js 14](https://nextjs.org/) (App Router)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **状態管理**: [Zustand](https://github.com/pmndrs/zustand)
- **アイコン**: [Lucide React](https://lucide.dev/)

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# TypeScript型チェック
npm run type-check

# Linting
npm run lint

# フォーマット
npm run format

# テスト実行
npm run test

# ビルド
npm run build
```

## 🎯 今後の開発予定

- [ ] オンライン対戦機能
- [ ] パズルの保存/読み込み機能
- [ ] 詳細な統計情報
- [ ] カスタムテーマ設定
- [ ] PWA対応
- [ ] 複数言語対応
- [ ] AIによる難易度自動調整
- [ ] ソーシャル共有機能

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

1. フォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

## 📝 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 👥 開発者

- GridX開発チーム

## 🙏 謝辞

このプロジェクトは以下の素晴らしいオープンソースプロジェクトを使用しています：
- Next.js
- React
- Tailwind CSS
- Zustand
- その他多くのnpmパッケージ

---

**楽しい数独パズルタイムを！** 🎯🎮✨