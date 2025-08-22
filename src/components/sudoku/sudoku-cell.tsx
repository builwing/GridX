'use client'

import { useSudokuStore } from '@/store/sudoku-store'
import type { Position } from '@/lib/sudoku/types'
import { clsx } from 'clsx'

interface SudokuCellProps {
  position: Position
  value: number
  isSelected: boolean
  onSelect: () => void
  disabled?: boolean
}

export function SudokuCell({ 
  position, 
  value, 
  isSelected, 
  onSelect, 
  disabled = false 
}: SudokuCellProps) {
  const { initialGrid, setCellValue, showErrors } = useSudokuStore()
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
        e.currentTarget.classList.add('animate-error')
        setTimeout(() => {
          e.currentTarget.classList.remove('animate-error')
        }, 300)
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
        'sudoku-cell',
        isSelected && 'selected',
        isPrefilled && 'prefilled',
        // 境界線の調整（3x3ボックス境界）
        col % 3 === 2 && col !== 8 && 'border-r-2 border-r-sudoku-border-thick',
        row % 3 === 2 && row !== 8 && 'border-b-2 border-b-sudoku-border-thick'
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
      {isEmpty ? '' : value}
    </button>
  )
}