/**
 * 数独の検証ロジック
 */

import type { SudokuGrid, Position, ValidationResult, ValidationError } from './types';

/**
 * 数独グリッド全体の妥当性を検証
 */
export function validateGrid(grid: SudokuGrid): ValidationResult {
  const errors: ValidationError[] = [];

  // 行の検証
  for (let row = 0; row < 9; row++) {
    const rowErrors = validateRow(grid, row);
    errors.push(...rowErrors);
  }

  // 列の検証
  for (let col = 0; col < 9; col++) {
    const colErrors = validateColumn(grid, col);
    errors.push(...colErrors);
  }

  // 3x3ブロックの検証
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const blockErrors = validateBlock(grid, blockRow, blockCol);
      errors.push(...blockErrors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 指定された行の妥当性を検証
 */
function validateRow(grid: SudokuGrid, row: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const seen = new Map<number, number[]>();

  // まず全ての値の位置を収集
  for (let col = 0; col < 9; col++) {
    const value = grid[row][col];
    if (value === 0) continue;

    if (!seen.has(value)) {
      seen.set(value, []);
    }
    seen.get(value)!.push(col);
  }

  // 重複がある値についてエラーを作成
  for (const [value, cols] of seen.entries()) {
    if (cols.length > 1) {
      // 重複する全てのセルにエラーを追加
      for (const col of cols) {
        const conflictPositions = cols
          .filter(c => c !== col)
          .map(c => ({ row, col: c }));
        errors.push({
          type: 'row',
          position: { row, col },
          value,
          conflictPositions
        });
      }
    }
  }

  return errors;
}

/**
 * 指定された列の妥当性を検証
 */
function validateColumn(grid: SudokuGrid, col: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const seen = new Map<number, number[]>();

  // まず全ての値の位置を収集
  for (let row = 0; row < 9; row++) {
    const value = grid[row][col];
    if (value === 0) continue;

    if (!seen.has(value)) {
      seen.set(value, []);
    }
    seen.get(value)!.push(row);
  }

  // 重複がある値についてエラーを作成
  for (const [value, rows] of seen.entries()) {
    if (rows.length > 1) {
      // 重複する全てのセルにエラーを追加
      for (const row of rows) {
        const conflictPositions = rows
          .filter(r => r !== row)
          .map(r => ({ row: r, col }));
        errors.push({
          type: 'column',
          position: { row, col },
          value,
          conflictPositions
        });
      }
    }
  }

  return errors;
}

/**
 * 指定された3x3ブロックの妥当性を検証
 */
function validateBlock(grid: SudokuGrid, blockRow: number, blockCol: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const seen = new Map<number, Position[]>();

  const startRow = blockRow * 3;
  const startCol = blockCol * 3;

  // まず全ての値の位置を収集
  for (let row = startRow; row < startRow + 3; row++) {
    for (let col = startCol; col < startCol + 3; col++) {
      const value = grid[row][col];
      if (value === 0) continue;

      if (!seen.has(value)) {
        seen.set(value, []);
      }
      seen.get(value)!.push({ row, col });
    }
  }

  // 重複がある値についてエラーを作成
  for (const [value, positions] of seen.entries()) {
    if (positions.length > 1) {
      // 重複する全てのセルにエラーを追加
      for (const position of positions) {
        const conflictPositions = positions
          .filter(p => p.row !== position.row || p.col !== position.col);
        errors.push({
          type: 'block',
          position,
          value,
          conflictPositions
        });
      }
    }
  }

  return errors;
}

/**
 * 特定のセルに値を設定できるかどうかを検証
 */
export function canPlaceValue(grid: SudokuGrid, row: number, col: number, value: number): boolean {
  if (value < 1 || value > 9) return false;
  if (grid[row][col] !== 0) return false;

  // 行に同じ値がないかチェック
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === value) return false;
  }

  // 列に同じ値がないかチェック
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === value) return false;
  }

  // 3x3ブロックに同じ値がないかチェック
  const blockRow = Math.floor(row / 3) * 3;
  const blockCol = Math.floor(col / 3) * 3;
  for (let r = blockRow; r < blockRow + 3; r++) {
    for (let c = blockCol; c < blockCol + 3; c++) {
      if (grid[r][c] === value) return false;
    }
  }

  return true;
}

/**
 * 数独が完成しているかどうかを判定
 */
export function isComplete(grid: SudokuGrid): boolean {
  // 全てのマスが埋まっているかチェック
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) return false;
    }
  }

  // 妥当性もチェック
  return validateGrid(grid).isValid;
}

/**
 * 指定されたセルで可能な値を取得
 */
export function getPossibleValues(grid: SudokuGrid, row: number, col: number): number[] {
  if (grid[row][col] !== 0) return [];

  const possibleValues: number[] = [];
  for (let value = 1; value <= 9; value++) {
    if (canPlaceValue(grid, row, col, value)) {
      possibleValues.push(value);
    }
  }

  return possibleValues;
}

/**
 * 空のグリッドを作成
 */
export function createEmptyGrid(): SudokuGrid {
  return Array(9).fill(null).map(() => Array(9).fill(0));
}

/**
 * グリッドのディープコピーを作成
 */
export function cloneGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => [...row]);
}