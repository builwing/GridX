/**
 * 改善された数独パズル生成アルゴリズム
 * 数字をより均等に分散させる
 */

import type { SudokuGrid, PuzzleOptions, Difficulty } from './types';
import { createEmptyGrid, canPlaceValue, cloneGrid } from './validator';
import { solveSudoku } from './solver';

/**
 * 難易度に応じた目標クルー数
 */
function getTargetClues(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 50 + Math.floor(Math.random() * 5); // 50-54 (各行列に7-8個の数字)
    case 'medium':
      return 32 + Math.floor(Math.random() * 5); // 32-36
    case 'hard':
      return 25 + Math.floor(Math.random() * 4); // 25-28
    case 'expert':
      return 20 + Math.floor(Math.random() * 3); // 20-22
    default:
      return 35;
  }
}

/**
 * 配列をシャッフル
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 完成した数独グリッドを生成
 */
function generateCompleteGrid(): SudokuGrid {
  const grid = createEmptyGrid();
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // バックトラッキングで埋める
  function fillGrid(row: number, col: number): boolean {
    if (row === 9) return true;
    
    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;
    
    if (grid[row][col] !== 0) {
      return fillGrid(nextRow, nextCol);
    }
    
    const shuffledNumbers = shuffleArray(numbers);
    for (const num of shuffledNumbers) {
      if (canPlaceValue(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillGrid(nextRow, nextCol)) {
          return true;
        }
        grid[row][col] = 0;
      }
    }
    
    return false;
  }
  
  fillGrid(0, 0);
  return grid;
}

/**
 * セルを均等に削除してパズルを作成
 */
function createPuzzleFromComplete(grid: SudokuGrid, difficulty: Difficulty): SudokuGrid {
  const puzzle = cloneGrid(grid);
  const targetClues = getTargetClues(difficulty);
  const cellsToRemove = 81 - targetClues;
  
  // 簡単モードの特別処理
  if (difficulty === 'easy') {
    let removedCount = 0;
    
    // 各行から1-2個だけ削除
    for (let row = 0; row < 9; row++) {
      const cellsToRemoveInRow = Math.floor(Math.random() * 2) + 1; // 1-2個
      const cols = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      
      for (let i = 0; i < cellsToRemoveInRow && removedCount < cellsToRemove; i++) {
        puzzle[row][cols[i]] = 0;
        removedCount++;
      }
    }
    
    // 各3x3ブロックで空きセルが1-2個になるように調整
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let blockCol = 0; blockCol < 3; blockCol++) {
        const startRow = blockRow * 3;
        const startCol = blockCol * 3;
        let emptyCount = 0;
        
        // ブロック内の空きセルを数える
        for (let r = startRow; r < startRow + 3; r++) {
          for (let c = startCol; c < startCol + 3; c++) {
            if (puzzle[r][c] === 0) emptyCount++;
          }
        }
        
        // 空きセルが2個を超える場合は埋め戻す
        if (emptyCount > 2) {
          const positions: Array<{row: number, col: number}> = [];
          for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
              if (puzzle[r][c] === 0) {
                positions.push({ row: r, col: c });
              }
            }
          }
          
          // ランダムに選んで埋め戻す
          const shuffledPositions = shuffleArray(positions);
          for (let i = 2; i < emptyCount; i++) {
            const { row, col } = shuffledPositions[i];
            puzzle[row][col] = grid[row][col];
          }
        }
      }
    }
    
    return puzzle;
  }
  
  // その他の難易度の処理（既存のロジック）
  const rowsRemoved = new Set<number>();
  const colsRemoved = new Set<number>();
  let removedCount = 0;
  
  // 各行から最低1つ削除
  for (let row = 0; row < 9; row++) {
    const availableCols: number[] = [];
    for (let col = 0; col < 9; col++) {
      if (!colsRemoved.has(col)) {
        availableCols.push(col);
      }
    }
    
    if (availableCols.length > 0) {
      const col = availableCols[Math.floor(Math.random() * availableCols.length)];
      puzzle[row][col] = 0;
      rowsRemoved.add(row);
      colsRemoved.add(col);
      removedCount++;
    }
  }
  
  // 各列から最低1つ削除（まだ削除されていない列）
  for (let col = 0; col < 9; col++) {
    if (!colsRemoved.has(col)) {
      const availableRows: number[] = [];
      for (let row = 0; row < 9; row++) {
        if (puzzle[row][col] !== 0) {
          availableRows.push(row);
        }
      }
      
      if (availableRows.length > 0) {
        const row = availableRows[Math.floor(Math.random() * availableRows.length)];
        puzzle[row][col] = 0;
        removedCount++;
      }
    }
  }
  
  // 残りのセルをランダムに削除
  const positions: Array<{row: number, col: number}> = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] !== 0) {
        positions.push({ row, col });
      }
    }
  }
  
  // シャッフルして削除
  const shuffled = shuffleArray(positions);
  const remainingToRemove = cellsToRemove - removedCount;
  
  for (let i = 0; i < Math.min(remainingToRemove, shuffled.length); i++) {
    const { row, col } = shuffled[i];
    
    // この位置を削除しても、行と列に少なくとも1つは数字が残ることを確認
    let rowCount = 0;
    let colCount = 0;
    
    for (let j = 0; j < 9; j++) {
      if (j !== col && puzzle[row][j] !== 0) rowCount++;
      if (j !== row && puzzle[j][col] !== 0) colCount++;
    }
    
    // 各行・各列に最低3つは数字を残す
    if (rowCount >= 3 && colCount >= 3) {
      puzzle[row][col] = 0;
      removedCount++;
    }
  }
  
  return puzzle;
}

/**
 * 改善されたパズル生成
 */
export function generatePuzzleV2(options: PuzzleOptions): SudokuGrid {
  const { difficulty } = options;
  
  // 完成したグリッドを生成
  const completeGrid = generateCompleteGrid();
  
  // パズルを作成
  const puzzle = createPuzzleFromComplete(completeGrid, difficulty);
  
  // 解けることを確認
  const testGrid = cloneGrid(puzzle);
  if (!solveSudoku(testGrid)) {
    // 解けない場合は再生成
    return generatePuzzleV2(options);
  }
  
  return puzzle;
}