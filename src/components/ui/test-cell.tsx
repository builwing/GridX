'use client'

export function TestCell({ value }: { value: number }) {
  return (
    <div className="w-12 h-12 border-2 border-gray-300 bg-white flex items-center justify-center">
      <span className="text-xl font-bold text-blue-700">
        {value || '-'}
      </span>
    </div>
  )
}