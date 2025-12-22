'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface PreviewPanelProps {
  markdown: string
}

export default function PreviewPanel({ markdown }: PreviewPanelProps) {
  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Предпросмотр</h2>
          <span className="px-2 py-1 bg-blue-400/10 text-blue-400 text-xs rounded border border-blue-400/20">.html</span>
        </div>
        <div className="text-mini">
          Режим реального времени
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 border border-mini rounded-lg bg-card prose prose-lg max-w-none scroll-smooth prose-invert">
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
                <code className="bg-smooth px-1 py-0.5 rounded" {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
      <div className="mt-2 text-mini">
        GitHub Flavored Markdown • Автообновление при изменении
      </div>
    </div>
  )
}