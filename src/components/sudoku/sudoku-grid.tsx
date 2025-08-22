'use client'

import { useSudokuStore } from '@/store/sudoku-store'
import { SudokuCell } from './sudoku-cell'
import type { Position } from '@/lib/sudoku/types'

export function SudokuGrid() {
  const { currentGrid, selectedCell, selectCell, gameStatus } = useSudokuStore()
  
  if (gameStatus === 'idle') {
    return (
      <div className="sudoku-grid">
        <div className="col-span-9 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-6xl mb-4">🧩</div>
            <p className="text-gray-600 text-lg">
              新しいゲームを開始してください
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="sudoku-grid" role="grid" aria-label="数独グリッド">
      {currentGrid.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const position: Position = { row: rowIndex, col: colIndex }
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
          
          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              position={position}
              value={value}
              isSelected={isSelected}
              onSelect={() => selectCell(isSelected ? null : position)}
              disabled={gameStatus !== 'playing'}
            />
          )
        })
      )}
    </div>
  )
}