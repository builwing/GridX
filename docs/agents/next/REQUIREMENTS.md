# Next.js Web版 - 要件定義書

## 1. 概要

### 1.1 責務範囲
Next.js エージェントは数独アプリケーションのWeb版フロントエンドの実装を担当します。レスポンシブなウェブアプリケーションとして、デスクトップとモバイルブラウザの両方で最適な体験を提供します。

### 1.2 技術スタック
- **フレームワーク**: Next.js 14+ (App Router)
- **React**: React 18+ (Hooks, Context API)
- **TypeScript**: 型安全な開発
- **スタイリング**: Tailwind CSS + CSS Modules
- **状態管理**: React Context API + useReducer
- **テスト**: Jest + React Testing Library
- **ローカルストレージ**: localStorage + IndexedDB

### 1.3 開発期間
- **Phase 1 (Day 1-3)**: MVP基本機能実装
- **Phase 2 (Day 4-5)**: ヒント機能・保存機能追加
- **Phase 3 (Day 6-7)**: UX改善・最終調整

## 2. 機能要件

### 2.1 MVP機能（Phase 1優先）

#### 2.1.1 数独グリッド表示
```typescript
interface SudokuGrid {
  size: 9; // 固定9x9
  cells: CellData[][];
  initialPuzzle: number[][];
  solution: number[][];
}

interface CellData {
  value: number | null;    // 1-9 または null（空欄）
  isInitial: boolean;      // 初期値かどうか
  isError: boolean;        // エラー状態
  isSelected: boolean;     // 選択状態
  notes: number[];         // メモ（候補数字）
}
```

**実装仕様**:
- CSS Grid による9×9のレスポンシブグリッド
- セルサイズ: デスクトップ60px、タブレット50px、モバイル40px
- 3×3ブロックの視覚的区分（太い境界線）
- セル選択時のハイライト効果

#### 2.1.2 数字入力システム
- **入力方法**: クリック選択 + 数字キーパッド
- **キーパッドUI**: 1-9の数字ボタン + 削除ボタン
- **キーボード対応**: 数字キー1-9、Backspace/Delete、矢印キー
- **入力制限**: 初期値セルは編集不可
- **リアルタイム検証**: 入力時の即座な妥当性チェック

#### 2.1.3 ゲーム制御機能
- **新規ゲーム**: 難易度選択→パズル生成→ゲーム開始
- **リセット**: 現在のパズルを初期状態に戻す
- **完成判定**: 全セル埋まり + ルール適合で完成通知

### 2.2 重要機能（Phase 2）

#### 2.2.1 ヒント機能
```typescript
interface HintSystem {
  getNextMove(): { row: number; col: number; value: number } | null;
  findErrors(): { row: number; col: number }[];
  showCandidates(row: number, col: number): number[];
  hintCount: number;
  maxHints: number;
}
```

**ヒントの種類**:
1. **次の一手**: 論理的に導出可能な次の数字を提案
2. **エラー指摘**: 現在の盤面の間違いを指摘
3. **候補表示**: 選択セルに入力可能な数字候補を表示
4. **使用制限**: 難易度に応じた回数制限（易:10回、普通:7回、難:5回）

#### 2.2.2 ゲーム保存システム
```typescript
interface SavedGame {
  id: string;
  gameState: GameState;
  timestamp: Date;
  difficulty: Difficulty;
  progress: number; // 完成度（%）
}
```

- **自動保存**: 入力毎に自動でlocalStorageに保存
- **手動保存**: 「ゲームを保存」ボタン
- **復元機能**: 「ゲームを再開」で最新状態から継続
- **複数保存**: 最大5つのゲーム状態を保持

#### 2.2.3 難易度システム
- **易しい**: 空白セル45-50個、基本的な論理解法のみ
- **普通**: 空白セル50-55個、中級論理解法が必要
- **難しい**: 空白セル55-60個、高度な論理解法が必要
- **難易度選択UI**: モーダルダイアログまたは専用ページ

### 2.3 追加機能（Phase 3）

#### 2.3.1 メモ機能
- **候補入力**: 小さい文字で複数の候補数字を表示
- **入力切替**: 「数字モード」「メモモード」の切り替えボタン
- **自動更新**: 数字確定時の関連セルメモ自動削除

#### 2.3.2 視覚的強調機能
- **関連セルハイライト**: 選択セルと同じ行・列・ブロックを薄くハイライト
- **数字ハイライト**: 選択した数字と同じ数字を全て強調表示
- **エラー表示**: ルール違反セルを赤色で強調

#### 2.3.3 設定・統計機能
- **テーマ切替**: ライト/ダーク/カスタムテーマ
- **統計表示**: ゲーム数、完成率、平均時間
- **ゲーム履歴**: 過去のプレイ記録

## 3. UI/UX設計

### 3.1 レスポンシブデザイン

#### デスクトップ (1024px以上)
```css
.sudoku-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.sudoku-grid {
  width: 540px; /* 60px × 9 */
  height: 540px;
}
```

#### タブレット (768px-1023px)
```css
.sudoku-container {
  padding: 1rem;
}

.sudoku-grid {
  width: 450px; /* 50px × 9 */
  height: 450px;
}
```

#### モバイル (320px-767px)
```css
.sudoku-container {
  padding: 0.5rem;
}

.sudoku-grid {
  width: 360px; /* 40px × 9 */
  height: 360px;
}
```

### 3.2 カラーパレット

#### ライトテーマ
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --border-light: #e2e8f0;
  --border-heavy: #334155;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --cell-initial: #f1f5f9;
  --cell-user: #ffffff;
  --cell-selected: #dbeafe;
  --cell-highlighted: #f0f9ff;
  --cell-error: #fef2f2;
  --text-error: #dc2626;
  --accent: #3b82f6;
}
```

#### ダークテーマ
```css
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --border-light: #334155;
  --border-heavy: #cbd5e1;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --cell-initial: #334155;
  --cell-user: #1e293b;
  --cell-selected: #1e40af;
  --cell-highlighted: #1e3a8a;
  --cell-error: #7f1d1d;
  --text-error: #ef4444;
  --accent: #60a5fa;
}
```

### 3.3 コンポーネント構成

```
components/
├── sudoku/
│   ├── SudokuGrid.tsx          # メイングリッド
│   ├── SudokuCell.tsx          # 個別セル
│   ├── NumberPad.tsx           # 数字入力パッド
│   ├── GameControls.tsx        # ゲーム制御ボタン
│   └── HintPanel.tsx           # ヒント機能UI
├── ui/
│   ├── Button.tsx              # 共通ボタン
│   ├── Modal.tsx               # モーダルダイアログ
│   ├── Toast.tsx               # 通知メッセージ
│   └── LoadingSpinner.tsx      # ローディング表示
├── layout/
│   ├── Header.tsx              # アプリヘッダー
│   ├── Footer.tsx              # アプリフッター
│   └── Navigation.tsx          # ナビゲーション
└── pages/
    ├── GamePage.tsx            # メインゲーム画面
    ├── DifficultyPage.tsx      # 難易度選択
    ├── SettingsPage.tsx        # 設定画面
    └── StatisticsPage.tsx      # 統計画面
```

## 4. 状態管理設計

### 4.1 グローバル状態構造
```typescript
interface AppState {
  game: {
    puzzle: number[][];
    initialPuzzle: number[][];
    solution: number[][];
    userInputs: (number | null)[][];
    notes: number[][][];
    errors: boolean[][];
    selectedCell: { row: number; col: number } | null;
    isCompleted: boolean;
    difficulty: Difficulty;
    startTime: Date;
    hintsUsed: number;
  };
  ui: {
    theme: 'light' | 'dark';
    showCandidates: boolean;
    highlightRelated: boolean;
    soundEnabled: boolean;
    inputMode: 'number' | 'note';
  };
  statistics: {
    gamesPlayed: number;
    gamesCompleted: number;
    averageTime: number;
    bestTimes: Record<Difficulty, number>;
  };
}
```

### 4.2 アクション型定義
```typescript
type GameAction =
  | { type: 'SET_CELL'; payload: { row: number; col: number; value: number | null } }
  | { type: 'SELECT_CELL'; payload: { row: number; col: number } | null }
  | { type: 'NEW_GAME'; payload: { difficulty: Difficulty; puzzle: number[][] } }
  | { type: 'USE_HINT'; payload: HintData }
  | { type: 'RESET_GAME' }
  | { type: 'TOGGLE_NOTE'; payload: { row: number; col: number; note: number } }
  | { type: 'SAVE_GAME' }
  | { type: 'LOAD_GAME'; payload: SavedGame };
```

## 5. パフォーマンス要件

### 5.1 レスポンス時間
- **セル入力**: 50ms以内の視覚反映
- **パズル生成**: 2秒以内（バックグラウンド処理）
- **ヒント計算**: 500ms以内
- **画面遷移**: 200ms以内のアニメーション完了

### 5.2 メモリ使用量
- **初期ロード**: 10MB以下
- **ゲーム実行時**: 30MB以下
- **localStorage使用量**: 5MB以下

### 5.3 バンドルサイズ
- **初期バンドル**: 500KB以下（gzip圧縮後）
- **追加チャンク**: 必要時のコード分割対応
- **画像・フォント**: 最適化済みアセット使用

## 6. アクセシビリティ要件

### 6.1 WCAG 2.1 AA準拠
- **キーボードナビゲーション**: 全機能をキーボードで操作可能
- **フォーカス表示**: 明確なフォーカスインジケーター
- **色彩コントラスト**: 4.5:1以上のコントラスト比
- **代替テキスト**: 画像・アイコンの適切なalt属性

### 6.2 子供向け配慮
- **文字サイズ**: 最小16px、推奨18px以上
- **タッチターゲット**: 最小44px×44pxのタッチ領域
- **わかりやすいアイコン**: 直感的なシンボル使用
- **エラーメッセージ**: やさしい日本語表現

### 6.3 スクリーンリーダー対応
- **ARIA属性**: 適切なrole、aria-label設定
- **見出し構造**: h1-h6の論理的な階層
- **状態通知**: 重要な状態変更のアナウンス

## 7. テスト要件

### 7.1 単体テスト (Jest + RTL)
```typescript
// 例: セル入力テスト
describe('SudokuCell', () => {
  test('数字入力で値が更新される', () => {
    render(<SudokuCell value={null} onChange={mockOnChange} />);
    fireEvent.click(screen.getByText('5'));
    expect(mockOnChange).toHaveBeenCalledWith(5);
  });
  
  test('初期値セルは編集不可', () => {
    render(<SudokuCell value={5} isInitial={true} />);
    expect(screen.getByDisplayValue('5')).toBeDisabled();
  });
});
```

**テスト対象コンポーネント**:
- SudokuGrid: グリッド表示・セル管理
- SudokuCell: 個別セルの動作
- NumberPad: 数字入力UI
- HintPanel: ヒント機能
- GameControls: ゲーム制御

### 7.2 統合テスト
```typescript
describe('ゲームフロー統合テスト', () => {
  test('新規ゲーム開始からクリアまで', async () => {
    render(<GamePage />);
    
    // 難易度選択
    fireEvent.click(screen.getByText('易しい'));
    
    // パズル生成待機
    await waitFor(() => {
      expect(screen.getByTestId('sudoku-grid')).toBeInTheDocument();
    });
    
    // セル選択・入力
    fireEvent.click(screen.getByTestId('cell-0-0'));
    fireEvent.click(screen.getByText('1'));
    
    // 保存機能テスト
    fireEvent.click(screen.getByText('保存'));
    expect(localStorage.getItem('sudoku-save')).toBeTruthy();
  });
});
```

### 7.3 E2Eテスト（Playwright）
- **ユーザーシナリオ**: 実際の操作フローを自動テスト
- **クロスブラウザ**: Chrome, Firefox, Safari, Edge
- **レスポンシブ**: 各画面サイズでの表示確認
- **パフォーマンス**: ページロード時間の計測

## 8. セキュリティ対策

### 8.1 入力検証
- **数値範囲**: 1-9の範囲内チェック
- **型検証**: number型の厳密チェック
- **注入攻撃対策**: React標準のエスケープ処理

### 8.2 データ保護
- **localStorage暗号化**: 機密性は不要だが整合性確保
- **データ検証**: 読み込み時の形式・整合性チェック
- **エラーハンドリング**: 不正データに対する適切な処理

## 9. 他エージェントとの連携

### 9.1 Expoエージェントとの協調
- **共通ロジック**: 数独生成・検証ロジックの共有化
- **デザインシステム**: 一貫したUI/UXガイドライン
- **データ形式**: SavedGame形式の共通化

### 9.2 UIUXエージェントから受領
- **デザインシステム**: カラーパレット・フォント・間隔
- **コンポーネント仕様**: ボタン・モーダル・フォーム設計
- **アクセシビリティ**: WCAG準拠ガイドライン

### 9.3 QAエージェントへ提供
- **テスト用データ**: コンポーネント・関数の単体テスト
- **E2Eシナリオ**: ユーザー操作フローの仕様
- **パフォーマンス指標**: 応答時間・メモリ使用量目標

## 10. 実装優先順位

### Phase 1（Day 1-3）- MVP機能
1. **プロジェクトセットアップ** (0.5日)
   - Next.js + TypeScript + Tailwind構成
   - 基本的なディレクトリ構造
   - ESLint/Prettier設定

2. **基本グリッド実装** (1日)
   - SudokuGrid・SudokuCellコンポーネント
   - CSS Gridレイアウト
   - レスポンシブデザイン

3. **入力システム** (1日)
   - NumberPadコンポーネント
   - セル選択・数字入力ロジック
   - キーボード操作対応

4. **ゲーム基本機能** (0.5日)
   - パズル検証ロジック
   - 完成判定機能
   - 新規ゲーム・リセット機能

### Phase 2（Day 4-5）- 重要機能
1. **ヒントシステム** (1日)
   - 候補数字計算アルゴリズム
   - 次の一手提案機能
   - エラー検出機能

2. **保存・復元機能** (0.5日)
   - localStorage操作
   - ゲーム状態シリアライゼーション
   - 自動保存・手動保存

3. **難易度システム** (0.5日)
   - 難易度選択UI
   - パズル生成パラメータ調整

### Phase 3（Day 6-7）- UX改善
1. **メモ・ハイライト機能** (0.5日)
   - 候補数字入力機能
   - 関連セル強調表示

2. **設定・統計画面** (0.5日)
   - テーマ切替機能
   - 基本的な統計表示

3. **最終調整・テスト** (1日)
   - バグ修正・最適化
   - アクセシビリティ確認
   - クロスブラウザテスト

## 11. 成果物

### 11.1 実装ファイル
- `/src/components/` - Reactコンポーネント
- `/src/hooks/` - カスタムフック
- `/src/utils/` - ユーティリティ関数
- `/src/types/` - TypeScript型定義
- `/src/contexts/` - React Context
- `/src/styles/` - スタイルファイル

### 11.2 テストファイル
- `/__tests__/` - 単体・統合テスト
- `/e2e/` - E2Eテストスクリプト
- `jest.config.js` - テスト設定
- `playwright.config.ts` - E2Eテスト設定

### 11.3 設定ファイル
- `next.config.js` - Next.js設定
- `tailwind.config.js` - Tailwind設定
- `tsconfig.json` - TypeScript設定
- `.eslintrc.js` - ESLint設定

---

**文書情報**
- 作成日: 2025-08-22
- 担当エージェント: Next.js Web開発エージェント  
- 依存関係: UIUX→Next.js, Next.js→QA
- 優先度: 高（MVP機能）