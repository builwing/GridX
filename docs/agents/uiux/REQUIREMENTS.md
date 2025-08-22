# UIUX Agent - 10歳以上ユーザー向けデザイン要件定義書

## 1. 概要

### 1.1 責務範囲
UIUX エージェントは数独アプリケーションの包括的なユーザーエクスペリエンスデザインを担当します。特に10歳以上のユーザーが直感的に操作できる、教育的価値と楽しさを両立したインターフェースの設計・実装指針を提供します。

### 1.2 デザイン目標
- **直感性**: 説明不要で操作できるインターフェース
- **アクセシビリティ**: 年齢・能力に関わらず使いやすい設計
- **教育的価値**: 論理的思考力向上をサポートする機能
- **エンゲージメント**: 継続的に使いたくなる魅力的な体験
- **安全性**: 子供が安心して利用できる環境

### 1.3 対象ユーザー分析
```typescript
interface UserSegment {
  name: string;
  ageRange: [number, number];
  characteristics: string[];
  needs: string[];
  constraints: string[];
}

const TARGET_SEGMENTS: UserSegment[] = [
  {
    name: '初等学校高学年',
    ageRange: [10, 12],
    characteristics: [
      'デジタルネイティブだが集中力は短め',
      '視覚的フィードバックを好む',
      '達成感を重視する',
      'ゲーム的要素に反応する'
    ],
    needs: [
      '分かりやすい操作方法',
      '即座のフィードバック',
      '段階的な難易度上昇',
      '進捗の可視化'
    ],
    constraints: [
      '複雑な説明文は読まない',
      '小さなタッチターゲットは操作困難',
      '長時間の集中は困難'
    ]
  },
  {
    name: '中学生',
    ageRange: [13, 15],
    characteristics: [
      'より高度な論理的思考が可能',
      '競争心が強い',
      'カスタマイズを好む',
      '効率性を重視し始める'
    ],
    needs: [
      'より高度な機能へのアクセス',
      '統計・分析機能',
      'カスタマイズオプション',
      '友達との比較機能'
    ],
    constraints: [
      '子供っぽいデザインを嫌う傾向',
      '機能の多さによる混乱の可能性'
    ]
  },
  {
    name: '高校生以上',
    ageRange: [16, 99],
    characteristics: [
      '論理的思考力が十分に発達',
      '効率性と機能性を重視',
      'ミニマルなデザインを好む',
      '自己管理能力が高い'
    ],
    needs: [
      '高度な解法テクニックの学習',
      '詳細な統計分析',
      'カスタマイズの自由度',
      'エキスパート向け機能'
    ],
    constraints: [
      '時間的制約が大きい',
      '他の娯楽との競合'
    ]
  }
];
```

## 2. デザインシステム

### 2.1 カラーパレット（ユニバーサルデザイン）
```css
/* プライマリカラー（色覚特性を考慮） */
:root {
  /* 基本カラー */
  --color-primary: #1E88E5;      /* 青（信頼・知性） */
  --color-secondary: #43A047;    /* 緑（成功・成長） */
  --color-accent: #FB8C00;       /* オレンジ（注意・エネルギー） */
  --color-warning: #F57C00;      /* アンバー（警告） */
  --color-error: #E53935;        /* 赤（エラー・間違い） */
  --color-success: #4CAF50;      /* 緑（正解・完成） */
  
  /* ニュートラルカラー */
  --color-background: #FAFAFA;   /* 背景色 */
  --color-surface: #FFFFFF;      /* サーフェス */
  --color-text-primary: #212121;   /* 主要テキスト */
  --color-text-secondary: #757575; /* 副次テキスト */
  --color-text-disabled: #BDBDBD;  /* 無効テキスト */
  
  /* 数独特化カラー */
  --color-cell-initial: #E3F2FD;    /* 初期値セル */
  --color-cell-user: #FFFFFF;       /* ユーザー入力セル */
  --color-cell-selected: #BBDEFB;   /* 選択中セル */
  --color-cell-highlighted: #E1F5FE; /* 関連セル */
  --color-cell-error: #FFEBEE;      /* エラーセル */
  --color-cell-hint: #FFF3E0;       /* ヒント対象セル */
  
  /* グリッド線 */
  --color-grid-light: #E0E0E0;    /* 3×3内の境界線 */
  --color-grid-heavy: #424242;    /* 3×3ブロック境界線 */
}

/* ダークモード対応 */
[data-theme="dark"] {
  --color-background: #121212;
  --color-surface: #1E1E1E;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #AAAAAA;
  --color-cell-initial: #263238;
  --color-cell-user: #1E1E1E;
  --color-cell-selected: #1565C0;
  --color-grid-light: #424242;
  --color-grid-heavy: #757575;
}

/* 高コントラストモード（視覚障害者向け） */
[data-contrast="high"] {
  --color-background: #FFFFFF;
  --color-text-primary: #000000;
  --color-cell-selected: #FFFF00; /* 黄色 */
  --color-cell-error: #FF0000;    /* 純赤 */
  --color-grid-heavy: #000000;    /* 純黒 */
}
```

### 2.2 タイポグラフィシステム
```css
/* 読みやすさを重視したフォント設定 */
:root {
  /* フォントファミリー */
  --font-primary: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
  --font-monospace: 'SF Mono', 'Monaco', 'Roboto Mono', monospace;
  --font-number: 'Inter', 'SF Pro Text', 'Roboto', sans-serif; /* 数字専用 */
  
  /* フォントサイズ（アクセシビリティガイドライン準拠） */
  --text-xs: 0.75rem;   /* 12px - 補助情報 */
  --text-sm: 0.875rem;  /* 14px - 副次情報 */
  --text-base: 1rem;    /* 16px - 基本テキスト（最小推奨サイズ） */
  --text-lg: 1.125rem;  /* 18px - 重要テキスト */
  --text-xl: 1.25rem;   /* 20px - 見出し小 */
  --text-2xl: 1.5rem;   /* 24px - 見出し中 */
  --text-3xl: 1.875rem; /* 30px - 見出し大 */
  --text-4xl: 2.25rem;  /* 36px - タイトル */
  
  /* 数独セル内数字サイズ（デバイス別） */
  --number-mobile: 1.25rem;   /* 20px - モバイル */
  --number-tablet: 1.5rem;    /* 24px - タブレット */
  --number-desktop: 1.75rem;  /* 28px - デスクトップ */
  
  /* 行間・文字間隔 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.05em;
}

/* 動的文字サイズ調整（システム設定連動） */
@media (prefers-font-size: large) {
  :root {
    --text-base: 1.125rem; /* 18px */
    --number-mobile: 1.375rem; /* 22px */
  }
}

/* 読み上げ時の配慮 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-focus:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### 2.3 スペーシングシステム
```css
/* 一貫性のある間隔設定 */
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  
  /* タッチターゲットサイズ（WCAG AAA準拠） */
  --touch-target-min: 44px;      /* 最小タッチターゲット */
  --touch-target-comfortable: 48px; /* 快適なタッチターゲット */
  --touch-target-large: 56px;    /* 大きなタッチターゲット */
}
```

## 3. コンポーネントデザイン仕様

### 3.1 数独グリッド設計
```css
/* 数独グリッドのレスポンシブ設計 */
.sudoku-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 1px;
  border: 3px solid var(--color-grid-heavy);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--color-grid-heavy);
  
  /* デバイス別サイズ調整 */
  width: min(90vw, 90vh, 540px);
  height: min(90vw, 90vh, 540px);
  max-width: 540px;
  max-height: 540px;
}

.sudoku-cell {
  aspect-ratio: 1;
  background-color: var(--color-cell-user);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-number);
  font-size: var(--number-desktop);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  position: relative;
  
  /* アクセシビリティ向上 */
  &:focus {
    outline: 3px solid var(--color-primary);
    outline-offset: -3px;
    z-index: 10;
  }
  
  /* 状態別スタイル */
  &.initial {
    background-color: var(--color-cell-initial);
    color: var(--color-text-primary);
    font-weight: 700;
    cursor: default;
  }
  
  &.selected {
    background-color: var(--color-cell-selected);
    box-shadow: inset 0 0 0 2px var(--color-primary);
  }
  
  &.highlighted {
    background-color: var(--color-cell-highlighted);
  }
  
  &.error {
    background-color: var(--color-cell-error);
    color: var(--color-error);
    animation: shake 0.3s ease-in-out;
  }
  
  &.hint {
    background-color: var(--color-cell-hint);
    animation: pulse 1s ease-in-out infinite;
  }
}

/* 3×3ブロック境界の強調 */
.sudoku-cell:nth-child(3n) {
  border-right: 2px solid var(--color-grid-heavy);
}

.sudoku-cell:nth-child(n+19):nth-child(-n+27),
.sudoku-cell:nth-child(n+46):nth-child(-n+54) {
  border-bottom: 2px solid var(--color-grid-heavy);
}

/* アニメーション */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### 3.2 数字入力パッド
```css
.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding: var(--space-4);
  background-color: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.number-button {
  width: var(--touch-target-comfortable);
  height: var(--touch-target-comfortable);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  background-color: var(--color-surface);
  color: var(--color-primary);
  font-family: var(--font-number);
  font-size: var(--text-xl);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  
  /* ホバー・フォーカス状態 */
  &:hover {
    background-color: var(--color-primary);
    color: white;
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  /* 無効状態 */
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    &:hover {
      background-color: var(--color-surface);
      color: var(--color-primary);
      transform: none;
    }
  }
}

/* 削除ボタンの特別スタイル */
.delete-button {
  background-color: var(--color-error);
  border-color: var(--color-error);
  color: white;
  
  &:hover {
    background-color: #c62828;
    border-color: #c62828;
  }
}
```

### 3.3 子供向けUI要素
```css
/* 楽しさとエンゲージメントを重視したデザイン */
.achievement-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: linear-gradient(135deg, var(--color-success), #66BB6A);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: var(--text-sm);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  animation: bounceIn 0.5s ease-out;
}

.progress-indicator {
  width: 100%;
  height: 8px;
  background-color: var(--color-background);
  border-radius: 4px;
  overflow: hidden;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
    border-radius: 4px;
    transition: width 0.3s ease-out;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## 4. アクセシビリティ要件

### 4.1 WCAG 2.1 AAA準拠
```typescript
interface AccessibilityRequirements {
  colorContrast: {
    normal: '7:1', // AAA レベル
    large: '4.5:1', // 18pt以上または14pt太字
    nonText: '3:1' // UI要素
  };
  
  focusManagement: {
    visibleFocusIndicator: true;
    logicalTabOrder: true;
    skipLinks: true;
    focusTrap: true; // モーダル内
  };
  
  textAlternatives: {
    images: 'alt属性必須';
    icons: 'aria-label必須';
    decorative: 'alt=""または role="presentation"';
  };
  
  keyboardNavigation: {
    allFunctionsAccessible: true;
    customKeyboardShortcuts: true;
    noKeyboardTraps: true;
  };
  
  screenReaderSupport: {
    semanticMarkup: true;
    ariaLabels: true;
    roleAttributes: true;
    stateAnnouncements: true;
  };
}
```

### 4.2 スクリーンリーダー対応
```html
<!-- 数独グリッドのアクセシブルなマークアップ例 -->
<div 
  role="grid" 
  aria-label="数独パズル" 
  aria-describedby="sudoku-instructions"
>
  <div id="sudoku-instructions" class="sr-only">
    9×9のグリッドで、各行、各列、各3×3ブロックに1から9の数字を重複なく配置してください。
    矢印キーでセル間を移動し、数字キーで入力、Deleteキーで削除できます。
  </div>
  
  <div role="row" aria-rowindex="1">
    <div 
      role="gridcell" 
      aria-colindex="1"
      aria-label="1行1列のセル"
      tabindex="0"
      data-row="0"
      data-col="0"
    >
      <span aria-live="polite" aria-atomic="true">
        <!-- 数字が入力されると読み上げられる -->
      </span>
    </div>
    <!-- 他のセル... -->
  </div>
  <!-- 他の行... -->
</div>

<!-- ヒント機能のアクセシブル化 -->
<button 
  type="button"
  aria-describedby="hint-description"
  onclick="getHint()"
>
  ヒントを見る
</button>
<div id="hint-description" class="sr-only">
  次に入力すべき数字のヒントを表示します。残りヒント回数: 5回
</div>

<!-- 状態変更の通知 -->
<div aria-live="assertive" aria-atomic="true" class="sr-only">
  <!-- エラーや完成時のメッセージが動的に挿入される -->
</div>
```

### 4.3 キーボードナビゲーション
```typescript
interface KeyboardShortcuts {
  // グリッド操作
  ArrowUp: 'セル上移動';
  ArrowDown: 'セル下移動';
  ArrowLeft: 'セル左移動';
  ArrowRight: 'セル右移動';
  
  // 数字入力
  Digit1to9: '数字入力';
  Delete: 'セル内容削除';
  Backspace: 'セル内容削除';
  Space: 'メモモード切り替え';
  
  // ゲーム操作
  'Ctrl+N': '新しいゲーム';
  'Ctrl+R': 'リセット';
  'Ctrl+S': '保存';
  'Ctrl+Z': '元に戻す';
  'Ctrl+H': 'ヒント表示';
  
  // ナビゲーション
  Tab: '次のコントロールに移動';
  'Shift+Tab': '前のコントロールに移動';
  Enter: '選択・実行';
  Escape: 'モーダル閉じる・キャンセル';
  
  // アクセシビリティ
  'Alt+1': 'メインコンテンツにスキップ';
  'Alt+2': 'ナビゲーションにスキップ';
  'Alt+3': 'ヒント機能にスキップ';
}
```

## 5. 年齢別インタラクションデザイン

### 5.1 10-12歳向け設計
```css
/* より大きなタッチターゲットと視覚的フィードバック */
.age-10-12 {
  .sudoku-cell {
    min-width: 50px;
    min-height: 50px;
    font-size: 1.5rem;
    border-radius: 4px;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  }
  
  .number-button {
    min-width: 56px;
    min-height: 56px;
    font-size: 1.25rem;
    border-radius: 12px;
    
    /* より目立つフィードバック */
    &:active {
      transform: scale(0.95);
      animation: buttonPress 0.1s ease-out;
    }
  }
  
  /* 成功時の派手なアニメーション */
  .completion-animation {
    animation: celebrate 2s ease-out;
  }
}

@keyframes buttonPress {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes celebrate {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-1deg); }
  75% { transform: scale(1.1) rotate(1deg); }
}
```

### 5.2 13-15歳向け設計
```css
/* よりシンプルで洗練されたデザイン */
.age-13-15 {
  .sudoku-grid {
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .sudoku-cell {
    font-size: 1.375rem;
    transition: all 0.1s ease-out;
    
    &:hover {
      background-color: var(--color-cell-highlighted);
    }
  }
  
  /* 統計・進捗の強調 */
  .stats-panel {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    padding: var(--space-4);
  }
  
  /* カスタマイズオプションの表示 */
  .customization-panel {
    display: block;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }
}
```

### 5.3 16歳以上向け設計
```css
/* ミニマルで効率的なデザイン */
.age-16-plus {
  .sudoku-grid {
    border: 2px solid var(--color-grid-heavy);
    border-radius: 4px;
  }
  
  .sudoku-cell {
    font-size: 1.25rem;
    transition: background-color 0.05s ease-out;
  }
  
  /* 高度な機能へのアクセス */
  .advanced-features {
    display: flex;
    gap: var(--space-2);
    
    .feature-button {
      padding: var(--space-2) var(--space-3);
      font-size: var(--text-sm);
      border-radius: 4px;
      background-color: transparent;
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
      
      &:hover {
        background-color: var(--color-primary);
        color: white;
      }
    }
  }
  
  /* 詳細統計の表示 */
  .detailed-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-4);
  }
}
```

## 6. レスポンシブデザイン戦略

### 6.1 ブレークポイント設計
```css
/* モバイルファーストアプローチ */
:root {
  --bp-xs: 320px;  /* 小型スマートフォン */
  --bp-sm: 375px;  /* 標準スマートフォン */
  --bp-md: 768px;  /* タブレット縦 */
  --bp-lg: 1024px; /* タブレット横・小型ノートPC */
  --bp-xl: 1280px; /* デスクトップ */
  --bp-2xl: 1536px; /* 大型デスクトップ */
}

/* スマートフォン（縦向き） */
@media (max-width: 767px) {
  .app-layout {
    padding: var(--space-2);
  }
  
  .sudoku-grid {
    width: calc(100vw - 2rem);
    height: calc(100vw - 2rem);
    max-width: 350px;
    max-height: 350px;
  }
  
  .sudoku-cell {
    font-size: var(--number-mobile);
  }
  
  .number-pad {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    grid-template-columns: repeat(5, 1fr);
    padding: var(--space-3);
    background-color: var(--color-surface);
    border-top: 1px solid var(--color-grid-light);
  }
}

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) {
  .app-layout {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-6);
    padding: var(--space-4);
  }
  
  .sudoku-grid {
    width: min(60vw, 450px);
    height: min(60vw, 450px);
  }
  
  .controls-panel {
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
}

/* デスクトップ */
@media (min-width: 1024px) {
  .app-layout {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-6);
  }
  
  .sudoku-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-6);
  }
  
  .sudoku-grid {
    width: 540px;
    height: 540px;
  }
  
  .sudoku-cell {
    font-size: var(--number-desktop);
  }
}
```

### 6.2 オリエンテーション対応
```css
/* 横向き時の最適化 */
@media (orientation: landscape) and (max-height: 500px) {
  .app-layout {
    display: grid;
    grid-template-columns: 1fr auto;
    height: 100vh;
    overflow: hidden;
  }
  
  .sudoku-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2);
  }
  
  .sudoku-grid {
    width: min(70vh, 400px);
    height: min(70vh, 400px);
  }
  
  .controls-panel {
    width: 180px;
    height: 100vh;
    overflow-y: auto;
    padding: var(--space-3);
  }
  
  .number-pad {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(5, 1fr);
  }
}
```

## 7. アニメーションとマイクロインタラクション

### 7.1 パフォーマンスを考慮したアニメーション
```css
/* 60fps を維持するアニメーション */
.smooth-animation {
  /* GPU加速を有効にする */
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* セル選択のスムーズな遷移 */
.sudoku-cell {
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.15s ease-out,
              box-shadow 0.15s ease-out;
}

/* ページ遷移アニメーション */
.page-transition-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.page-transition-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-transition-exit-active {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

/* 完成時の祝福アニメーション */
@keyframes confetti {
  0% {
    transform: translateY(0) rotateZ(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-1000px) rotateZ(720deg);
    opacity: 0;
  }
}

.confetti-particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--color-success);
  animation: confetti 3s ease-out infinite;
}
```

### 7.2 フィードバックアニメーション
```css
/* エラー時のシェイクアニメーション */
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
}

.error-feedback {
  animation: error-shake 0.5s ease-in-out;
}

/* 成功時のバウンスアニメーション */
@keyframes success-bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -10px, 0);
  }
  70% {
    transform: translate3d(0, -5px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.success-feedback {
  animation: success-bounce 1s ease-out;
}

/* ローディングアニメーション */
@keyframes pulse-ring {
  0% {
    transform: scale(0.33);
  }
  40%, 50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.33);
  }
}

.loading-indicator {
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    opacity: 1;
    animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  }
  
  &::after {
    animation-delay: 0.4s;
  }
}
```

## 8. エラーハンドリングとユーザーガイダンス

### 8.1 エラーメッセージのデザイン
```css
.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-error);
  color: white;
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: 500;
  margin-bottom: var(--space-4);
  
  .error-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
}

.warning-message {
  background-color: var(--color-warning);
  color: white;
}

.info-message {
  background-color: var(--color-primary);
  color: white;
}

.success-message {
  background-color: var(--color-success);
  color: white;
}
```

### 8.2 ツールチップとヘルプシステム
```css
.tooltip {
  position: relative;
  display: inline-block;
  
  .tooltip-content {
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-text-primary);
    color: white;
    padding: var(--space-2) var(--space-3);
    border-radius: 4px;
    font-size: var(--text-xs);
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    z-index: 1000;
    
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: var(--color-text-primary);
    }
  }
  
  &:hover .tooltip-content,
  &:focus .tooltip-content {
    opacity: 1;
    visibility: visible;
  }
}

/* 初回ユーザー向けガイド */
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.onboarding-popup {
  background-color: white;
  border-radius: 12px;
  padding: var(--space-6);
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  
  .onboarding-title {
    font-size: var(--text-2xl);
    font-weight: 700;
    margin-bottom: var(--space-4);
    color: var(--color-primary);
  }
  
  .onboarding-description {
    font-size: var(--text-base);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--space-6);
    color: var(--color-text-secondary);
  }
  
  .onboarding-button {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: var(--space-3) var(--space-6);
    border-radius: 6px;
    font-size: var(--text-base);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease-out;
    
    &:hover {
      background-color: #1976d2;
    }
  }
}
```

## 9. テスト要件

### 9.1 ユーザビリティテスト
```typescript
interface UsabilityTest {
  testName: string;
  targetAge: number[];
  taskDescription: string;
  successCriteria: string[];
  measuredMetrics: string[];
}

const USABILITY_TESTS: UsabilityTest[] = [
  {
    testName: '初回ゲーム開始テスト',
    targetAge: [10, 12, 15],
    taskDescription: 'アプリを初めて開いて数独ゲームを開始する',
    successCriteria: [
      '3分以内にゲームを開始できる',
      '説明を読まずに操作できる',
      '間違った操作をしない'
    ],
    measuredMetrics: [
      'タスク完了時間',
      '誤操作回数',
      'ヘルプ参照回数',
      'ユーザー満足度'
    ]
  },
  {
    testName: 'ヒント機能利用テスト',
    targetAge: [10, 15],
    taskDescription: 'ヒント機能を使って数独を解く',
    successCriteria: [
      'ヒント機能を見つけられる',
      'ヒントの意味を理解できる',
      'ヒントを活用して進行できる'
    ],
    measuredMetrics: [
      'ヒント発見時間',
      'ヒント理解度',
      '問題解決率'
    ]
  }
];
```

### 9.2 アクセシビリティテスト
```typescript
interface AccessibilityTestCase {
  feature: string;
  assistiveTechnology: string;
  testProcedure: string;
  expectedBehavior: string;
}

const ACCESSIBILITY_TESTS: AccessibilityTestCase[] = [
  {
    feature: '数独グリッド操作',
    assistiveTechnology: 'スクリーンリーダー (VoiceOver/NVDA)',
    testProcedure: 'タブキーでグリッドに移動し、矢印キーでセル間を移動',
    expectedBehavior: '各セルの位置と内容が適切に読み上げられる'
  },
  {
    feature: 'ヒント機能',
    assistiveTechnology: 'キーボードのみ',
    testProcedure: 'Tabキーでヒントボタンに移動し、Enterで実行',
    expectedBehavior: 'ヒント内容が音声で案内される'
  },
  {
    feature: '色覚サポート',
    assistiveTechnology: '色覚シミュレーター',
    testProcedure: '色覚特性をシミュレートしてエラー表示を確認',
    expectedBehavior: '色以外の手段（形状・パターン）でも情報を識別できる'
  }
];
```

## 10. 他エージェントとの連携

### 10.1 Next.js/Expoエージェントへの提供
```typescript
// デザインシステムの共有
export interface DesignSystem {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  components: ComponentLibrary;
  animations: AnimationLibrary;
}

export interface ComponentLibrary {
  SudokuGrid: ComponentSpec;
  NumberPad: ComponentSpec;
  Button: ComponentSpec;
  Modal: ComponentSpec;
  Tooltip: ComponentSpec;
  ProgressIndicator: ComponentSpec;
}

interface ComponentSpec {
  props: any;
  styles: CSSProperties;
  variants: Record<string, CSSProperties>;
  states: Record<string, CSSProperties>;
  accessibility: AccessibilityProps;
}
```

### 10.2 QAエージェントへの提供
```typescript
// UI/UXテスト要件の定義
export interface UITestRequirements {
  visualRegressionTests: VisualTest[];
  interactionTests: InteractionTest[];
  accessibilityTests: A11yTest[];
  performanceTests: PerformanceTest[];
}

interface VisualTest {
  component: string;
  viewports: string[];
  states: string[];
  threshold: number; // 許容差分パーセンテージ
}

interface InteractionTest {
  action: string;
  target: string;
  expectedResult: string;
  timeout: number;
}
```

## 11. 実装優先順位

### Phase 1（Day 1-2）- 基本デザインシステム
1. **カラーパレット・タイポグラフィ** (0.5日)
   - アクセシブルな色設計
   - 年齢別フォントサイズ設定
   - ダークモード対応

2. **基本コンポーネント設計** (1日)
   - 数独グリッド・セルデザイン
   - 数字入力パッドデザイン
   - ボタン・アイコンデザイン

3. **レスポンシブレイアウト** (0.5日)
   - モバイル・タブレット・デスクトップ対応
   - オリエンテーション対応

### Phase 2（Day 3-4）- インタラクション・アクセシビリティ
1. **インタラクションデザイン** (1日)
   - アニメーション・マイクロインタラクション
   - フィードバックシステム
   - エラーハンドリング

2. **アクセシビリティ実装** (1日)
   - スクリーンリーダー対応
   - キーボードナビゲーション
   - 高コントラストモード

### Phase 3（Day 5-7）- 最適化・テスト
1. **年齢別最適化** (1日)
   - 10-12歳向け調整
   - 13-15歳向け調整
   - 16歳以上向け調整

2. **パフォーマンス最適化** (1日)
   - アニメーション最適化
   - レンダリング最適化
   - バンドルサイズ最適化

3. **ユーザビリティテスト** (1日)
   - 年齢別ユーザーテスト
   - アクセシビリティテスト
   - デザイン品質保証

## 12. 成果物

### 12.1 デザインアセット
- **カラーパレット**: CSS Custom Properties
- **タイポグラフィシステム**: フォント・サイズ定義
- **アイコンセット**: SVG形式の統一アイコン
- **コンポーネントライブラリ**: 再利用可能なUI部品

### 12.2 スタイルガイド
- **デザインシステム文書**: 色・フォント・間隔の使用ガイド
- **コンポーネント仕様書**: 各UIコンポーネントの詳細仕様
- **アクセシビリティガイド**: WCAG準拠のための実装指針

### 12.3 テンプレート・プロトタイプ
- **画面設計モックアップ**: 主要画面のビジュアルデザイン
- **インタラクティブプロトタイプ**: 操作フローの確認用
- **アニメーション仕様**: 動きの詳細定義

---

**文書情報**
- 作成日: 2025-08-22
- 担当エージェント: UIUX デザインエージェント  
- 依存関係: UIUX→Next.js, UIUX→Expo, UIUX→QA
- 優先度: 高（ユーザー体験の基盤）