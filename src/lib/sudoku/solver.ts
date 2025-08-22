/**
 * 数独の解法とヒント機能
 */

import type { SudokuGrid, Position, Hint } from './types';
import { canPlaceValue, getPossibleValues, cloneGrid, isComplete } from './validator';

/**
 * バックトラッキングアルゴリズムを使用して数独を解く
 */
export function solveSudoku(grid: SudokuGrid): SudokuGrid | null {
  const workingGrid = cloneGrid(grid);
  
  if (solveSudokuRecursive(workingGrid)) {
    return workingGrid;
  }
  
  return null;
}

/**
 * 再帰的なバックトラッキング解法
 */
function solveSudokuRecursive(grid: SudokuGrid): boolean {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) {
    return true; // 全てのマスが埋まっている
  }

  const { row, col } = emptyCell;
  
  // 1から9まで試行
  for (let value = 1; value <= 9; value++) {
    if (canPlaceValue(grid, row, col, value)) {
      grid[row][col] = value;
      
      if (solveSudokuRecursive(grid)) {
        return true;
      }
      
      // バックトラック
      grid[row][col] = 0;
    }
  }
  
  return false;
}

/**
 * 空のセルを見つける（最も制約の多いセルを優先）
 */
function findEmptyCell(grid: SudokuGrid): Position | null {
  let minPossibilities = 10;
  let bestCell: Position | null = null;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const possibilities = getPossibleValues(grid, row, col).length;
        if (possibilities < minPossibilities) {
          minPossibilities = possibilities;
          bestCell = { row, col };
          
          // 可能性が1つしかない場合は即座に返す
          if (minPossibilities === 1) {
            return bestCell;
          }
        }
      }
    }
  }

  return bestCell;
}

/**
 * 解が一意かどうかを確認
 */
export function hasUniqueSolution(grid: SudokuGrid): boolean {
  const solutions: SudokuGrid[] = [];
  findAllSolutions(cloneGrid(grid), solutions, 2); // 最大2つまで探索
  return solutions.length === 1;
}

/**
 * 全ての解を見つける（制限付き）
 */
function findAllSolutions(grid: SudokuGrid, solutions: SudokuGrid[], maxSolutions: number): void {
  if (solutions.length >= maxSolutions) return;

  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) {
    solutions.push(cloneGrid(grid));
    return;
  }

  const { row, col } = emptyCell;
  
  for (let value = 1; value <= 9; value++) {
    if (canPlaceValue(grid, row, col, value)) {
      grid[row][col] = value;
      findAllSolutions(grid, solutions, maxSolutions);
      grid[row][col] = 0;
      
      if (solutions.length >= maxSolutions) return;
    }
  }
}

/**
 * ヒントを提供する
 */
export function getHint(grid: SudokuGrid): Hint | null {
  // Naked Single: 1つの値のみが可能なセル
  const nakedSingle = findNakedSingle(grid);
  if (nakedSingle) return nakedSingle;

  // Hidden Single: 行/列/ブロック内で1箇所にのみ置ける値
  const hiddenSingle = findHiddenSingle(grid);
  if (hiddenSingle) return hiddenSingle;

  // 削除法: 最も制約の多いセルの値を提案
  const eliminationHint = findEliminationHint(grid);
  if (eliminationHint) return eliminationHint;

  return null;
}

/**
 * Naked Single を見つける
 */
function findNakedSingle(grid: SudokuGrid): Hint | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const possibleValues = getPossibleValues(grid, row, col);
        if (possibleValues.length === 1) {
          return {
            position: { row, col },
            value: possibleValues[0],
            reason: `このマスには${possibleValues[0]}しか入りません`,
            technique: 'naked_single'
          };
        }
      }
    }
  }
  return null;
}

/**
 * Hidden Single を見つける
 */
function findHiddenSingle(grid: SudokuGrid): Hint | null {
  // 行での Hidden Single
  for (let row = 0; row < 9; row++) {
    const hint = findHiddenSingleInRow(grid, row);
    if (hint) return hint;
  }

  // 列での Hidden Single
  for (let col = 0; col < 9; col++) {
    const hint = findHiddenSingleInColumn(grid, col);
    if (hint) return hint;
  }

  // ブロックでの Hidden Single
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const hint = findHiddenSingleInBlock(grid, blockRow, blockCol);
      if (hint) return hint;
    }
  }

  return null;
}

/**
 * 行での Hidden Single を見つける
 */
function findHiddenSingleInRow(grid: SudokuGrid, row: number): Hint | null {
  for (let value = 1; value <= 9; value++) {
    const possibleCols: number[] = [];
    
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0 && canPlaceValue(grid, row, col, value)) {
        possibleCols.push(col);
      }
    }
    
    if (possibleCols.length === 1) {
      return {
        position: { row, col: possibleCols[0] },
        value,
        reason: `行${row + 1}で${value}が入るのはここだけです`,
        technique: 'hidden_single'
      };
    }
  }
  return null;
}

/**
 * 列での Hidden Single を見つける
 */
function findHiddenSingleInColumn(grid: SudokuGrid, col: number): Hint | null {
  for (let value = 1; value <= 9; value++) {
    const possibleRows: number[] = [];
    
    for (let row = 0; row < 9; row++) {
      if (grid[row][col] === 0 && canPlaceValue(grid, row, col, value)) {
        possibleRows.push(row);
      }
    }
    
    if (possibleRows.length === 1) {
      return {
        position: { row: possibleRows[0], col },
        value,
        reason: `列${col + 1}で${value}が入るのはここだけです`,
        technique: 'hidden_single'
      };
    }
  }
  return null;
}

/**
 * ブロックでの Hidden Single を見つける
 */
function findHiddenSingleInBlock(grid: SudokuGrid, blockRow: number, blockCol: number): Hint | null {
  const startRow = blockRow * 3;
  const startCol = blockCol * 3;

  for (let value = 1; value <= 9; value++) {
    const possiblePositions: Position[] = [];
    
    for (let row = startRow; row < startRow + 3; row++) {
      for (let col = startCol; col < startCol + 3; col++) {
        if (grid[row][col] === 0 && canPlaceValue(grid, row, col, value)) {
          possiblePositions.push({ row, col });
        }
      }
    }
    
    if (possiblePositions.length === 1) {
      const pos = possiblePositions[0];
      return {
        position: pos,
        value,
        reason: `ブロック(${blockRow + 1}, ${blockCol + 1})で${value}が入るのはここだけです`,
        technique: 'hidden_single'
      };
    }
  }
  return null;
}

/**
 * 削除法によるヒントを見つける
 */
function findEliminationHint(grid: SudokuGrid): Hint | null {
  let minPossibilities = 10;
  let bestHint: Hint | null = null;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const possibleValues = getPossibleValues(grid, row, col);
        if (possibleValues.length > 0 && possibleValues.length < minPossibilities) {
          minPossibilities = possibleValues.length;
          // 解を求めてその値をヒントとして提供
          const solution = solveSudoku(grid);
          if (solution) {
            bestHint = {
              position: { row, col },
              value: solution[row][col],
              reason: `他の可能性を排除すると${solution[row][col]}になります`,
              technique: 'elimination'
            };
          }
        }
      }
    }
  }

  return bestHint;
}

/**
 * 次に埋めるべきセルを特定
 */
export function getNextCell(grid: SudokuGrid): Position | null {
  return findEmptyCell(grid);
}

/**
 * 指定されたセルの正解を取得
 */
export function getCorrectValue(grid: SudokuGrid, row: number, col: number): number | null {
  if (grid[row][col] !== 0) return grid[row][col];
  
  const solution = solveSudoku(grid);
  return solution ? solution[row][col] : null;
}