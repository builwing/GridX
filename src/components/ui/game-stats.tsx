'use client'

import { motion } from 'framer-motion'
import { useSudokuStore } from '@/store/sudoku-store'
import { Clock, Target, AlertTriangle } from 'lucide-react'
import { formatTime } from '@/lib/utils/time'
import { useEffect } from 'react'

/**
 * ゲーム統計表示コンポーネント
 * 時間、手数、間違いの回数を表示
 */
export function GameStats() {
  const gameStatus = useSudokuStore(state => state.gameStatus)
  const moveCount = useSudokuStore(state => state.moveCount)
  const elapsedTime = useSudokuStore(state => state.elapsedTime)
  const mistakes = useSudokuStore(state => state.mistakes)
  const updateElapsedTime = useSudokuStore(state => state.updateElapsedTime)
  
  // タイマーの更新
  useEffect(() => {
    if (gameStatus !== 'playing') return
    
    const interval = setInterval(() => {
      updateElapsedTime()
    }, 1000)
    
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus])
  
  // 統計カードのアニメーション設定
  const statCardVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }
  
  return (
    <motion.div 
      className="grid grid-cols-3 gap-4 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 時間 */}
      <motion.div 
        className="stat-card"
        variants={statCardVariants}
        whileHover="hover"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600">時間</p>
            <p className="text-2xl font-black font-mono text-blue-700">
              {formatTime(elapsedTime)}
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* 手数 */}
      <motion.div 
        className="stat-card"
        variants={statCardVariants}
        whileHover="hover"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600">手数</p>
            <p className="text-2xl font-black font-mono text-green-700">
              {moveCount}
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* 間違い */}
      <motion.div 
        className="stat-card"
        variants={statCardVariants}
        whileHover="hover"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600">間違い</p>
            <p className="text-2xl font-black font-mono text-orange-700">
              {mistakes}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}