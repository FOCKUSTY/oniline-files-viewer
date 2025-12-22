'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Bold,
  Italic,
  List,
  Heading,
  Link,
  Image,
  Code,
  Save,
  Eye,
  EyeOff,
  Type,
  Copy,
  Share2,
  X
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

// Функции для кодирования/декодирования контента в URL
const encodeContent = (content: string): string => {
  try {
    return encodeURIComponent(btoa(encodeURIComponent(content)))
  } catch {
    return ''
  }
}

const decodeContent = (encoded: string): string => {
  try {
    return decodeURIComponent(atob(decodeURIComponent(encoded)))
  } catch {
    return ''
  }
}

const defaultMarkdown = `# Добро пожаловать в MD Editor!

## Это редактор Markdown с реальным предпросмотром

### Основные возможности:
- **Редактирование** в реальном времени
- **Предпросмотр** с подсветкой синтаксиса
- **Экспорт** файлов
- **Поддержка** GitHub Flavored Markdown
- **Сохранение** в URL

### Пример кода:
\`\`\`javascript
function helloWorld() {
  console.log("Привет, мир!");
  return "Hello World!";
}
\`\`\`

### Списки:
1. Первый пункт
2. Второй пункт
3. Третий пункт

### Ссылки и изображения:
[Документация Markdown](https://www.markdownguide.org)

![Иконка Markdown](https://markdown-here.com/img/icon256.png)

### Таблица:
| Функция | Поддерживается |
|---------|---------------|
| Заголовки | ✅ |
| Списки | ✅ |
| Код | ✅ |
| Таблицы | ✅ |
| Изображения | ✅ |
| Сохранение в URL | ✅ |
`;

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [filename, setFilename] = useState('документ.md')
  const [showPreview, setShowPreview] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Инициализация из URL при загрузке
  useEffect(() => {
    const contentParam = searchParams.get('content')
    if (contentParam) {
      try {
        const decodedContent = decodeContent(contentParam)
        if (decodedContent) {
          setMarkdown(decodedContent)
          showNotificationMessage('Документ загружен из URL')
        }
      } catch (error) {
        console.error('Ошибка при декодировании контента из URL:', error)
        showNotificationMessage('Ошибка при загрузке документа из URL')
      }
    }
  }, [searchParams])

  // Обновление URL при изменении контента (с debounce)
  useEffect(() => {
    const updateUrl = setTimeout(() => {
      if (markdown && markdown !== defaultMarkdown) {
        const encodedContent = encodeContent(markdown)
        const newUrl = `/?content=${encodedContent}${filename !== 'документ.md' ? `&filename=${encodeURIComponent(filename)}` : ''}`
        router.replace(newUrl, { scroll: false })
      }
    }, 1000)

    return () => clearTimeout(updateUrl)
  }, [markdown, filename, router])

  // Обновление URL при изменении имени файла
  useEffect(() => {
    if (filename && filename !== 'документ.md') {
      const encodedContent = encodeContent(markdown)
      const newUrl = `/?content=${encodedContent}&filename=${encodeURIComponent(filename)}`
      router.replace(newUrl, { scroll: false })
    }
  }, [filename, markdown, router])

  // Подсчет статистики
  useEffect(() => {
    const words = markdown.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
    setCharCount(markdown.length)
  }, [markdown])

  // Функция для показа уведомлений
  const showNotificationMessage = useCallback((message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }, [])

  // Функция для генерации shareable URL
  const generateShareUrl = useCallback(() => {
    const encodedContent = encodeContent(markdown)
    const url = new URL(window.location.href)
    url.searchParams.set('content', encodedContent)
    if (filename !== 'документ.md') {
      url.searchParams.set('filename', filename)
    }
    return url.toString()
  }, [markdown, filename])

  // Копирование URL в буфер обмена
  const copyShareUrl = useCallback(async () => {
    const url = generateShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      showNotificationMessage('Ссылка скопирована в буфер обмена')
    } catch (err) {
      showNotificationMessage('Не удалось скопировать ссылку')
      console.error('Ошибка при копировании:', err)
    }
  }, [generateShareUrl, showNotificationMessage])

  // Поделиться документом
  const handleShare = useCallback(() => {
    const url = generateShareUrl()
    setShareUrl(url)
    setIsSharing(true)
  }, [generateShareUrl])

  // Создание новой пустой страницы
  const handleNewDocument = useCallback(() => {
    setMarkdown('')
    setFilename('новый-документ.md')
    router.replace('/', { scroll: false })
    showNotificationMessage('Создан новый документ')
  }, [router, showNotificationMessage])

  // Обработчики форматирования
  const formatText = (prefix: string, suffix: string = '', wrap: boolean = false) => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = markdown.substring(start, end)
    
    let newText
    if (wrap && selectedText) {
      newText = markdown.substring(0, start) + prefix + selectedText + suffix + markdown.substring(end)
    } else {
      newText = markdown.substring(0, start) + prefix + suffix + markdown.substring(end)
    }
    
    setMarkdown(newText)
    setTimeout(() => {
      textarea.focus()
      if (wrap && selectedText) {
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
      } else {
        const cursorPos = start + prefix.length
        textarea.setSelectionRange(cursorPos, cursorPos)
      }
    }, 0)
  }

  // Сохранение файла
  const saveFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotificationMessage('Файл сохранен')
  }

  // Загрузка файла
  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setMarkdown(content)
      setFilename(file.name)
      showNotificationMessage(`Файл "${file.name}" загружен`)
    }
    reader.readAsText(file)
  }

  // Панель инструментов
  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void, 
    icon: React.ElementType, 
    title: string 
  }) => (
    <button
      onClick={onClick}
      className="p-2 rounded-md hover:bg-gray-100 transition-colors"
      title={title}
    >
      <Icon size={20} className="text-gray-600" />
    </button>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Уведомления */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <span>{notificationMessage}</span>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-4"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно для шаринга */}
      {isSharing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Поделиться документом</h3>
              <button
                onClick={() => setIsSharing(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Скопируйте ссылку ниже, чтобы поделиться этим документом:
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
              <button
                onClick={copyShareUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Copy size={16} />
                Копировать
              </button>
            </div>
            <div className="text-xs text-gray-500">
              <p>Ссылка содержит весь контент документа в закодированном виде.</p>
              <p className="mt-1">⚠️ Для больших документов URL может быть очень длинным.</p>
            </div>
          </div>
        </div>
      )}

      {/* Заголовок и управление */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Редактор Markdown</h1>
            <p className="text-gray-600">Редактируйте и просматривайте Markdown в реальном времени</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Автосохранение в URL
              </span>
              {searchParams.has('content') && (
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  Загружено из ссылки
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Загрузить
              <input
                type="file"
                accept=".md,.markdown,.txt"
                onChange={loadFile}
                className="hidden"
              />
            </label>
            <button
              onClick={handleNewDocument}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Новый
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 size={20} />
              Поделиться
            </button>
            <button
              onClick={saveFile}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              Сохранить
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              {showPreview ? 'Скрыть' : 'Показать'}
            </button>
          </div>
        </div>

        {/* Статистика и информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Type size={20} className="text-gray-500" />
              <span className="text-sm text-gray-500">Символов</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{charCount.toLocaleString()}</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Bold size={20} className="text-gray-500" />
              <span className="text-sm text-gray-500">Слов</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{wordCount.toLocaleString()}</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-sm text-gray-500">Строк</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{markdown.split('\n').length}</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя файла
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="введите имя файла"
              />
              <button
                onClick={() => {
                  if (filename && filename !== 'документ.md') {
                    const encodedContent = encodeContent(markdown)
                    const newUrl = `/?content=${encodedContent}&filename=${encodeURIComponent(filename)}`
                    window.history.replaceState(null, '', newUrl)
                    showNotificationMessage('Имя файла обновлено в URL')
                  }
                }}
                className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors text-sm"
              >
                Обновить
              </button>
            </div>
          </div>
        </div>

        {/* Информация о сохранении в URL */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Share2 size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">Сохранение в URL</h4>
              <p className="text-sm text-blue-800">
                Ваш документ автоматически сохраняется в URL. Вы можете поделиться ссылкой или сохранить её в закладках. 
                При открытии ссылки документ будет автоматически восстановлен.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    copyShareUrl()
                    setIsSharing(false)
                  }}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Скопировать текущую ссылку
                </button>
                <button
                  onClick={() => {
                    router.replace('/', { scroll: false })
                    showNotificationMessage('URL очищен')
                  }}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Очистить URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Панель инструментов */}
      <div className="mb-4 p-3 bg-white border rounded-lg flex flex-wrap gap-1">
        <ToolbarButton
          onClick={() => formatText('# ', '', false)}
          icon={Heading}
          title="Заголовок 1"
        />
        <ToolbarButton
          onClick={() => formatText('## ', '', false)}
          icon={Heading}
          title="Заголовок 2"
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton
          onClick={() => formatText('**', '**', true)}
          icon={Bold}
          title="Жирный текст"
        />
        <ToolbarButton
          onClick={() => formatText('*', '*', true)}
          icon={Italic}
          title="Курсив"
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton
          onClick={() => formatText('- ', '', false)}
          icon={List}
          title="Маркированный список"
        />
        <ToolbarButton
          onClick={() => formatText('1. ', '', false)}
          icon={List}
          title="Нумерованный список"
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton
          onClick={() => formatText('[', '](https://)', true)}
          icon={Link}
          title="Ссылка"
        />
        <ToolbarButton
          onClick={() => formatText('![', '](https://)', true)}
          icon={Image}
          title="Изображение"
        />
        <ToolbarButton
          onClick={() => formatText('`', '`', true)}
          icon={Code}
          title="Встроенный код"
        />
        <ToolbarButton
          onClick={() => formatText('```\n', '\n```', true)}
          icon={Code}
          title="Блок кода"
        />
      </div>

      {/* Основной контейнер редактора */}
      <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Редактор */}
        <div className="flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-700">Редактирование</h2>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">.md</span>
            </div>
            <div className="text-sm text-gray-500">
              {searchParams.has('content') && (
                <span className="flex items-center gap-1 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Сохранено в URL
                </span>
              )}
            </div>
          </div>
          <textarea
            id="markdown-editor"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Начните писать Markdown здесь..."
            spellCheck="false"
          />
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>Изменения автоматически сохраняются в URL</span>
            <span>Ctrl+S для сохранения файла</span>
          </div>
        </div>

        {/* Предпросмотр */}
        {showPreview && (
          <div className="flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-700">Предпросмотр</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">.html</span>
              </div>
              <div className="text-sm text-gray-500">
                Режим реального времени
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 border border-gray-300 rounded-lg bg-white prose prose-lg max-w-none scroll-smooth">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              GitHub Flavored Markdown • Автообновление при изменении
            </div>
          </div>
        )}
      </div>

      {/* Быстрые подсказки */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Сохранение в URL</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${searchParams.has('content') ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium">
              {searchParams.has('content') ? 'Документ сохранён' : 'Не сохранено'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Share2 size={16} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-800">Поделиться</h4>
            </div>
            <p className="text-sm text-gray-600">
              Просто скопируйте ссылку из адресной строки, чтобы поделиться документом
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Save size={16} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-800">Автосохранение</h4>
            </div>
            <p className="text-sm text-gray-600">
              Изменения автоматически сохраняются в URL каждую секунду
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="font-medium text-blue-800">Восстановление</h4>
            </div>
            <p className="text-sm text-gray-600">
              При открытии сохранённой ссылки документ автоматически восстанавливается
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-blue-800">
                <strong>Важно:</strong> Из-за ограничений длины URL в браузерах, очень большие документы 
                могут не полностью сохраниться в ссылке. Для больших документов рекомендуется использовать 
                функцию "Сохранить" для скачивания файла.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={handleShare}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Сгенерировать ссылку
                </button>
                <button
                  onClick={() => {
                    const urlLength = window.location.href.length
                    showNotificationMessage(`Длина текущего URL: ${urlLength} символов`)
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  Проверить длину URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}