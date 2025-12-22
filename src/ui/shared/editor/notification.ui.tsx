'use client'

import { FiX } from 'react-icons/fi'

interface NotificationProps {
  message: string
  onClose: () => void
}

export default function Notification({ message, onClose }: NotificationProps) {
  return (
    <div className="fixed top-20 right-4 z-50 animate-fade-in">
      <div className="bg-green-400/10 border border-green-400/20 text-green-400 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  )
}