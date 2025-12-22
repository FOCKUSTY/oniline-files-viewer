'use client'

import { FiType, FiBookOpen, FiCode } from 'react-icons/fi'

interface StatsPanelProps {
  markdown: string
  filename: string
  onFilenameChange: (filename: string) => void
  onFilenameUpdate: () => void
}

export default function StatsPanel({ 
  markdown, 
  filename, 
  onFilenameChange, 
  onFilenameUpdate 
}: StatsPanelProps) {
  const charCount = markdown.length
  const wordCount = markdown.trim().split(/\s+/).filter(word => word.length > 0).length
  const lineCount = markdown.split('\n').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-card rounded-lg border border-mini">
        <div className="flex items-center gap-2 mb-2">
          <FiType className="w-5 h-5 text-mini" />
          <span className="text-sm text-mini">Символов</span>
        </div>
        <p className="text-2xl font-bold">{charCount.toLocaleString()}</p>
      </div>
      
      <div className="p-4 bg-card rounded-lg border border-mini">
        <div className="flex items-center gap-2 mb-2">
          <FiBookOpen className="w-5 h-5 text-mini" />
          <span className="text-sm text-mini">Слов</span>
        </div>
        <p className="text-2xl font-bold">{wordCount.toLocaleString()}</p>
      </div>
      
      <div className="p-4 bg-card rounded-lg border border-mini">
        <div className="flex items-center gap-2 mb-2">
          <FiCode className="w-5 h-5 text-mini" />
          <span className="text-sm text-mini">Строк</span>
        </div>
        <p className="text-2xl font-bold">{lineCount}</p>
      </div>
      
      <div className="p-4 bg-card rounded-lg border border-mini">
        <label className="block text-sm font-medium text-mini mb-2">
          Имя файла
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={filename}
            onChange={(e) => onFilenameChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-mini rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-component"
            placeholder="введите имя файла"
          />
          <button
            onClick={onFilenameUpdate}
            className="px-3 py-2 bg-blue-400/10 text-blue-400 rounded-md hover:bg-blue-400/20 transition-colors text-sm border border-blue-400/20"
          >
            Обновить
          </button>
        </div>
      </div>
    </div>
  )
}