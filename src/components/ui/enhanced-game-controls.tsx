'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSudokuStore } from '@/store/sudoku-store'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Clock, 
  AlertTriangle,
  Target
} from 'lucide-react'
import { formatTime } from '@/lib/utils/time'
import { useEffect } from 'react'

const difficultyLabels = {
  easy: '簡単',
  medium: '普通',
  hard: '難しい',
  expert: 'エキスパート'
}

export function EnhancedGameControls() {
  const gameStatus = useSudokuStore(state => state.gameStatus)
  const moveCount = useSudokuStore(state => state.moveCount)
  const elapsedTime = useSudokuStore(state => state.elapsedTime)
  const mistakes = useSudokuStore(state => state.mistakes)
  const difficulty = useSudokuStore(state => state.difficulty)
  const togglePause = useSudokuStore(state => state.togglePause)
  const resetGame = useSudokuStore(state => state.resetGame)
  
  const handleTogglePause = () => {
    if (gameStatus === 'playing' || gameStatus === 'paused') {
      togglePause()
    }
  }
  
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
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ゲームコントロール */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 text-center mb-4">
            ゲームコントロール
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={handleTogglePause}
              disabled={gameStatus === 'idle' || gameStatus === 'completed'}
              className="game-button flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {gameStatus === 'playing' ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>一時停止</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>再開</span>
                </>
              )}
            </motion.button>
            
            <motion.button
              onClick={resetGame}
              className="game-button-secondary flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-5 h-5" />
              <span>リセット</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* ゲーム完了メッセージ */}
      <AnimatePresence>
        {gameStatus === 'completed' && (
          <motion.div
            className="success-celebration text-center"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
              }
            }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-500 via-pink-500 to-blue-500 bg-clip-text mb-3">
              おめでとうございます！
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">✨</span>
              <p className="text-xl font-bold text-gray-800">
                パズル完成！
              </p>
              <span className="text-2xl">✨</span>
            </div>
            <div className="bg-white bg-opacity-70 rounded-xl p-4 inline-block">
              <p className="text-lg font-bold text-gray-800 mb-2">
                🏆 結果
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <p>⏰ 時間: <span className="font-bold">{formatTime(elapsedTime)}</span></p>
                <p>🎯 手数: <span className="font-bold">{moveCount}回</span></p>
                <p>❌ 間違い: <span className="font-bold">{mistakes}回</span></p>
                <p>⭐ 難易度: <span className="font-bold">{difficultyLabels[difficulty]}</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 一時停止メッセージ */}
      <AnimatePresence>
        {gameStatus === 'paused' && (
          <motion.div
            className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-2xl p-6 text-center shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-3xl mb-2">⏸️</div>
            <p className="text-yellow-800 font-bold text-lg mb-2">
              ゲームが一時停止中です
            </p>
            <p className="text-yellow-700 font-medium">
              「再開」ボタンを押してください
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}