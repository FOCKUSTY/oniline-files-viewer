'use client'

import { FiShare2, FiSave, FiLink, FiHash, FiBold, FiItalic, FiImage, FiCode, FiList } from 'react-icons/fi'

export default function QuickTips() {
  const tips = [
    { syntax: '# Заголовок', desc: 'Заголовок 1 уровня', icon: FiHash },
    { syntax: '**жирный**', desc: 'Жирный текст', icon: FiBold },
    { syntax: '*курсив*', desc: 'Курсивный текст', icon: FiItalic },
    { syntax: '[ссылка](https://...)', desc: 'Вставить ссылку', icon: FiLink },
    { syntax: '![alt](https://...)', desc: 'Вставить изображение', icon: FiImage },
    { syntax: '```код```', desc: 'Блок кода', icon: FiCode },
    { syntax: '- элемент', desc: 'Маркированный список', icon: FiList },
    { syntax: '1. элемент', desc: 'Нумерованный список', icon: FiList },
  ]

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 border border-mini/20 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Сохранение в URL</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">
            Документ сохранён
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-card rounded-lg border border-mini">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <FiShare2 size={16} className="text-blue-400" />
            </div>
            <h4 className="font-medium text-blue-400">Поделиться</h4>
          </div>
          <p className="text-sm text-mini">
            Просто скопируйте ссылку из адресной строки, чтобы поделиться документом
          </p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-mini">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <FiSave size={16} className="text-blue-400" />
            </div>
            <h4 className="font-medium text-blue-400">Автосохранение</h4>
          </div>
          <p className="text-sm text-mini">
            Изменения автоматически сохраняются в URL каждую секунду
          </p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-mini">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <FiLink size={16} className="text-blue-400" />
            </div>
            <h4 className="font-medium text-blue-400">Восстановление</h4>
          </div>
          <p className="text-sm text-mini">
            При открытии сохранённой ссылки документ автоматически восстанавливается
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tips.map((tip, index) => {
          const Icon = tip.icon
          return (
            <div key={index} className="p-3 bg-card rounded border border-mini">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-blue-400" />
                <code className="font-mono text-sm text-blue-400">{tip.syntax}</code>
              </div>
              <p className="text-sm text-mini">{tip.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-400/10 rounded-lg border border-mini">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm">!</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-blue-300">
              <strong>Важно:</strong> Из-за ограничений длины URL в браузерах, очень большие документы 
              могут не полностью сохраниться в ссылке. Для больших документов рекомендуется использовать 
              функцию "Сохранить" для скачивания файла.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}