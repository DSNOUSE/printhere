import Link from 'next/link'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'magenta'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal/50'

  const variants = {
    primary: 'bg-teal text-white hover:bg-teal-light active:bg-teal-dark',
    outline: 'border-2 border-teal text-teal hover:bg-teal hover:text-white',
    ghost: 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm border border-border',
    magenta: 'bg-magenta text-white hover:bg-magenta/90 active:bg-magenta-dark',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
