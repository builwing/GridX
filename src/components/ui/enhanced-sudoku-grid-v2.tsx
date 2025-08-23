'use client'

import { useSudokuStore } from '@/store/sudoku-store'
import { validateGrid } from '@/lib/sudoku'

/**
 * 拡張数独グリッドコンポーネント v2
 * 
 * グリッドラインスタイルの数独パネルを提供します：
 * - 各セルは細い境界線（1px）で区切られます
 * - 3×3ブロックの境界は太い線（3px）で強調表示されます
 * - レスポンシブデザインに対応（モバイル・タブレット・デスクトップ）
 * - セルの選択、エラー表示、同一数字ハイライトなどの機能を含みます
 */
export function EnhancedSudokuGridV2() {
  const { currentGrid, selectedCell, selectCell, gameStatus, initialGrid } = useSudokuStore()
  
  // グリッド全体の検証を行い、エラーのあるセルを特定
  const validationResult = validateGrid(currentGrid)
  const errorPositions = new Set(
    validationResult.errors.map(error => `${error.position.row}-${error.position.col}`)
  )
  
  if (gameStatus === 'idle') {
    return (
      <div className="sudoku-grid relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🧩</div>
          <h2 className="text-2xl font-bold text-gray-700">数独パズルを始めよう！</h2>
          <p className="text-gray-600 mt-2">難易度を選んでゲームを開始</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="sudoku-grid relative">
      {currentGrid.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
          const isPrefilled = initialGrid[rowIndex][colIndex] !== 0
          const hasError = errorPositions.has(`${rowIndex}-${colIndex}`) && value !== 0 && !isPrefilled
          
          // 同じ数字をハイライト
          const isSameNumber = selectedCell && 
                              currentGrid[selectedCell.row][selectedCell.col] !== 0 &&
                              currentGrid[selectedCell.row][selectedCell.col] === value &&
                              !(selectedCell.row === rowIndex && selectedCell.col === colIndex)
          
          // 同じ行・列・ブロックをハイライト
          const isRelated = selectedCell && (
            selectedCell.row === rowIndex ||
            selectedCell.col === colIndex ||
            (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
             Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3))
          )
          
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => selectCell({ row: rowIndex, col: colIndex })}
              className={`
                sudoku-cell relative flex items-center justify-center transition-all
                ${isSelected ? 'selected ring-2 ring-blue-500 bg-blue-100 scale-105 z-10' : ''}
                ${isPrefilled ? 'prefilled bg-gray-50' : ''}
                ${hasError ? 'bg-red-100 ring-2 ring-red-400' : ''}
                ${isRelated && !isSelected ? 'bg-blue-50' : ''}
                ${isSameNumber ? 'bg-yellow-100' : ''}
                hover:bg-blue-50 hover:scale-105
              `}
              disabled={gameStatus !== 'playing' || isPrefilled}
            >
              {value !== 0 && (
                <span className={`
                  text-xl font-bold transition-colors
                  ${hasError ? 'text-red-600 animate-pulse' : ''}
                  ${isPrefilled && !hasError ? 'text-indigo-800' : ''}
                  ${!isPrefilled && !hasError ? 'text-blue-700' : ''}
                  ${isSameNumber && !hasError ? 'text-yellow-700 font-black' : ''}
                `}>
                  {value}
                </span>
              )}
            </button>
          )
        })
      )}
    </div>
  )
}