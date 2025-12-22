'use client'

import { FiShare2 } from 'react-icons/fi'

interface UrlInfoPanelProps {
  hasContent: boolean
  onCopyUrl: () => void
  onClearUrl: () => void
}

export default function UrlInfoPanel({ hasContent, onCopyUrl, onClearUrl }: UrlInfoPanelProps) {
  return (
    <div className="mb-4 p-4 bg-blue-400/10 border border-blue-400/20 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <FiShare2 size={20} className="text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-blue-400 mb-1">Сохранение в URL</h4>
          <p className="text-sm text-blue-300">
            Ваш документ автоматически сохраняется в URL. Вы можете поделиться ссылкой или сохранить её в закладках. 
            При открытии ссылки документ будет автоматически восстановлен.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={onCopyUrl}
              className="text-sm px-3 py-1 bg-blue-400/10 text-blue-400 rounded hover:bg-blue-400/20 transition-colors border border-blue-400/20"
            >
              Скопировать текущую ссылку
            </button>
            <button
              onClick={onClearUrl}
              className="text-sm px-3 py-1 bg-mini/10 text-mini rounded hover:bg-mini/20 transition-colors border border-mini/20"
            >
              Очистить URL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}