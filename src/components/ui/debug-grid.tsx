'use client'

import { useSudokuStore } from '@/store/sudoku-store'

export function DebugGrid() {
  const { currentGrid, gameStatus, initialGrid } = useSudokuStore()
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="font-bold mb-2">デバッグ情報</h3>
      <p>ゲーム状態: {gameStatus}</p>
      <p>currentGrid[0][0]: {currentGrid[0]?.[0]}</p>
      <p>initialGrid[0][0]: {initialGrid[0]?.[0]}</p>
      <p>埋まっているセル数 (current): {currentGrid.flat().filter(n => n !== 0).length}</p>
      <p>埋まっているセル数 (initial): {initialGrid.flat().filter(n => n !== 0).length}</p>
      
      {gameStatus === 'playing' && (
        <div className="mt-2">
          <p className="text-sm font-bold">完全なグリッド:</p>
          <div className="grid grid-cols-9 gap-0 w-72 bg-white p-1">
            {currentGrid.map((row, ri) => 
              row.map((cell, ci) => (
                <div 
                  key={`${ri}-${ci}`} 
                  className={`w-8 h-8 border text-xs flex items-center justify-center ${
                    cell !== 0 ? 'bg-blue-100 font-bold' : ''
                  }`}
                >
                  {cell || '-'}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}