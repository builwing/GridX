'use client'

import { motion } from 'framer-motion'
import { useSudokuStore } from '@/store/sudoku-store'
import { Eraser, Lightbulb } from 'lucide-react'

export function NumberPad() {
  const { 
    selectedCell, 
    setCellValue, 
    initialGrid,
    showErrors,
    gameStatus 
  } = useSudokuStore()
  
  const isDisabled = !selectedCell || gameStatus !== 'playing'
  const isPrefilled = selectedCell ? initialGrid[selectedCell.row][selectedCell.col] !== 0 : false
  
  const handleNumberClick = (num: number) => {
    if (isDisabled || isPrefilled) return
    setCellValue(selectedCell!, num)
  }
  
  const handleEraseClick = () => {
    if (isDisabled || isPrefilled) return
    setCellValue(selectedCell!, 0)
  }
  
  const handleHintClick = () => {
    if (isDisabled) return
    // ヒント機能は今後実装
    console.log('ヒント機能：今後実装予定')
  }
  
  // 数字ボタンのアニメーション設定
  const numberButtonVariants = {
    idle: { 
      scale: 1, 
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' 
    },
    hover: { 
      scale: 1.1,
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
    },
    disabled: {
      scale: 0.9,
      opacity: 0.5,
      boxShadow: '0 2px 8px rgba(156, 163, 175, 0.3)'
    }
  }
  
  const actionButtonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 },
    disabled: {
      scale: 0.95,
      opacity: 0.5
    }
  }
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  }
  
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">数字を選択</h3>
        {selectedCell && !isPrefilled ? (
          <p className="text-sm text-blue-600">
            行{selectedCell.row + 1}, 列{selectedCell.col + 1}を選択中
          </p>
        ) : isPrefilled ? (
          <p className="text-sm text-gray-500">
            初期値のセルは変更できません
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            セルを選択してください
          </p>
        )}
      </div>
      
      {/* 数字ボタン 1-9 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <motion.button
            key={num}
            className="number-button relative overflow-hidden"
            variants={numberButtonVariants}
            initial="idle"
            animate={isDisabled || isPrefilled ? "disabled" : "idle"}
            whileHover={!isDisabled && !isPrefilled ? "hover" : undefined}
            whileTap={!isDisabled && !isPrefilled ? "tap" : undefined}
            onClick={() => handleNumberClick(num)}
            disabled={isDisabled || isPrefilled}
          >
            <motion.span
              variants={itemVariants}
              className="relative z-10"
            >
              {num}
            </motion.span>
            
            {/* ボタンのキラキラ効果 */}
            {!isDisabled && !isPrefilled && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut'
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* アクションボタン */}
      <div className="flex gap-3 justify-center">
        <motion.button
          className="control-button-secondary flex items-center space-x-2"
          variants={actionButtonVariants}
          initial="idle"
          animate={isDisabled || isPrefilled ? "disabled" : "idle"}
          whileHover={!isDisabled && !isPrefilled ? "hover" : undefined}
          whileTap={!isDisabled && !isPrefilled ? "tap" : undefined}
          onClick={handleEraseClick}
          disabled={isDisabled || isPrefilled}
        >
          <Eraser className="w-5 h-5" />
          <span className="text-sm font-bold">消去</span>
        </motion.button>
        
        <motion.button
          className="control-button flex items-center space-x-2"
          variants={actionButtonVariants}
          initial="idle"
          animate={isDisabled ? "disabled" : "idle"}
          whileHover={!isDisabled ? "hover" : undefined}
          whileTap={!isDisabled ? "tap" : undefined}
          onClick={handleHintClick}
          disabled={isDisabled}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-bold">ヒント</span>
        </motion.button>
      </div>
      
      {/* 操作ガイド */}
      <motion.div 
        className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
        variants={itemVariants}
      >
        <p className="text-xs text-center text-blue-700 font-medium mb-1">
          💡 操作のヒント
        </p>
        <div className="text-xs text-blue-600 space-y-1">
          <p>• セルをタップして数字ボタンで入力</p>
          <p>• キーボードの1-9キーでも入力可能</p>
          <p>• 矢印キーでセル移動ができます</p>
        </div>
      </motion.div>
    </motion.div>
  )
}