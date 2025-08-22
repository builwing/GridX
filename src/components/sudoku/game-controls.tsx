'use client'

import { useSudokuStore } from '@/store/sudoku-store'
import type { Difficulty } from '@/lib/sudoku/types'
import { Play, Pause, RotateCcw, Trophy, Clock, AlertTriangle } from 'lucide-react'
import { formatTime } from '@/lib/utils/time'
import { useEffect } from 'react'

const difficultyLabels: Record<Difficulty, string> = {
  easy: '簡単',
  medium: '普通',
  hard: '難しい',
  expert: '上級'
}

export function GameControls() {
  const {
    gameStatus,
    difficulty,
    moveCount,
    elapsedTime,
    mistakes,
    newGame,
    togglePause,
    resetGame,
    updateElapsedTime,
  } = useSudokuStore()
  
  // タイマーの更新
  useEffect(() => {
    if (gameStatus !== 'playing') return
    
    const interval = setInterval(() => {
      updateElapsedTime()
    }, 1000)
    
    return () => clearInterval(interval)
  }, [gameStatus, updateElapsedTime])
  
  const handleNewGame = (selectedDifficulty: Difficulty) => {
    newGame(selectedDifficulty)
  }
  
  const handleTogglePause = () => {
    if (gameStatus === 'playing' || gameStatus === 'paused') {
      togglePause()
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* ゲーム統計 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium">時間</p>
            <p className="text-lg font-mono">{formatTime(elapsedTime)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-700">
          <Trophy className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium">手数</p>
            <p className="text-lg font-mono">{moveCount}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-700">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-sm font-medium">間違い</p>
            <p className="text-lg font-mono">{mistakes}</p>
          </div>
        </div>
      </div>
      
      {/* 難易度選択 */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">難易度を選択:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(difficultyLabels) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => handleNewGame(diff)}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                difficulty === diff
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {difficultyLabels[diff]}
            </button>
          ))}
        </div>
      </div>
      
      {/* ゲームコントロール */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleTogglePause}
          disabled={gameStatus === 'idle' || gameStatus === 'completed'}
          className="game-button flex items-center space-x-2"
        >
          {gameStatus === 'playing' ? (
            <>
              <Pause className="w-4 h-4" />
              <span>一時停止</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>再開</span>
            </>
          )}
        </button>
        
        <button
          onClick={resetGame}
          className="game-button-secondary flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>リセット</span>
        </button>
      </div>
      
      {/* ゲーム完了メッセージ */}
      {gameStatus === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-green-800 font-medium mb-2">おめでとうございます！</p>
          <p className="text-sm text-green-700">
            {formatTime(elapsedTime)}で完成しました！
            <br />
            手数: {moveCount}回, 間違い: {mistakes}回
          </p>
        </div>
      )}
      
      {/* 一時停止メッセージ */}
      {gameStatus === 'paused' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800 font-medium">ゲームが一時停止中です</p>
          <p className="text-sm text-yellow-700">「再開」ボタンを押してください</p>
        </div>
      )}
    </div>
  )
}