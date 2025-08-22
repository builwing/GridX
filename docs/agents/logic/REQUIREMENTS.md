# Logic Agent - 数独パズル生成・解法ロジック要件定義書

## 1. 概要

### 1.1 責務範囲
Logic エージェントは数独アプリケーションのコアとなるビジネスロジックを担当します。パズル生成、検証、解法アルゴリズム、ヒントシステムの実装を通じて、高品質で教育的価値のある数独体験を提供します。

### 1.2 技術スタック
- **実装言語**: TypeScript (型安全性重視)
- **テスト**: Jest + 数学的検証
- **アルゴリズム**: 制約充足問題・バックトラッキング
- **パフォーマンス**: 最適化されたデータ構造・キャッシュ機能
- **品質**: 100%テストカバレッジ目標

### 1.3 品質目標
- **パズル生成速度**: 2秒以内（全難易度）
- **解法検証**: 100ms以内（9×9グリッド）
- **一意解保証**: 生成パズルの100%で一意解
- **難易度精度**: ±10%の誤差範囲で目標難易度

## 2. データ構造定義

### 2.1 基本データ型
```typescript
// 基本的な数独データ型
type SudokuNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type SudokuCell = SudokuNumber | 0; // 0は空欄を表す
type SudokuGrid = SudokuCell[][];   // 9×9のグリッド

// 座標型
interface Coordinate {
  row: number;    // 0-8
  col: number;    // 0-8
}

// セル情報の拡張型
interface CellInfo extends Coordinate {
  value: SudokuCell;
  candidates: Set<SudokuNumber>;
  isInitial: boolean;
  blockIndex: number; // 0-8（3×3ブロックのインデックス）
}
```

### 2.2 パズル情報型
```typescript
interface PuzzleData {
  id: string;                    // 一意識別子
  puzzle: SudokuGrid;            // 問題（0は空欄）
  solution: SudokuGrid;          // 解答（完全に埋まったグリッド）
  difficulty: Difficulty;        // 難易度
  metadata: PuzzleMetadata;      // メタ情報
  createdAt: Date;              // 作成日時
}

interface PuzzleMetadata {
  emptyCount: number;           // 空欄の数
  symmetryType: SymmetryType;   // 対称性のタイプ
  solvingTechniques: string[];  // 必要な解法テクニック
  difficultyScore: number;      // 数値化された難易度（0-100）
  estimatedTime: number;        // 推定解答時間（分）
  hints: HintData[];           // 利用可能なヒント
}

type Difficulty = 'easy' | 'normal' | 'hard' | 'custom';
type SymmetryType = 'none' | 'central' | 'vertical' | 'horizontal' | 'diagonal';
```

## 3. パズル生成アルゴリズム

### 3.1 完成数独生成
```typescript
interface SudokuGenerator {
  /**
   * 完全に埋められた9×9数独を生成
   * @returns 有効な完成数独グリッド
   */
  generateCompletedSudoku(): SudokuGrid;
  
  /**
   * シード値を使用した再現可能な生成
   * @param seed - 乱数シード値
   * @returns 決定的に生成された完成数独
   */
  generateWithSeed(seed: number): SudokuGrid;
}

class BacktrackingSudokuGenerator implements SudokuGenerator {
  private readonly EMPTY = 0;
  
  generateCompletedSudoku(): SudokuGrid {
    const grid = this.createEmptyGrid();
    this.fillGrid(grid);
    return grid;
  }
  
  private fillGrid(grid: SudokuGrid): boolean {
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) return true; // 完成
    
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const num of numbers) {
      if (this.isValidMove(grid, emptyCell.row, emptyCell.col, num)) {
        grid[emptyCell.row][emptyCell.col] = num;
        
        if (this.fillGrid(grid)) return true;
        
        // バックトラック
        grid[emptyCell.row][emptyCell.col] = this.EMPTY;
      }
    }
    
    return false;
  }
}
```

### 3.2 難易度別パズル生成
```typescript
interface DifficultyConfig {
  emptyCount: { min: number; max: number };
  requiredTechniques: SolvingTechnique[];
  symmetry: SymmetryType[];
  maxHints: number;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    emptyCount: { min: 45, max: 50 },
    requiredTechniques: ['nakedSingles', 'hiddenSingles'],
    symmetry: ['central', 'vertical', 'horizontal'],
    maxHints: 10
  },
  normal: {
    emptyCount: { min: 50, max: 55 },
    requiredTechniques: ['nakedSingles', 'hiddenSingles', 'nakedPairs', 'pointingPairs'],
    symmetry: ['central', 'diagonal'],
    maxHints: 7
  },
  hard: {
    emptyCount: { min: 55, max: 60 },
    requiredTechniques: ['nakedSingles', 'hiddenSingles', 'nakedPairs', 'hiddenPairs', 'boxLineReduction', 'xWing'],
    symmetry: ['central'],
    maxHints: 5
  }
};

class DifficultyBasedGenerator {
  generatePuzzle(difficulty: Difficulty): PuzzleData {
    const config = DIFFICULTY_CONFIGS[difficulty];
    let attempts = 0;
    const maxAttempts = 1000;
    
    while (attempts < maxAttempts) {
      const completedSudoku = this.generator.generateCompletedSudoku();
      const puzzle = this.removeNumbers(completedSudoku, config);
      
      if (this.validateDifficulty(puzzle, config)) {
        return this.createPuzzleData(puzzle, completedSudoku, difficulty);
      }
      
      attempts++;
    }
    
    throw new Error(`Failed to generate ${difficulty} puzzle after ${maxAttempts} attempts`);
  }
  
  private removeNumbers(grid: SudokuGrid, config: DifficultyConfig): SudokuGrid {
    const puzzle = this.cloneGrid(grid);
    const targetEmpty = this.randomBetween(config.emptyCount.min, config.emptyCount.max);
    const positions = this.generateSymmetricPositions(config.symmetry[0]);
    
    let removedCount = 0;
    for (const pos of positions) {
      if (removedCount >= targetEmpty) break;
      
      const originalValue = puzzle[pos.row][pos.col];
      puzzle[pos.row][pos.col] = 0;
      
      // 一意解チェック
      if (this.hasUniqueSolution(puzzle)) {
        removedCount++;
      } else {
        // 復元
        puzzle[pos.row][pos.col] = originalValue;
      }
    }
    
    return puzzle;
  }
}
```

## 4. 数独検証システム

### 4.1 基本ルール検証
```typescript
interface SudokuValidator {
  /**
   * 基本的な数独ルールをチェック
   * @param grid - 検証対象のグリッド
   * @returns 有効性とエラー詳細
   */
  validateBasicRules(grid: SudokuGrid): ValidationResult;
  
  /**
   * 特定の手番の有効性をチェック
   * @param grid - 現在のグリッド
   * @param row - 行インデックス
   * @param col - 列インデックス
   * @param value - 配置する数字
   * @returns 配置可能かどうか
   */
  isValidMove(grid: SudokuGrid, row: number, col: number, value: SudokuNumber): boolean;
  
  /**
   * パズルの完成度をチェック
   * @param grid - チェック対象のグリッド
   * @returns 完成しているかどうか
   */
  isCompleted(grid: SudokuGrid): boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  completeness: number; // 0-100%
}

interface ValidationError {
  type: 'row' | 'column' | 'block';
  position: Coordinate;
  conflictingValue: SudokuNumber;
  conflictingPositions: Coordinate[];
}

class StandardSudokuValidator implements SudokuValidator {
  validateBasicRules(grid: SudokuGrid): ValidationResult {
    const errors: ValidationError[] = [];
    
    // 行チェック
    for (let row = 0; row < 9; row++) {
      const rowErrors = this.validateRow(grid, row);
      errors.push(...rowErrors);
    }
    
    // 列チェック
    for (let col = 0; col < 9; col++) {
      const colErrors = this.validateColumn(grid, col);
      errors.push(...colErrors);
    }
    
    // 3×3ブロックチェック
    for (let block = 0; block < 9; block++) {
      const blockErrors = this.validateBlock(grid, block);
      errors.push(...blockErrors);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      completeness: this.calculateCompleteness(grid)
    };
  }
  
  isValidMove(grid: SudokuGrid, row: number, col: number, value: SudokuNumber): boolean {
    // 行チェック
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === value) return false;
    }
    
    // 列チェック
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === value) return false;
    }
    
    // 3×3ブロックチェック
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    
    for (let r = blockRow; r < blockRow + 3; r++) {
      for (let c = blockCol; c < blockCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === value) return false;
      }
    }
    
    return true;
  }
}
```

### 4.2 一意解検証
```typescript
interface UniquenessValidator {
  /**
   * パズルが唯一の解を持つかチェック
   * @param puzzle - 検証対象のパズル
   * @returns 一意解を持つかどうかと解の数
   */
  hasUniqueSolution(puzzle: SudokuGrid): { isUnique: boolean; solutionCount: number };
  
  /**
   * パズルの解を求める
   * @param puzzle - 解く対象のパズル
   * @returns 解が存在する場合はその解、存在しない場合はnull
   */
  solvePuzzle(puzzle: SudokuGrid): SudokuGrid | null;
}

class BacktrackingUniquenessValidator implements UniquenessValidator {
  hasUniqueSolution(puzzle: SudokuGrid): { isUnique: boolean; solutionCount: number } {
    const solutions: SudokuGrid[] = [];
    this.findAllSolutions(this.cloneGrid(puzzle), solutions, 2); // 2個見つかったら停止
    
    return {
      isUnique: solutions.length === 1,
      solutionCount: solutions.length
    };
  }
  
  private findAllSolutions(grid: SudokuGrid, solutions: SudokuGrid[], maxSolutions: number): void {
    if (solutions.length >= maxSolutions) return;
    
    const emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) {
      // 解発見
      solutions.push(this.cloneGrid(grid));
      return;
    }
    
    for (let num = 1; num <= 9; num++) {
      if (this.validator.isValidMove(grid, emptyCell.row, emptyCell.col, num as SudokuNumber)) {
        grid[emptyCell.row][emptyCell.col] = num as SudokuNumber;
        this.findAllSolutions(grid, solutions, maxSolutions);
        grid[emptyCell.row][emptyCell.col] = 0; // バックトラック
      }
    }
  }
}
```

## 5. 高度解法アルゴリズム

### 5.1 論理的解法テクニック
```typescript
interface SolvingTechnique {
  name: string;
  difficulty: number; // 1-10
  apply(puzzle: SudokuGrid): SolvingStep[];
}

interface SolvingStep {
  technique: string;
  position: Coordinate;
  value?: SudokuNumber;
  eliminatedCandidates?: SudokuNumber[];
  explanation: string;
}

class NakedSinglesTechnique implements SolvingTechnique {
  name = 'nakedSingles';
  difficulty = 1;
  
  apply(puzzle: SudokuGrid): SolvingStep[] {
    const steps: SolvingStep[] = [];
    const candidates = this.calculateCandidates(puzzle);
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          const cellCandidates = candidates[row][col];
          if (cellCandidates.size === 1) {
            const value = Array.from(cellCandidates)[0];
            steps.push({
              technique: this.name,
              position: { row, col },
              value,
              explanation: `セル(${row+1},${col+1})には${value}しか入らない`
            });
          }
        }
      }
    }
    
    return steps;
  }
}

class HiddenSinglesTechnique implements SolvingTechnique {
  name = 'hiddenSingles';
  difficulty = 2;
  
  apply(puzzle: SudokuGrid): SolvingStep[] {
    const steps: SolvingStep[] = [];
    
    // 行・列・ブロックそれぞれで隠れたシングルを探す
    steps.push(...this.findHiddenSinglesInRows(puzzle));
    steps.push(...this.findHiddenSinglesInColumns(puzzle));
    steps.push(...this.findHiddenSinglesInBlocks(puzzle));
    
    return steps;
  }
}

class XWingTechnique implements SolvingTechnique {
  name = 'xWing';
  difficulty = 8;
  
  apply(puzzle: SudokuGrid): SolvingStep[] {
    // X-Wing パターンの検出と適用
    // 高度な解法テクニック
    return [];
  }
}
```

### 5.2 解法エンジン
```typescript
interface SolutionEngine {
  /**
   * 論理的手法でパズルを解く
   * @param puzzle - 解く対象のパズル
   * @returns 解法手順と結果
   */
  solveLogically(puzzle: SudokuGrid): SolutionResult;
  
  /**
   * 指定されたテクニックのみで解けるかチェック
   * @param puzzle - チェック対象のパズル
   * @param allowedTechniques - 使用可能なテクニック
   * @returns 解けるかどうかと必要なテクニック
   */
  canSolveWithTechniques(puzzle: SudokuGrid, allowedTechniques: string[]): TechniqueAnalysis;
}

interface SolutionResult {
  solved: boolean;
  solution?: SudokuGrid;
  steps: SolvingStep[];
  techniquesUsed: string[];
  difficulty: number;
}

interface TechniqueAnalysis {
  solvable: boolean;
  requiredTechniques: string[];
  difficultyScore: number;
  stepsCount: number;
}

class LogicalSolutionEngine implements SolutionEngine {
  private techniques: SolvingTechnique[] = [
    new NakedSinglesTechnique(),
    new HiddenSinglesTechnique(),
    new NakedPairsTechnique(),
    new HiddenPairsTechnique(),
    new PointingPairsTechnique(),
    new BoxLineReductionTechnique(),
    new XWingTechnique()
  ];
  
  solveLogically(puzzle: SudokuGrid): SolutionResult {
    const workingPuzzle = this.cloneGrid(puzzle);
    const allSteps: SolvingStep[] = [];
    const techniquesUsed = new Set<string>();
    
    let progress = true;
    while (progress) {
      progress = false;
      
      for (const technique of this.techniques) {
        const steps = technique.apply(workingPuzzle);
        if (steps.length > 0) {
          // 最初のステップのみ適用（段階的解法）
          const step = steps[0];
          this.applyStep(workingPuzzle, step);
          allSteps.push(step);
          techniquesUsed.add(technique.name);
          progress = true;
          break;
        }
      }
    }
    
    return {
      solved: this.validator.isCompleted(workingPuzzle),
      solution: this.validator.isCompleted(workingPuzzle) ? workingPuzzle : undefined,
      steps: allSteps,
      techniquesUsed: Array.from(techniquesUsed),
      difficulty: this.calculateDifficulty(Array.from(techniquesUsed))
    };
  }
}
```

## 6. ヒントシステム

### 6.1 ヒント生成アルゴリズム
```typescript
interface HintSystem {
  /**
   * 次の一手ヒントを生成
   * @param puzzle - 現在のパズル状態
   * @param userLevel - ユーザーの熟練度
   * @returns 適切なヒント
   */
  generateNextMoveHint(puzzle: SudokuGrid, userLevel: UserLevel): Hint;
  
  /**
   * エラー検出ヒント
   * @param puzzle - 現在のパズル状態
   * @returns 検出されたエラーのリスト
   */
  findErrors(puzzle: SudokuGrid): ErrorHint[];
  
  /**
   * 候補数字の表示
   * @param puzzle - 現在のパズル状態
   * @param position - 対象のセル座標
   * @returns そのセルに入力可能な候補数字
   */
  getCandidates(puzzle: SudokuGrid, position: Coordinate): SudokuNumber[];
  
  /**
   * 段階的ヒント（教育的）
   * @param puzzle - 現在のパズル状態
   * @param position - 対象のセル座標
   * @returns 段階的な解法説明
   */
  getProgressiveHint(puzzle: SudokuGrid, position: Coordinate): ProgressiveHint;
}

interface Hint {
  type: HintType;
  position: Coordinate;
  value?: SudokuNumber;
  explanation: string;
  technique: string;
  confidence: number; // 0-1
  difficulty: number;  // 1-10
}

type HintType = 'nextMove' | 'elimination' | 'technique' | 'error';
type UserLevel = 'beginner' | 'intermediate' | 'advanced';

interface ErrorHint {
  position: Coordinate;
  errorType: 'duplicate' | 'impossible';
  conflictingPositions: Coordinate[];
  explanation: string;
}

interface ProgressiveHint {
  steps: HintStep[];
  finalAnswer?: SudokuNumber;
}

interface HintStep {
  description: string;
  highlightPositions: Coordinate[];
  eliminatedCandidates?: SudokuNumber[];
}

class IntelligentHintSystem implements HintSystem {
  generateNextMoveHint(puzzle: SudokuGrid, userLevel: UserLevel): Hint {
    const solutionResult = this.solutionEngine.solveLogically(puzzle);
    
    if (solutionResult.steps.length === 0) {
      return this.generateBacktrackingHint(puzzle);
    }
    
    const nextStep = solutionResult.steps[0];
    const technique = this.getTechniqueByName(nextStep.technique);
    
    // ユーザーレベルに応じてヒントの詳細度を調整
    return {
      type: 'nextMove',
      position: nextStep.position,
      value: nextStep.value,
      explanation: this.adjustExplanationForLevel(nextStep.explanation, userLevel),
      technique: nextStep.technique,
      confidence: 1.0,
      difficulty: technique?.difficulty || 5
    };
  }
  
  findErrors(puzzle: SudokuGrid): ErrorHint[] {
    const validationResult = this.validator.validateBasicRules(puzzle);
    
    return validationResult.errors.map(error => ({
      position: error.position,
      errorType: this.categorizeError(error),
      conflictingPositions: error.conflictingPositions,
      explanation: this.generateErrorExplanation(error)
    }));
  }
  
  getCandidates(puzzle: SudokuGrid, position: Coordinate): SudokuNumber[] {
    const candidates: SudokuNumber[] = [];
    
    for (let num = 1; num <= 9; num++) {
      if (this.validator.isValidMove(puzzle, position.row, position.col, num as SudokuNumber)) {
        candidates.push(num as SudokuNumber);
      }
    }
    
    return candidates;
  }
  
  getProgressiveHint(puzzle: SudokuGrid, position: Coordinate): ProgressiveHint {
    const candidates = this.getCandidates(puzzle, position);
    
    if (candidates.length === 1) {
      // Naked Single の場合
      return {
        steps: [
          {
            description: "このセルの候補数字を確認してみましょう",
            highlightPositions: [position]
          },
          {
            description: "行、列、ブロックを確認すると...",
            highlightPositions: this.getRelatedPositions(position)
          },
          {
            description: `${candidates[0]}だけが入ることがわかります`,
            highlightPositions: [position]
          }
        ],
        finalAnswer: candidates[0]
      };
    }
    
    // より複雑なケースの段階的説明
    return this.generateAdvancedProgressiveHint(puzzle, position);
  }
}
```

### 6.2 ヒント品質管理
```typescript
interface HintQualityManager {
  /**
   * ヒントの品質を評価
   * @param hint - 評価対象のヒント
   * @param context - コンテキスト情報
   * @returns 品質スコア
   */
  evaluateHintQuality(hint: Hint, context: HintContext): QualityScore;
  
  /**
   * ユーザーの進捗に応じたヒント調整
   * @param user - ユーザー情報
   * @param puzzle - パズル状態
   * @returns 調整されたヒント設定
   */
  adaptHintForUser(user: UserProfile, puzzle: SudokuGrid): HintConfig;
}

interface HintContext {
  userLevel: UserLevel;
  previousHints: Hint[];
  timeSpent: number;
  errorCount: number;
}

interface QualityScore {
  accuracy: number;    // 正確性（0-1）
  clarity: number;     // わかりやすさ（0-1）
  relevance: number;   // 関連性（0-1）
  education: number;   // 教育的価値（0-1）
  overall: number;     // 総合スコア（0-1）
}

interface UserProfile {
  level: UserLevel;
  completedPuzzles: number;
  averageTime: number;
  preferredTechniques: string[];
  hintsUsedRatio: number;
}

interface HintConfig {
  maxHints: number;
  showTechnique: boolean;
  showStepByStep: boolean;
  highlightConflicts: boolean;
  voiceGuidance: boolean;
}
```

## 7. パフォーマンス最適化

### 7.1 計算最適化
```typescript
interface PerformanceOptimizer {
  /**
   * 候補数字計算の最適化
   * @param puzzle - パズル状態
   * @returns キャッシュされた候補リスト
   */
  optimizeCandidateCalculation(puzzle: SudokuGrid): CandidateCache;
  
  /**
   * メモ化による重複計算の回避
   * @param key - キャッシュキー
   * @param calculation - 計算関数
   * @returns 結果（キャッシュまたは新規計算）
   */
  memoize<T>(key: string, calculation: () => T): T;
}

interface CandidateCache {
  grid: Map<string, Set<SudokuNumber>>;
  lastUpdated: Date;
  isValid: boolean;
}

class BitSetOptimizer {
  // ビット演算を使用した高速な候補計算
  private static readonly ALL_NUMBERS = 0b111111111; // 1-9のビットセット
  
  static calculateCandidatesBitwise(puzzle: SudokuGrid): number[][] {
    const candidates: number[][] = Array(9).fill(null).map(() => Array(9).fill(this.ALL_NUMBERS));
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== 0) {
          candidates[row][col] = 0; // 埋まっているセルは候補なし
          const valueBit = 1 << (puzzle[row][col] - 1);
          
          // 同じ行・列・ブロックから除外
          this.eliminateFromRow(candidates, row, valueBit);
          this.eliminateFromColumn(candidates, col, valueBit);
          this.eliminateFromBlock(candidates, row, col, valueBit);
        }
      }
    }
    
    return candidates;
  }
  
  private static eliminateFromRow(candidates: number[][], row: number, valueBit: number) {
    for (let col = 0; col < 9; col++) {
      candidates[row][col] &= ~valueBit;
    }
  }
}
```

### 7.2 メモリ効率化
```typescript
class MemoryEfficientSudoku {
  // 9×9グリッドを81個の4ビット値として格納（1つの数値で2セル）
  private data: Uint8Array;
  
  constructor(grid?: SudokuGrid) {
    this.data = new Uint8Array(41); // 81 / 2 + 1 = 41バイト
    if (grid) {
      this.fromGrid(grid);
    }
  }
  
  get(row: number, col: number): SudokuCell {
    const index = row * 9 + col;
    const byteIndex = Math.floor(index / 2);
    const isUpperNibble = index % 2 === 0;
    
    if (isUpperNibble) {
      return ((this.data[byteIndex] & 0xF0) >> 4) as SudokuCell;
    } else {
      return (this.data[byteIndex] & 0x0F) as SudokuCell;
    }
  }
  
  set(row: number, col: number, value: SudokuCell): void {
    const index = row * 9 + col;
    const byteIndex = Math.floor(index / 2);
    const isUpperNibble = index % 2 === 0;
    
    if (isUpperNibble) {
      this.data[byteIndex] = (this.data[byteIndex] & 0x0F) | ((value & 0x0F) << 4);
    } else {
      this.data[byteIndex] = (this.data[byteIndex] & 0xF0) | (value & 0x0F);
    }
  }
  
  toGrid(): SudokuGrid {
    const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        grid[row][col] = this.get(row, col);
      }
    }
    return grid;
  }
}
```

## 8. テスト要件

### 8.1 単体テスト
```typescript
describe('SudokuGenerator', () => {
  let generator: BacktrackingSudokuGenerator;
  
  beforeEach(() => {
    generator = new BacktrackingSudokuGenerator();
  });
  
  describe('generateCompletedSudoku', () => {
    test('有効な完成数独を生成する', () => {
      const sudoku = generator.generateCompletedSudoku();
      
      expect(sudoku).toHaveLength(9);
      expect(sudoku.every(row => row.length === 9)).toBe(true);
      expect(new StandardSudokuValidator().validateBasicRules(sudoku).isValid).toBe(true);
    });
    
    test('すべてのセルが1-9で埋まっている', () => {
      const sudoku = generator.generateCompletedSudoku();
      
      for (const row of sudoku) {
        for (const cell of row) {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        }
      }
    });
    
    test('1000回生成してもすべて異なる', () => {
      const generated = new Set<string>();
      
      for (let i = 0; i < 1000; i++) {
        const sudoku = generator.generateCompletedSudoku();
        const serialized = JSON.stringify(sudoku);
        expect(generated.has(serialized)).toBe(false);
        generated.add(serialized);
      }
    });
  });
  
  describe('generateWithSeed', () => {
    test('同じシードで同じ結果が得られる', () => {
      const seed = 12345;
      const sudoku1 = generator.generateWithSeed(seed);
      const sudoku2 = generator.generateWithSeed(seed);
      
      expect(sudoku1).toEqual(sudoku2);
    });
    
    test('異なるシードで異なる結果が得られる', () => {
      const sudoku1 = generator.generateWithSeed(1);
      const sudoku2 = generator.generateWithSeed(2);
      
      expect(sudoku1).not.toEqual(sudoku2);
    });
  });
});

describe('HintSystem', () => {
  let hintSystem: IntelligentHintSystem;
  let testPuzzle: SudokuGrid;
  
  beforeEach(() => {
    hintSystem = new IntelligentHintSystem();
    testPuzzle = [
      [5,3,0, 0,7,0, 0,0,0],
      [6,0,0, 1,9,5, 0,0,0],
      [0,9,8, 0,0,0, 0,6,0],
      // ... rest of test puzzle
    ];
  });
  
  test('Naked Single を正しく検出する', () => {
    const hint = hintSystem.generateNextMoveHint(testPuzzle, 'beginner');
    
    expect(hint.type).toBe('nextMove');
    expect(hint.technique).toBe('nakedSingles');
    expect(hint.value).toBeDefined();
    expect(hint.confidence).toBeGreaterThan(0.8);
  });
  
  test('エラーを正しく検出する', () => {
    const invalidPuzzle = [...testPuzzle];
    invalidPuzzle[0][0] = 5; // 同じ行に5が2つ
    
    const errors = hintSystem.findErrors(invalidPuzzle);
    
    expect(errors).toHaveLength(1);
    expect(errors[0].errorType).toBe('duplicate');
  });
});
```

### 8.2 統合テスト
```typescript
describe('パズル生成・解法統合テスト', () => {
  test('生成されたパズルがすべて論理的に解ける', async () => {
    const generator = new DifficultyBasedGenerator();
    const engine = new LogicalSolutionEngine();
    
    for (const difficulty of ['easy', 'normal', 'hard'] as Difficulty[]) {
      for (let i = 0; i < 100; i++) {
        const puzzle = generator.generatePuzzle(difficulty);
        const result = engine.solveLogically(puzzle.puzzle);
        
        expect(result.solved).toBe(true);
        expect(result.solution).toEqual(puzzle.solution);
      }
    }
  }, 30000); // 30秒のタイムアウト
  
  test('難易度が正確に設定される', () => {
    const generator = new DifficultyBasedGenerator();
    
    const easyPuzzles = Array.from({length: 50}, () => generator.generatePuzzle('easy'));
    const hardPuzzles = Array.from({length: 50}, () => generator.generatePuzzle('hard'));
    
    const avgEasyDifficulty = easyPuzzles.reduce((sum, p) => sum + p.metadata.difficultyScore, 0) / 50;
    const avgHardDifficulty = hardPuzzles.reduce((sum, p) => sum + p.metadata.difficultyScore, 0) / 50;
    
    expect(avgHardDifficulty).toBeGreaterThan(avgEasyDifficulty * 2);
  });
});
```

## 9. 他エージェントとの連携

### 9.1 Next.js/Expoエージェントへの提供
```typescript
// 共通インターフェースの定義
export interface SudokuEngine {
  generatePuzzle(difficulty: Difficulty): PuzzleData;
  validateMove(puzzle: SudokuGrid, row: number, col: number, value: SudokuNumber): boolean;
  isCompleted(puzzle: SudokuGrid): boolean;
  getHint(puzzle: SudokuGrid, userLevel: UserLevel): Hint;
  findErrors(puzzle: SudokuGrid): ErrorHint[];
  getCandidates(puzzle: SudokuGrid, position: Coordinate): SudokuNumber[];
}

// Web/Mobile用の軽量アダプター
export class ClientSudokuEngine implements SudokuEngine {
  private generator = new DifficultyBasedGenerator();
  private validator = new StandardSudokuValidator();
  private hintSystem = new IntelligentHintSystem();
  
  // 必要最小限のAPIを提供
}
```

### 9.2 QAエージェントへの提供
```typescript
// テストデータの生成
export interface TestDataGenerator {
  generateTestPuzzles(difficulty: Difficulty, count: number): PuzzleData[];
  generateEdgeCases(): EdgeCaseTestData[];
  generatePerformanceBenchmarks(): PerformanceBenchmark[];
}

interface EdgeCaseTestData {
  name: string;
  puzzle: SudokuGrid;
  expectedBehavior: string;
  validationRules: string[];
}

interface PerformanceBenchmark {
  name: string;
  operation: string;
  maxExecutionTime: number; // ms
  maxMemoryUsage: number;   // MB
}
```

## 10. 実装優先順位

### Phase 1（Day 1-2）- 基本機能
1. **データ構造・基本検証** (0.5日)
   - TypeScript型定義
   - 基本的な数独ルール検証
   - グリッド操作ユーティリティ

2. **基本パズル生成** (1日)
   - バックトラッキング法による完成数独生成
   - シンプルなセル削除による問題作成
   - 一意解検証の基本実装

3. **基本解法エンジン** (0.5日)
   - Naked Singles / Hidden Singles実装
   - 論理的解法の基盤構築

### Phase 2（Day 3-4）- ヒント・難易度システム
1. **ヒントシステム基本実装** (1日)
   - 次の一手提案機能
   - エラー検出機能
   - 候補数字計算

2. **難易度別生成** (1日)
   - 3段階の難易度設定
   - 解法テクニック要求に基づく調整
   - メタデータ生成

### Phase 3（Day 5-7）- 最適化・高度機能
1. **高度解法テクニック** (1日)
   - Naked/Hidden Pairs
   - Pointing Pairs, Box-Line Reduction
   - X-Wing等の高度テクニック

2. **パフォーマンス最適化** (1日)
   - ビット演算による高速化
   - メモ化・キャッシュ機能
   - メモリ効率化

3. **品質保証・テスト** (1日)
   - 包括的テストスイート
   - エッジケース対応
   - パフォーマンスベンチマーク

## 11. 成果物

### 11.1 コアライブラリ
- **sudoku-engine.ts**: メインエンジン
- **puzzle-generator.ts**: パズル生成機能
- **solution-engine.ts**: 解法エンジン
- **hint-system.ts**: ヒントシステム
- **validator.ts**: 検証機能

### 11.2 テストスイート
- **単体テスト**: 全機能の詳細テスト
- **統合テスト**: システム全体のテスト
- **パフォーマンステスト**: 速度・メモリ効率の検証
- **品質テスト**: 生成パズルの品質検証

### 11.3 ドキュメント
- **API仕様書**: 全公開関数の詳細仕様
- **アルゴリズム解説**: 実装アルゴリズムの説明
- **パフォーマンスレポート**: 最適化結果の報告書

---

**文書情報**
- 作成日: 2025-08-22
- 担当エージェント: Logic ビジネスロジックエージェント
- 依存関係: Logic→Next.js, Logic→Expo, Logic→QA
- 優先度: 最高（全機能の基盤）