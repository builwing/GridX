/**
 * 数独アプリの型定義
 */

// 数独グリッドの型定義 (0は空のマス)
export type SudokuGrid = number[][];

// 難易度レベル
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export enum DifficultyEnum {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

// パズル生成オプション
export interface PuzzleOptions {
  difficulty: Difficulty;
  seed?: number; // ランダム生成のシード値
}

// 座標位置
export interface Position {
  row: number;
  col: number;
}

// セル情報
export interface Cell {
  position: Position;
  value: number;
  isFixed: boolean; // 初期配置された数字かどうか
  possibleValues?: number[]; // 可能な値（ヒント機能用）
}

// 検証結果
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// 検証エラー情報
export interface ValidationError {
  type: 'row' | 'column' | 'block';
  position: Position;
  value: number;
  conflictPositions: Position[];
}

// パズルの状態
export interface PuzzleState {
  grid: SudokuGrid;
  originalGrid: SudokuGrid; // 初期状態のグリッド
  isComplete: boolean;
  isValid: boolean;
  difficulty: Difficulty;
}

// ヒント情報
export interface Hint {
  position: Position;
  value: number;
  reason: string; // ヒントの理由
  technique: 'naked_single' | 'hidden_single' | 'elimination'; // 使用したテクニック
}

// パズル統計
export interface PuzzleStats {
  totalCells: number;
  filledCells: number;
  emptyCells: number;
  completionPercentage: number;
}