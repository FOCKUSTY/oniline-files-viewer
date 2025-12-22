import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MD Editor - Редактор Markdown',
  description: 'Онлайн редактор Markdown с реальным предпросмотром',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-gray-50`}>
        <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-md bg-blue-600"></div>
                <h1 className="text-xl font-bold text-gray-900">MD Editor</h1>
              </div>
              <nav className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">Главная</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Документация</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Экспорт</a>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t bg-white py-6">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} MD Editor. Онлайн редактор Markdown.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}