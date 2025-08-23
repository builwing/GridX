import { EnhancedSudokuGridV2 } from '@/components/ui/enhanced-sudoku-grid-v2'
import { EnhancedGameControls } from '@/components/ui/enhanced-game-controls'
import { NumberPad } from '@/components/ui/number-pad'
import { GameStarter } from '@/components/ui/game-starter'
import { GameStats } from '@/components/ui/game-stats'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '数独ゲーム - 楽しいパズルチャレンジ',
  description: 'オンラインで楽しめる数独パズルゲーム。4つの難易度レベルから選択できます。',
}

export default function HomePage() {
  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* メインゲームエリア - 3:2の割合でレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* 左側 - 数独グリッド (3/5 = 60%) */}
          <div className="lg:col-span-3 flex flex-col justify-start">
            <div className="w-full">
              <GameStarter />
              <EnhancedSudokuGridV2 />
              
              {/* ゲーム統計 - パズルの下に配置 */}
              <div className="mt-6">
                <GameStats />
              </div>
            </div>
          </div>
          
          {/* 右側 - 数字入力パッドとゲームコントロール (2/5 = 40%) */}
          <div className="lg:col-span-2 flex flex-col justify-start">
            <div className="w-full max-w-md mx-auto">
              {/* 数字入力パッド */}
              <NumberPad />
              
              {/* ゲーム統計とコントロール - 数字入力パッドの下に配置 */}
              <div className="mt-6">
                <EnhancedGameControls />
              </div>
            </div>
          </div>
        </div>
        
        {/* 遊び方ガイド */}
        <div className="text-center mt-8 mb-8">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-2xl p-6 inline-block shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <div className="text-2xl mr-2">🎯</div>
              <p className="text-lg font-bold text-blue-800">
                遊び方ガイド
              </p>
              <div className="text-2xl ml-2">🎮</div>
            </div>
            <p className="text-sm text-blue-700 font-medium max-w-lg">
              空いているマスをタップして数字ボタンで入力してください。
              <br />
              縦・横・3×3のブロックに同じ数字が入らないようにパズルを完成させましょう！
            </p>
          </div>
        </div>
        
        {/* ヒント・ルール説明 */}
        <div className="mt-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border-4 border-gray-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2">
              <div className="text-3xl">📚</div>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                数独のルール
              </h2>
              <div className="text-3xl">🎓</div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-2">⚡</div>
                <h3 className="text-xl font-bold text-green-800">基本ルール</h3>
              </div>
              <ul className="text-green-700 font-medium space-y-3">
                <li className="flex items-start">
                  <span className="text-lg mr-2">🟩</span>
                  9×9のグリッドを1-9の数字で埋める
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">➡️</span>
                  各行に1-9の数字がそれぞれ一つずつ
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">⬇️</span>
                  各列に1-9の数字がそれぞれ一つずつ
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">📦</span>
                  各3×3ブロックに1-9の数字がそれぞれ一つずつ
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-2">🎮</div>
                <h3 className="text-xl font-bold text-blue-800">操作方法</h3>
              </div>
              <ul className="text-blue-700 font-medium space-y-3">
                <li className="flex items-start">
                  <span className="text-lg mr-2">👆</span>
                  マスをタップして選択
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">🔢</span>
                  数字ボタンまたは1-9キーで入力
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">🗑️</span>
                  消去ボタンまたはDeleteで削除
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">⌨️</span>
                  矢印キーで選択セルを移動
                </li>
              </ul>
            </div>
          </div>
          
          {/* 難易度説明 */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="text-center mb-4">
              <div className="inline-flex items-center space-x-2">
                <div className="text-2xl">🏆</div>
                <h3 className="text-xl font-bold text-purple-800">難易度レベル</h3>
                <div className="text-2xl">⭐</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">😊</div>
                <p className="text-sm font-bold text-green-700">簡単</p>
                <p className="text-xs text-green-600">初心者向け</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤔</div>
                <p className="text-sm font-bold text-yellow-700">普通</p>
                <p className="text-xs text-yellow-600">ほどよい挑戦</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">😤</div>
                <p className="text-sm font-bold text-orange-700">難しい</p>
                <p className="text-xs text-orange-600">思考力が必要</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <p className="text-sm font-bold text-red-700">上級</p>
                <p className="text-xs text-red-600">エキスパート専用</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}