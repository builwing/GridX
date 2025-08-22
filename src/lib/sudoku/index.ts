/**
 * 数独ライブラリのメインエクスポート
 */

// 型定義
export type {
  SudokuGrid,
  Position,
  Cell,
  ValidationResult,
  ValidationError,
  PuzzleState,
  Hint,
  PuzzleStats,
  PuzzleOptions
} from './types';

export { DifficultyEnum } from './types';

// パズル生成
export {
  generateCompleteGrid,
  generatePuzzle,
  generateSymmetricPuzzle,
  estimateDifficulty
} from './generator';

// 検証機能
export {
  validateGrid,
  canPlaceValue,
  isComplete,
  getPossibleValues,
  createEmptyGrid,
  cloneGrid
} from './validator';

// 解法とヒント
export {
  solveSudoku,
  hasUniqueSolution,
  getHint,
  getNextCell,
  getCorrectValue
} from './solver';

// ユーティリティ関数
export * from './utils';