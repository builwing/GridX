'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSudokuStore } from '@/store/sudoku-store'
import type { Difficulty } from '@/lib/sudoku/types'
import { Sparkles, Star } from 'lucide-react'

const difficultyLabels: Record<Difficulty, string> = {
  easy: '簡単',
  medium: '普通',
  hard: '難しい',
  expert: '上級'
}

const difficultyEmojis: Record<Difficulty, string> = {
  easy: '😊',
  medium: '🤔',
  hard: '😤',
  expert: '🔥'
}

const difficultyColors: Record<Difficulty, string> = {
  easy: 'from-green-400 to-green-600',
  medium: 'from-yellow-400 to-orange-500',
  hard: 'from-orange-500 to-red-500',
  expert: 'from-red-500 to-purple-600'
}

export function GameStarter() {
  const { newGame, gameStatus } = useSudokuStore()
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')
  
  const handleStartGame = () => {
    newGame(selectedDifficulty)
  }
  
  // ゲーム中は表示しない
  if (gameStatus !== 'idle') {
    return null
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200 mb-6"
    >
      <div className="flex items-center justify-center mb-4">
        <Star className="w-6 h-6 text-yellow-500 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">難易度を選択</h3>
        <Star className="w-6 h-6 text-yellow-500 ml-2" />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(Object.keys(difficultyLabels) as Difficulty[]).map((diff) => (
          <motion.button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`difficulty-button ${
              selectedDifficulty === diff ? 'active' : 'inactive'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-2xl mb-1">{difficultyEmojis[diff]}</div>
            <div className="text-sm font-bold">
              {difficultyLabels[diff]}
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* パズル生成ボタン */}
      <motion.button
        onClick={handleStartGame}
        className={`w-full px-6 py-4 bg-gradient-to-r ${difficultyColors[selectedDifficulty]} text-white rounded-xl font-bold text-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <Sparkles className="w-6 h-6" />
          <span>ゲームを開始</span>
          <Sparkles className="w-6 h-6" />
        </div>
      </motion.button>
    </motion.div>
  )
}