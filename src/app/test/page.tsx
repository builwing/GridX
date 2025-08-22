'use client'

import { useState } from 'react'
import { generatePuzzle } from '@/lib/sudoku/generator'
import type { Difficulty } from '@/lib/sudoku/types'

export default function TestPage() {
  const [puzzle, setPuzzle] = useState<number[][]>([])
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  
  const handleGeneratePuzzle = () => {
    try {
      const newPuzzle = generatePuzzle({ difficulty })
      setPuzzle(newPuzzle)
      console.log('Generated puzzle:', newPuzzle)
    } catch (error) {
      console.error('Error generating puzzle:', error)
    }
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">数独パズル生成テスト</h1>
      
      <div className="mb-4">
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="p-2 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
        
        <button 
          onClick={handleGeneratePuzzle}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          パズル生成
        </button>
      </div>
      
      {puzzle.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">生成されたパズル:</h2>
          <div className="grid grid-cols-9 gap-1 bg-gray-200 p-2 max-w-md">
            {puzzle.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-10 h-10 bg-white border border-gray-300 
                    flex items-center justify-center font-bold
                    ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2 border-b-black' : ''}
                    ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2 border-r-black' : ''}
                  `}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4">
            <p>埋まっているセル数: {puzzle.flat().filter(n => n !== 0).length}</p>
          </div>
        </div>
      )}
    </div>
  )
}