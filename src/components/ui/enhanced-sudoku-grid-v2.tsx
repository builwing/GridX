'use client'

import { useSudokuStore } from '@/store/sudoku-store'
import { validateGrid } from '@/lib/sudoku'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * 時間を「分:秒」形式でフォーマットする関数
 * @param ms ミリ秒単位の時間
 * @returns フォーマットされた時間文字列
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 難易度を日本語に変換する関数
 * @param difficulty 英語の難易度
 * @returns 日本語の難易度
 */
function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '初級'
    case 'medium': return '中級'
    case 'hard': return '上級'
    case 'expert': return '最難'
    default: return '中級'
  }
}

/**
 * 拡張数独グリッドコンポーネント v2
 * 
 * グリッドラインスタイルの数独パネルを提供します：
 * - 各セルは細い境界線（1px）で区切られます
 * - 3×3ブロックの境界は太い線（3px）で強調表示されます
 * - レスポンシブデザインに対応（モバイル・タブレット・デスクトップ）
 * - セルの選択、エラー表示、同一数字ハイライトなどの機能を含みます
 * - ゲーム完了時の成功ポップアップを表示します
 */
export function EnhancedSudokuGridV2() {
  const { currentGrid, selectedCell, selectCell, gameStatus, initialGrid, difficulty, elapsedTime, startTime, newGame } = useSudokuStore()
  
  // グリッド全体の検証を行い、エラーのあるセルを特定
  const validationResult = validateGrid(currentGrid)
  const errorPositions = new Set(
    validationResult.errors.map(error => `${error.position.row}-${error.position.col}`)
  )
  
  if (gameStatus === 'idle') {
    return (
      <div className="sudoku-grid relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🧩</div>
          <h2 className="text-2xl font-bold text-gray-700">数独パズルを始めよう！</h2>
          <p className="text-gray-600 mt-2">難易度を選んでゲームを開始</p>
        </div>
      </div>
    )
  }
  
  // 完了時間を計算
  const completionTime = startTime && gameStatus === 'completed' 
    ? Date.now() - startTime 
    : elapsedTime

  // 成功ポップアップのコンフェティ（紙吹雪）アニメーション
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)],
    size: Math.random() * 10 + 5,
    rotation: Math.random() * 360,
  }))

  return (
    <div className="sudoku-grid relative">
      {currentGrid.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
          const isPrefilled = initialGrid[rowIndex][colIndex] !== 0
          const hasError = errorPositions.has(`${rowIndex}-${colIndex}`) && value !== 0 && !isPrefilled
          
          // 同じ数字をハイライト
          const isSameNumber = selectedCell && 
                              currentGrid[selectedCell.row][selectedCell.col] !== 0 &&
                              currentGrid[selectedCell.row][selectedCell.col] === value &&
                              !(selectedCell.row === rowIndex && selectedCell.col === colIndex)
          
          // 同じ行・列・ブロックをハイライト
          const isRelated = selectedCell && (
            selectedCell.row === rowIndex ||
            selectedCell.col === colIndex ||
            (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
             Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3))
          )
          
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => selectCell({ row: rowIndex, col: colIndex })}
              className={`
                sudoku-cell relative flex items-center justify-center transition-all
                ${value !== 0 && !isSelected && !hasError ? 'bg-gray-100' : ''}
                ${isSelected ? 'selected ring-2 ring-blue-500 bg-blue-100 z-10' : ''}
                ${isPrefilled ? 'prefilled bg-gray-200' : ''}
                ${hasError ? 'bg-red-100 ring-2 ring-red-400' : ''}
                ${isRelated && !isSelected && value === 0 ? 'bg-blue-50' : ''}
                ${isSameNumber ? 'bg-yellow-100' : ''}
                ${value === 0 && !isSelected ? 'bg-white' : ''}
                hover:bg-blue-50
              `}
              disabled={gameStatus !== 'playing' || isPrefilled}
            >
              {value !== 0 && (
                <span className={`
                  text-3xl sm:text-4xl font-bold transition-colors
                  ${hasError ? 'text-red-600 animate-pulse' : ''}
                  ${isPrefilled && !hasError ? 'text-indigo-800' : ''}
                  ${!isPrefilled && !hasError ? 'text-blue-700' : ''}
                  ${isSameNumber && !hasError ? 'text-yellow-700 font-black' : ''}
                `}>
                  {value}
                </span>
              )}
            </button>
          )
        })
      )}
      
      {/* 成功ポップアップ */}
      <AnimatePresence>
        {gameStatus === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          >
            {/* コンフェティ（紙吹雪）アニメーション */}
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  backgroundColor: particle.color,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  borderRadius: '50%',
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: 0,
                  y: -100,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0.5],
                  rotate: particle.rotation,
                  y: [particle.y - 10, particle.y + 50],
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5,
                }}
              />
            ))}
            
            {/* メインポップアップ */}
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.5, 
                y: 50,
                rotate: -5,
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotate: 0,
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                y: -20,
              }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 300,
                duration: 0.6,
              }}
              className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center relative overflow-hidden"
            >
              {/* 背景のキラキラエフェクト */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-pink-100/50 to-purple-100/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
              
              {/* コンテンツ */}
              <div className="relative z-10">
                {/* トロフィーアイコン */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 12,
                    stiffness: 200,
                    delay: 0.3,
                  }}
                  className="text-6xl mb-4"
                >
                  🏆
                </motion.div>
                
                {/* おめでとうメッセージ */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-3xl font-bold text-gray-800 mb-2"
                >
                  おめでとうございます！
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-gray-600 mb-6"
                >
                  数独パズルをクリアしました！
                </motion.p>
                
                {/* ゲーム統計 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">難易度：</span>
                    <span className="text-sm font-bold text-blue-600">
                      {getDifficultyLabel(difficulty)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">完了時間：</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatTime(completionTime)}
                    </span>
                  </div>
                </motion.div>
                
                {/* 新しいゲームボタン */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => newGame(difficulty)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  新しいゲーム
                </motion.button>
                
                {/* さらなる装飾エフェクト */}
                <motion.div
                  className="absolute -top-4 -right-4 text-4xl"
                  initial={{ opacity: 0, rotate: -45, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    rotate: [-45, 0, 45, 90], 
                    scale: [0, 1, 1.2, 0] 
                  }}
                  transition={{
                    duration: 2,
                    delay: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  ✨
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-2 -left-2 text-3xl"
                  initial={{ opacity: 0, rotate: 45, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    rotate: [45, 0, -45, -90], 
                    scale: [0, 1, 1.2, 0] 
                  }}
                  transition={{
                    duration: 2,
                    delay: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  🌟
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}