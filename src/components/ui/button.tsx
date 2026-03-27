import React from 'react'

type ButtonVariant = 'default' | 'ghost' | 'outline'
type ButtonSize = 'default' | 'icon'

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'default',
  size = 'default',
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none'

  const variantClass =
    variant === 'default'
      ? 'bg-indigo-500 text-white hover:bg-indigo-600'
      : variant === 'outline'
        ? 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
        : 'bg-transparent hover:bg-gray-50 text-gray-800'

  const sizeClass =
    size === 'icon' ? 'h-9 w-9 p-0' : 'px-4 py-2'

  return (
    <button
      className={cn(base, variantClass, sizeClass, className)}
      {...props}
    />
  )
}

