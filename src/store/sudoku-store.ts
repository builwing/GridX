import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SudokuGrid, Position, Difficulty } from '@/lib/sudoku/types'
import { canPlaceValue, isComplete, validateGrid } from '@/lib/sudoku'
import { generatePuzzleV2 } from '@/lib/sudoku/generator-v2'

export type GameStatus = 'idle' | 'playing' | 'completed' | 'paused'

export interface SudokuState {
  // ゲーム状態
  currentGrid: SudokuGrid
  initialGrid: SudokuGrid
  selectedCell: Position | null
  gameStatus: GameStatus
  difficulty: Difficulty
  
  // 統計
  moveCount: number
  startTime: number | null
  elapsedTime: number
  mistakes: number
  
  // UI状態
  showHints: boolean
  showErrors: boolean
  
  // アクション
  newGame: (difficulty: Difficulty) => void
  setCellValue: (position: Position, value: number) => boolean
  clearCell: (position: Position) => void
  selectCell: (position: Position | null) => void
  togglePause: () => void
  resetGame: () => void
  updateElapsedTime: () => void
  
  // 設定
  toggleHints: () => void
  toggleErrorDisplay: () => void
}

const initialGrid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(0))

export const useSudokuStore = create<SudokuState>()(
  devtools(
    (set, get) => ({
      // 初期状態
      currentGrid: initialGrid,
      initialGrid: initialGrid,
      selectedCell: null,
      gameStatus: 'idle',
      difficulty: 'medium',
      moveCount: 0,
      startTime: null,
      elapsedTime: 0,
      mistakes: 0,
      showHints: true,
      showErrors: true,

      // アクション
      newGame: (difficulty: Difficulty) => {
        try {
          const puzzle = generatePuzzleV2({ difficulty })
          set({
            currentGrid: puzzle.map(row => [...row]),
            initialGrid: puzzle.map(row => [...row]),
            difficulty,
            gameStatus: 'playing',
            selectedCell: null,
            moveCount: 0,
            mistakes: 0,
            startTime: Date.now(),
            elapsedTime: 0,
          })
        } catch (error) {
          console.error('Failed to generate sudoku:', error)
          // フォールバック: 空のグリッドで開始
          set({
            currentGrid: initialGrid,
            initialGrid: initialGrid,
            difficulty,
            gameStatus: 'playing',
            selectedCell: null,
            moveCount: 0,
            mistakes: 0,
            startTime: Date.now(),
            elapsedTime: 0,
          })
        }
      },

      setCellValue: (position: Position, value: number): boolean => {
        const state = get()
        if (state.gameStatus !== 'playing') return false
        
        const { row, col } = position
        
        // 初期値のセルは変更不可
        if (state.initialGrid[row][col] !== 0) return false
        
        // 新しいグリッドを作成
        const newGrid = state.currentGrid.map(r => [...r])
        const oldValue = newGrid[row][col]
        
        // 値が変更された場合のみ処理
        if (oldValue === value) return true
        
        newGrid[row][col] = value
        
        // 有効性をチェック（0の場合は常に有効）
        let isValid = true
        let newMistakes = state.mistakes
        
        if (value !== 0) {
          // 行のチェック
          for (let c = 0; c < 9; c++) {
            if (c !== col && newGrid[row][c] === value) {
              isValid = false
              break
            }
          }
          
          // 列のチェック
          if (isValid) {
            for (let r = 0; r < 9; r++) {
              if (r !== row && newGrid[r][col] === value) {
                isValid = false
                break
              }
            }
          }
          
          // 3x3ブロックのチェック
          if (isValid) {
            const blockRow = Math.floor(row / 3) * 3
            const blockCol = Math.floor(col / 3) * 3
            for (let r = blockRow; r < blockRow + 3; r++) {
              for (let c = blockCol; c < blockCol + 3; c++) {
                if ((r !== row || c !== col) && newGrid[r][c] === value) {
                  isValid = false
                  break
                }
              }
              if (!isValid) break
            }
          }
          
          if (!isValid) {
            newMistakes++
          }
        }
        
        // ゲーム完了をチェック
        const isGameComplete = isComplete(newGrid) && validateGrid(newGrid).isValid
        const newGameStatus = isGameComplete ? 'completed' : 'playing'
        
        set({
          currentGrid: newGrid,
          moveCount: state.moveCount + 1,
          mistakes: newMistakes,
          gameStatus: newGameStatus,
        })
        
        return isValid
      },

      clearCell: (position: Position) => {
        const state = get()
        if (state.gameStatus !== 'playing') return
        
        const { row, col } = position
        
        // 初期値のセルは変更不可
        if (state.initialGrid[row][col] !== 0) return
        
        const newGrid = state.currentGrid.map(r => [...r])
        newGrid[row][col] = 0
        
        set({
          currentGrid: newGrid,
          moveCount: state.moveCount + 1,
        })
      },

      selectCell: (position: Position | null) => {
        set({ selectedCell: position })
      },

      togglePause: () => {
        const state = get()
        if (state.gameStatus === 'playing') {
          set({ gameStatus: 'paused' })
        } else if (state.gameStatus === 'paused') {
          set({ gameStatus: 'playing' })
        }
      },

      resetGame: () => {
        set({
          currentGrid: initialGrid,
          initialGrid: initialGrid,
          selectedCell: null,
          gameStatus: 'idle',
          moveCount: 0,
          startTime: null,
          elapsedTime: 0,
          mistakes: 0,
        })
      },

      updateElapsedTime: () => {
        const state = get()
        if (state.startTime && state.gameStatus === 'playing') {
          const newElapsedTime = Math.floor((Date.now() - state.startTime) / 1000)
          if (newElapsedTime !== Math.floor(state.elapsedTime / 1000)) {
            set({ elapsedTime: newElapsedTime * 1000 })
          }
        }
      },

      // 設定
      toggleHints: () => {
        set(state => ({ showHints: !state.showHints }))
      },

      toggleErrorDisplay: () => {
        set(state => ({ showErrors: !state.showErrors }))
      },
    }),
    {
      name: 'sudoku-store',
    }
  )
)