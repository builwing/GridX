/**
 * 数独関連のユーティリティ関数
 */

import type { SudokuGrid, PuzzleStats, Position, Cell } from './types';

/**
 * パズルの統計情報を取得
 */
export function getPuzzleStats(grid: SudokuGrid): PuzzleStats {
  let filledCells = 0;
  const totalCells = 81;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) {
        filledCells++;
      }
    }
  }

  const emptyCells = totalCells - filledCells;
  const completionPercentage = (filledCells / totalCells) * 100;

  return {
    totalCells,
    filledCells,
    emptyCells,
    completionPercentage: Math.round(completionPercentage * 100) / 100
  };
}

/**
 * グリッドを文字列表現に変換（デバッグ用）
 */
export function gridToString(grid: SudokuGrid): string {
  let result = '';
  
  for (let row = 0; row < 9; row++) {
    if (row % 3 === 0 && row !== 0) {
      result += '------+-------+------\n';
    }
    
    for (let col = 0; col < 9; col++) {
      if (col % 3 === 0 && col !== 0) {
        result += '| ';
      }
      
      const value = grid[row][col];
      result += (value === 0 ? '.' : value.toString()) + ' ';
    }
    
    result += '\n';
  }
  
  return result;
}

/**
 * 文字列からグリッドを作成
 */
export function stringToGrid(str: string): SudokuGrid {
  const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(0));
  const numbers = str.replace(/[^0-9.]/g, '');
  
  if (numbers.length !== 81) {
    throw new Error('Invalid grid string: must contain exactly 81 characters');
  }
  
  for (let i = 0; i < 81; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    const char = numbers[i];
    grid[row][col] = char === '.' || char === '0' ? 0 : parseInt(char, 10);
  }
  
  return grid;
}

/**
 * グリッドを81文字の文字列に変換
 */
export function gridToCompactString(grid: SudokuGrid): string {
  let result = '';
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col];
      result += value === 0 ? '0' : value.toString();
    }
  }
  
  return result;
}

/**
 * 2つのグリッドが同じかどうかを比較
 */
export function gridsEqual(grid1: SudokuGrid, grid2: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid1[row][col] !== grid2[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 座標が有効な範囲内かどうかをチェック
 */
export function isValidPosition(position: Position): boolean {
  const { row, col } = position;
  return row >= 0 && row < 9 && col >= 0 && col < 9;
}

/**
 * 3x3ブロックのインデックスを取得
 */
export function getBlockIndex(row: number, col: number): { blockRow: number; blockCol: number } {
  return {
    blockRow: Math.floor(row / 3),
    blockCol: Math.floor(col / 3)
  };
}

/**
 * ブロック内の全てのセル座標を取得
 */
export function getBlockCells(blockRow: number, blockCol: number): Position[] {
  const cells: Position[] = [];
  const startRow = blockRow * 3;
  const startCol = blockCol * 3;
  
  for (let row = startRow; row < startRow + 3; row++) {
    for (let col = startCol; col < startCol + 3; col++) {
      cells.push({ row, col });
    }
  }
  
  return cells;
}

/**
 * 行の全てのセル座標を取得
 */
export function getRowCells(row: number): Position[] {
  const cells: Position[] = [];
  for (let col = 0; col < 9; col++) {
    cells.push({ row, col });
  }
  return cells;
}

/**
 * 列の全てのセル座標を取得
 */
export function getColumnCells(col: number): Position[] {
  const cells: Position[] = [];
  for (let row = 0; row < 9; row++) {
    cells.push({ row, col });
  }
  return cells;
}

/**
 * 指定されたセルに関連する全てのセル（同じ行・列・ブロック）を取得
 */
export function getRelatedCells(row: number, col: number): Position[] {
  const relatedCells = new Set<string>();
  
  // 同じ行のセル
  for (let c = 0; c < 9; c++) {
    if (c !== col) {
      relatedCells.add(`${row},${c}`);
    }
  }
  
  // 同じ列のセル
  for (let r = 0; r < 9; r++) {
    if (r !== row) {
      relatedCells.add(`${r},${col}`);
    }
  }
  
  // 同じブロックのセル
  const { blockRow, blockCol } = getBlockIndex(row, col);
  const startRow = blockRow * 3;
  const startCol = blockCol * 3;
  
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (r !== row || c !== col) {
        relatedCells.add(`${r},${c}`);
      }
    }
  }
  
  // Setから配列に変換
  return Array.from(relatedCells).map(pos => {
    const [r, c] = pos.split(',').map(Number);
    return { row: r, col: c };
  });
}

/**
 * セル情報の配列を作成
 */
export function createCellsArray(grid: SudokuGrid, originalGrid: SudokuGrid): Cell[] {
  const cells: Cell[] = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      cells.push({
        position: { row, col },
        value: grid[row][col],
        isFixed: originalGrid[row][col] !== 0
      });
    }
  }
  
  return cells;
}

/**
 * グリッドの難易度を数値でスコア化
 */
export function calculateDifficultyScore(grid: SudokuGrid): number {
  const clueCount = getPuzzleStats(grid).filledCells;
  
  // クルー数が少ないほど難しい
  let score = 100 - clueCount;
  
  // 各セルの可能性の数を考慮
  let totalPossibilities = 0;
  let emptyCells = 0;
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        emptyCells++;
        // この部分は validator.ts の getPossibleValues を使用
        // ここでは簡易版を実装
        let possibilities = 0;
        for (let value = 1; value <= 9; value++) {
          if (isValidPlacement(grid, row, col, value)) {
            possibilities++;
          }
        }
        totalPossibilities += possibilities;
      }
    }
  }
  
  if (emptyCells > 0) {
    const avgPossibilities = totalPossibilities / emptyCells;
    score += (9 - avgPossibilities) * 2; // 可能性が少ないほど難しい
  }
  
  return Math.round(score);
}

/**
 * 簡易的な配置可能性チェック（validator.tsのcanPlaceValueの簡易版）
 */
function isValidPlacement(grid: SudokuGrid, row: number, col: number, value: number): boolean {
  // 行チェック
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === value) return false;
  }
  
  // 列チェック
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === value) return false;
  }
  
  // ブロックチェック
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
 * パズルの完了時間を計算するためのタイマー
 */
export class PuzzleTimer {
  private startTime: number | null = null;
  private endTime: number | null = null;
  private pausedTime = 0;
  private pauseStart: number | null = null;

  start(): void {
    this.startTime = Date.now();
    this.endTime = null;
    this.pausedTime = 0;
    this.pauseStart = null;
  }

  pause(): void {
    if (this.startTime && !this.pauseStart) {
      this.pauseStart = Date.now();
    }
  }

  resume(): void {
    if (this.pauseStart) {
      this.pausedTime += Date.now() - this.pauseStart;
      this.pauseStart = null;
    }
  }

  stop(): number {
    if (!this.startTime) return 0;
    
    this.endTime = Date.now();
    if (this.pauseStart) {
      this.pausedTime += this.endTime - this.pauseStart;
    }
    
    return this.endTime - this.startTime - this.pausedTime;
  }

  getElapsedTime(): number {
    if (!this.startTime) return 0;
    
    const currentTime = this.endTime || Date.now();
    let elapsed = currentTime - this.startTime - this.pausedTime;
    
    if (this.pauseStart && !this.endTime) {
      elapsed -= Date.now() - this.pauseStart;
    }
    
    return elapsed;
  }

  reset(): void {
    this.startTime = null;
    this.endTime = null;
    this.pausedTime = 0;
    this.pauseStart = null;
  }
}

/**
 * 時間を人間が読みやすい形式にフォーマット
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}