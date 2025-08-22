'use client'

import { useSudokuStore } from '@/store/sudoku-store'
import type { Position } from '@/lib/sudoku/types'
import { clsx } from 'clsx'

interface EnhancedSudokuCellProps {
  position: Position
  value: number
  isSelected: boolean
  onSelect: () => void
  disabled?: boolean
}

export function EnhancedSudokuCell({ 
  position, 
  value, 
  isSelected, 
  onSelect, 
  disabled = false 
}: EnhancedSudokuCellProps) {
  const { initialGrid, setCellValue, showErrors, mistakes } = useSudokuStore()
  const { row, col } = position
  
  const isPrefilled = initialGrid[row][col] !== 0
  const isEmpty = value === 0
  
  const handleClick = () => {
    if (disabled || isPrefilled) return
    onSelect()
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || isPrefilled) return
    
    const key = e.key
    
    // 数字キー (1-9) または Backspace/Delete
    if (/^[1-9]$/.test(key)) {
      const numValue = parseInt(key, 10)
      const isValid = setCellValue(position, numValue)
      
      // エラー表示が有効で無効な手の場合、アニメーション追加
      if (!isValid && showErrors) {
        // エラー状態は親コンポーネントで管理
      }
    } else if (key === 'Backspace' || key === 'Delete' || key === ' ') {
      setCellValue(position, 0)
    }
    
    // 矢印キーでのナビゲーション
    const { selectCell } = useSudokuStore.getState()
    let newRow = row
    let newCol = col
    
    switch (key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1)
        break
      case 'ArrowDown':
        newRow = Math.min(8, row + 1)
        break
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1)
        break
      case 'ArrowRight':
        newCol = Math.min(8, col + 1)
        break
      default:
        return
    }
    
    if (newRow !== row || newCol !== col) {
      e.preventDefault()
      selectCell({ row: newRow, col: newCol })
    }
  }
  
  
  return (
    <button
      type="button"
      className={clsx(
        'sudoku-cell relative flex items-center justify-center',
        {
          'selected': isSelected,
          'prefilled': isPrefilled,
        }
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={isSelected ? 0 : -1}
      role="gridcell"
      aria-label={`行${row + 1}列${col + 1}${isEmpty ? '空白' : `値${value}`}${isPrefilled ? '初期値' : ''}`}
      aria-selected={isSelected}
      aria-readonly={isPrefilled}
    >
      {/* 数字の表示 */}
      {!isEmpty && (
        <span
          className={clsx(
            'text-xl font-bold',
            {
              'text-indigo-800': isPrefilled,
              'text-blue-700': !isPrefilled,
            }
          )}
        >
          {value}
        </span>
      )}
    </button>
  )
}