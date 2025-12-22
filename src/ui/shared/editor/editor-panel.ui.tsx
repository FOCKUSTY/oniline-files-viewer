'use client'

interface EditorPanelProps {
  markdown: string
  onMarkdownChange: (value: string) => void
  hasContent: boolean
}

export default function EditorPanel({ markdown, onMarkdownChange, hasContent }: EditorPanelProps) {
  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Редактирование</h2>
          <span className="px-2 py-1 bg-card text-mini text-xs rounded border border-mini">.md</span>
        </div>
        <div className="text-mini">
          {hasContent && (
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
        onChange={(e) => onMarkdownChange(e.target.value)}
        className="flex-1 w-full p-4 border border-mini rounded-lg font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-card"
        placeholder="Начните писать Markdown здесь..."
        spellCheck="false"
      />
      <div className="mt-2 text-mini flex justify-between">
        <span>Изменения автоматически сохраняются в URL</span>
        <span>Ctrl+S для сохранения файла</span>
      </div>
    </div>
  )
}