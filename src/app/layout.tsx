import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '数独ゲーム - Sudoku Puzzle',
  description: '楽しい数独パズルゲーム。10歳以上のお子様から大人まで楽しめます。',
  keywords: ['数独', 'パズル', 'ゲーム', 'sudoku', 'puzzle'],
  authors: [{ name: 'Sudoku Game Team' }],
  robots: 'index, follow',
  openGraph: {
    title: '数独ゲーム - Sudoku Puzzle',
    description: '楽しい数独パズルゲーム',
    type: 'website',
    locale: 'ja_JP',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full flex flex-col">
          <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center space-x-3">
                  <span className="text-4xl">🧩</span>
                  <span>数独パズル</span>
                  <span className="text-4xl">✨</span>
                </h1>
                <p className="text-blue-100 text-lg font-medium mt-2">
                  1から9の数字を使ってパズルを完成させよう！
                </p>
              </div>
            </div>
          </header>
          
          <main className="flex-1 w-full">
            {children}
          </main>
          
          <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center">
                <p className="text-gray-300 font-medium mb-2">
                  🎯 数独を楽しんでいただき、ありがとうございます！
                </p>
                <p className="text-sm text-gray-400">
                  © 2024 数独ゲーム. みんなでパズルを楽しもう！ 🌟
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}