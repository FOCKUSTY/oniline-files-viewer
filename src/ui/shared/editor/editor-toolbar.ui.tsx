'use client'

import { 
  FiBold, 
  FiItalic, 
  FiList, 
  FiLink, 
  FiImage, 
  FiCode,
  FiHash
} from 'react-icons/fi'

interface EditorToolbarProps {
  markdown: string
  onFormat: (newMarkdown: string) => void
}

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
    className="p-2 rounded-md hover:bg-component transition-colors"
    title={title}
  >
    <Icon size={20} className="text-mini" />
  </button>
)

export default function EditorToolbar({ markdown, onFormat }: EditorToolbarProps) {
  const formatText = (prefix: string, suffix: string = '', wrap: boolean = false) => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = markdown.substring(start, end)
    
    let newText
    if (wrap && selectedText) {
      newText = markdown.substring(0, start) + prefix + selectedText + suffix + markdown.substring(end)
    } else {
      newText = markdown.substring(0, start) + prefix + suffix + markdown.substring(end)
    }
    
    onFormat(newText)
    
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

  return (
    <div className="mb-4 p-3 bg-card border border-mini rounded-lg flex flex-wrap gap-1">
      <ToolbarButton
        onClick={() => formatText('# ', '', false)}
        icon={FiHash}
        title="Заголовок 1"
      />
      <ToolbarButton
        onClick={() => formatText('## ', '', false)}
        icon={FiHash}
        title="Заголовок 2"
      />
      <div className="w-px h-6 bg-mini mx-1"></div>
      <ToolbarButton
        onClick={() => formatText('**', '**', true)}
        icon={FiBold}
        title="Жирный текст"
      />
      <ToolbarButton
        onClick={() => formatText('*', '*', true)}
        icon={FiItalic}
        title="Курсив"
      />
      <div className="w-px h-6 bg-mini mx-1"></div>
      <ToolbarButton
        onClick={() => formatText('- ', '', false)}
        icon={FiList}
        title="Маркированный список"
      />
      <ToolbarButton
        onClick={() => formatText('1. ', '', false)}
        icon={FiList}
        title="Нумерованный список"
      />
      <div className="w-px h-6 bg-mini mx-1"></div>
      <ToolbarButton
        onClick={() => formatText('[', '](https://)', true)}
        icon={FiLink}
        title="Ссылка"
      />
      <ToolbarButton
        onClick={() => formatText('![', '](https://)', true)}
        icon={FiImage}
        title="Изображение"
      />
      <ToolbarButton
        onClick={() => formatText('`', '`', true)}
        icon={FiCode}
        title="Встроенный код"
      />
      <ToolbarButton
        onClick={() => formatText('```\n', '\n```', true)}
        icon={FiCode}
        title="Блок кода"
      />
    </div>
  )
}