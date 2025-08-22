/**
 * 数独パズル生成アルゴリズム
 */

import type { SudokuGrid, PuzzleOptions, Difficulty } from './types';
import { DifficultyEnum } from './types';
import { createEmptyGrid, canPlaceValue, cloneGrid } from './validator';
import { solveSudoku, hasUniqueSolution } from './solver';

/**
 * 完成した数独グリッドを生成
 */
export function generateCompleteGrid(seed?: number): SudokuGrid {
  const grid = createEmptyGrid();
  
  // シードが指定されている場合は疑似ランダムを使用
  const random = seed ? createSeededRandom(seed) : Math.random;
  
  fillGridRandomly(grid, random);
  return grid;
}

/**
 * 難易度に応じたパズルを生成
 */
export function generatePuzzle(options: PuzzleOptions): SudokuGrid {
  const { difficulty, seed } = options;
  const random = seed ? createSeededRandom(seed) : Math.random;
  
  // 完成したグリッドを生成
  let completeGrid: SudokuGrid;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    completeGrid = generateCompleteGrid(seed ? seed + attempts : undefined);
    attempts++;
  } while (attempts < maxAttempts && !isValidCompleteGrid(completeGrid));
  
  if (attempts >= maxAttempts) {
    throw new Error('完成したグリッドの生成に失敗しました');
  }
  
  // 難易度に応じてセルを削除
  return createPuzzleFromCompleteGrid(completeGrid, difficulty, random);
}

/**
 * ランダムに数字を配置して完成したグリッドを作成
 */
function fillGridRandomly(grid: SudokuGrid, random: () => number): boolean {
  const emptyCell = findNextEmptyCell(grid);
  if (!emptyCell) {
    return true; // 全てのマスが埋まっている
  }

  const { row, col } = emptyCell;
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9], random);

  for (const num of numbers) {
    if (canPlaceValue(grid, row, col, num)) {
      grid[row][col] = num;
      
      if (fillGridRandomly(grid, random)) {
        return true;
      }
      
      // バックトラック
      grid[row][col] = 0;
    }
  }

  return false;
}

/**
 * 次の空のセルを見つける
 */
function findNextEmptyCell(grid: SudokuGrid): { row: number; col: number } | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return { row, col };
      }
    }
  }
  return null;
}

/**
 * 配列をシャッフル（Fisher-Yates アルゴリズム）
 */
function shuffleArray<T>(array: T[], random: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 完成したグリッドからパズルを作成
 */
function createPuzzleFromCompleteGrid(
  completeGrid: SudokuGrid,
  difficulty: Difficulty,
  random: () => number
): SudokuGrid {
  const puzzle = cloneGrid(completeGrid);
  const targetClues = getTargetClues(difficulty);
  
  // 全ての位置をランダムにシャッフル
  const positions: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col });
    }
  }
  shuffleArray(positions, random);
  
  let cluesRemaining = 81;
  let attempts = 0;
  const maxAttempts = 1000;
  
  // セルを削除していく
  for (const { row, col } of positions) {
    if (cluesRemaining <= targetClues.min) break;
    if (attempts >= maxAttempts) break;
    
    const originalValue = puzzle[row][col];
    puzzle[row][col] = 0;
    
    // 一意解を保てるかチェック
    if (hasUniqueSolution(puzzle)) {
      cluesRemaining--;
    } else {
      // 削除できない場合は元に戻す
      puzzle[row][col] = originalValue;
    }
    
    attempts++;
  }
  
  return puzzle;
}

/**
 * 難易度に応じた目標クルー数を取得
 */
function getTargetClues(difficulty: Difficulty): { min: number; max: number } {
  switch (difficulty) {
    case DifficultyEnum.EASY:
      return { min: 38, max: 46 };
    case DifficultyEnum.MEDIUM:
      return { min: 27, max: 36 };
    case DifficultyEnum.HARD:
      return { min: 17, max: 26 };
    default:
      return { min: 30, max: 40 };
  }
}

/**
 * シード値を使った疑似ランダム生成器
 */
function createSeededRandom(seed: number): () => number {
  let currentSeed = seed;
  
  return function() {
    // Linear Congruential Generator
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
  };
}

/**
 * 完成したグリッドが有効かどうかをチェック
 */
function isValidCompleteGrid(grid: SudokuGrid): boolean {
  // 全てのマスが埋まっているかチェック
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col];
      if (value < 1 || value > 9) return false;
    }
  }
  
  // 数独のルールに従っているかチェック
  return isValidSudoku(grid);
}

/**
 * 数独のルールチェック
 */
function isValidSudoku(grid: SudokuGrid): boolean {
  // 行のチェック
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col];
      if (seen.has(value)) return false;
      seen.add(value);
    }
  }
  
  // 列のチェック
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const value = grid[row][col];
      if (seen.has(value)) return false;
      seen.add(value);
    }
  }
  
  // 3x3ブロックのチェック
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const seen = new Set<number>();
      for (let row = blockRow * 3; row < blockRow * 3 + 3; row++) {
        for (let col = blockCol * 3; col < blockCol * 3 + 3; col++) {
          const value = grid[row][col];
          if (seen.has(value)) return false;
          seen.add(value);
        }
      }
    }
  }
  
  return true;
}

/**
 * パズルの難易度を推定
 */
export function estimateDifficulty(grid: SudokuGrid): Difficulty {
  const clueCount = countClues(grid);
  
  if (clueCount >= 38) {
    return 'easy';
  } else if (clueCount >= 27) {
    return 'medium';
  } else {
    return 'hard';
  }
}

/**
 * クルー（初期配置された数字）の数を数える
 */
function countClues(grid: SudokuGrid): number {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) {
        count++;
      }
    }
  }
  return count;
}

/**
 * より高品質なパズル生成（対称性を考慮）
 */
export function generateSymmetricPuzzle(options: PuzzleOptions): SudokuGrid {
  const { difficulty, seed } = options;
  const random = seed ? createSeededRandom(seed) : Math.random;
  
  const completeGrid = generateCompleteGrid(seed);
  const puzzle = cloneGrid(completeGrid);
  const targetClues = getTargetClues(difficulty);
  
  // 対称な位置のペアを作成
  const symmetricPairs: Array<[{ row: number; col: number }, { row: number; col: number }]> = [];
  const center = { row: 4, col: 4 };
  const used = new Set<string>();
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const key = `${row},${col}`;
      if (used.has(key)) continue;
      
      if (row === 4 && col === 4) {
        // 中央は単独で処理
        continue;
      }
      
      const symmetricRow = 8 - row;
      const symmetricCol = 8 - col;
      const symmetricKey = `${symmetricRow},${symmetricCol}`;
      
      if (row === symmetricRow && col === symmetricCol) {
        // 自分自身が対称位置の場合
        continue;
      }
      
      symmetricPairs.push([
        { row, col },
        { row: symmetricRow, col: symmetricCol }
      ]);
      
      used.add(key);
      used.add(symmetricKey);
    }
  }
  
  // 対称ペアをシャッフル
  shuffleArray(symmetricPairs, random);
  
  let cluesRemaining = 81;
  
  // 対称ペアを削除
  for (const [pos1, pos2] of symmetricPairs) {
    if (cluesRemaining <= targetClues.min + 5) break;
    
    const value1 = puzzle[pos1.row][pos1.col];
    const value2 = puzzle[pos2.row][pos2.col];
    
    puzzle[pos1.row][pos1.col] = 0;
    puzzle[pos2.row][pos2.col] = 0;
    
    if (hasUniqueSolution(puzzle)) {
      cluesRemaining -= 2;
    } else {
      puzzle[pos1.row][pos1.col] = value1;
      puzzle[pos2.row][pos2.col] = value2;
    }
  }
  
  return puzzle;
}