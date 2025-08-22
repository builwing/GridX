import { NextResponse } from 'next/server'
import { generatePuzzle } from '@/lib/sudoku/generator'

export async function GET() {
  try {
    const puzzle = generatePuzzle({ difficulty: 'easy' })
    
    // カウント
    let filled = 0
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== 0) filled++
      }
    }
    
    return NextResponse.json({
      success: true,
      puzzle,
      filledCells: filled,
      message: 'Puzzle generated successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}