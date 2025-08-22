'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { useSudokuStore } from '@/store/sudoku-store'
import { EnhancedSudokuCell } from './enhanced-sudoku-cell'
import { TestCell } from './test-cell'
import type { Position } from '@/lib/sudoku/types'

export function EnhancedSudokuGrid() {
  const { currentGrid, selectedCell, selectCell, gameStatus } = useSudokuStore()
  
  // グリッドアニメーション設定
  const gridVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.02,
        when: "beforeChildren"
      }
    }
  }
  
  const cellVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3,
      y: -20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  }
  
  if (gameStatus === 'idle') {
    return (
      <motion.div 
        className="sudoku-grid relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="col-span-9 flex items-center justify-center h-96">
          <motion.div 
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div 
              className="text-8xl sm:text-9xl mb-6"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🧩
            </motion.div>
            <motion.h2 
              className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              数独パズルを始めよう！
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              難易度を選んでゲームを開始
            </motion.p>
          </motion.div>
        </div>
        
        {/* 背景の装飾 */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20"
              style={{
                left: `${(i * 20 + 10)}%`,
                top: `${(i * 15 + 20)}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    )
  }
  
  return (
    <div>
      {/* テスト用: 最初の行だけ表示 */}
      <div className="mb-4 p-2 bg-gray-100 rounded">
        <p className="text-sm font-bold mb-2">テスト（最初の行）:</p>
        <div className="flex gap-1">
          {currentGrid[0]?.map((value, index) => (
            <TestCell key={index} value={value} />
          ))}
        </div>
      </div>
      
      <motion.div 
        className="sudoku-grid relative"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        role="grid" 
        aria-label="数独グリッド"
      >
      {/* ゲーム一時停止時のオーバーレイ */}
      {gameStatus === 'paused' && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="text-6xl mb-4">⏸️</div>
            <p className="text-white text-2xl font-bold">一時停止中</p>
          </motion.div>
        </motion.div>
      )}
      
      {/* 3x3ブロックの境界線を強調 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 垂直線 */}
        <div className="absolute top-0 bottom-0 w-2 bg-gray-500" style={{ left: 'calc(33.333% - 4px)' }}></div>
        <div className="absolute top-0 bottom-0 w-2 bg-gray-500" style={{ left: 'calc(66.666% - 4px)' }}></div>
        {/* 水平線 */}
        <div className="absolute left-0 right-0 h-2 bg-gray-500" style={{ top: 'calc(33.333% - 4px)' }}></div>
        <div className="absolute left-0 right-0 h-2 bg-gray-500" style={{ top: 'calc(66.666% - 4px)' }}></div>
      </div>
      
      {currentGrid.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const position: Position = { row: rowIndex, col: colIndex }
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
          
          return (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              variants={cellVariants}
              className={clsx({
                'mr-2': colIndex === 2 || colIndex === 5,
                'mb-2': rowIndex === 2 || rowIndex === 5,
              })}
            >
              {/* デバッグ: 直接表示 */}
              <div className="sudoku-cell flex items-center justify-center bg-white">
                <span className="text-xl font-bold text-blue-700">
                  {value || ''}
                </span>
              </div>
              {/* <EnhancedSudokuCell
                position={position}
                value={value}
                isSelected={isSelected}
                onSelect={() => selectCell(position)}
                disabled={gameStatus !== 'playing'}
              /> */}
            </motion.div>
          )
        })
      )}
      
      {/* 完了時の祝福エフェクト */}
      {gameStatus === 'completed' && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2
            const radius = 40
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
                style={{
                  left: `${50 + Math.cos(angle) * radius}%`,
                  top: `${50 + Math.sin(angle) * radius}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  y: [0, -100],
                  x: [0, Math.cos(angle) * 100],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            )
          })}
        </motion.div>
      )}
    </motion.div>
    </div>
  )
}