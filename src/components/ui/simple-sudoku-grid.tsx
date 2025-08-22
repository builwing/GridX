'use client'

import { useSudokuStore } from '@/store/sudoku-store'

export function SimpleSudokuGrid() {
  const { currentGrid, gameStatus, selectCell, selectedCell } = useSudokuStore()
  
  if (gameStatus !== 'playing') {
    return null
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <h3 className="font-bold mb-2">シンプル版グリッド（テスト用）</h3>
      <div className="grid grid-cols-9 gap-0.5 bg-gray-400 p-2">
        {currentGrid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => selectCell({ row: rowIndex, col: colIndex })}
                className={`
                  w-10 h-10 bg-white border border-gray-300 
                  flex items-center justify-center text-lg font-bold
                  hover:bg-blue-50 cursor-pointer
                  ${isSelected ? 'bg-blue-200 ring-2 ring-blue-500' : ''}
                  ${value !== 0 ? 'text-blue-700' : 'text-gray-400'}
                  ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2 border-b-black' : ''}
                  ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2 border-r-black' : ''}
                `}
              >
                {value || ''}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}