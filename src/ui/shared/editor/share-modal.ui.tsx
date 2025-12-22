'use client'

import { useState, useEffect } from 'react'
import { FiCopy, FiX } from 'react-icons/fi'
import { encodeContent } from '@/lib/url-utils'

interface ShareModalProps {
  markdown: string
  filename: string
  onClose: () => void
  onCopy: () => void
}

export default function ShareModal({ markdown, filename, onClose, onCopy }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    const encodedContent = encodeContent(markdown)
    const url = new URL(window.location.href)
    url.searchParams.set('content', encodedContent)
    if (filename !== 'документ.md') {
      url.searchParams.set('filename', filename)
    }
    setShareUrl(url.toString())
  }, [markdown, filename])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-component rounded-lg shadow-xl max-w-md w-full p-6 border border-mini">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Поделиться документом</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-card rounded"
          >
            <FiX size={20} />
          </button>
        </div>
        <p className="text-mini mb-4">
          Скопируйте ссылку ниже, чтобы поделиться этим документом:
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-mini rounded-md text-sm bg-card"
          />
          <button
            onClick={onCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiCopy size={16} />
            Копировать
          </button>
        </div>
        <div className="text-xs text-mini">
          <p>Ссылка содержит весь контент документа в закодированном виде.</p>
          <p className="mt-1">⚠️ Для больших документов URL может быть очень длинным.</p>
        </div>
      </div>
    </div>
  )
}