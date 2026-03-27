import React, { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onDismiss: () => void
  duration?: number
}

const typeStyles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onDismiss,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  return (
    <div
      data-testid="toast"
      className={`${typeStyles[type]} text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 flex items-center gap-2 animate-fade-in`}
    >
      <span className="flex-1 text-sm font-medium">{message}</span>
    </div>
  )
}

export default Toast
