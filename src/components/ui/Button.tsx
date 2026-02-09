import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  href?: string
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  asChild = false,
  href,
  ...props
}: ButtonProps) {
  if (asChild && href) {
    return (
      <a
        href={href}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'h-9 px-4 py-2 text-sm': size === 'sm',
            'h-10 px-6 py-2': size === 'md',
            'h-11 px-8 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    )
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          'h-9 px-4 py-2 text-sm': size === 'sm',
          'h-10 px-6 py-2': size === 'md',
          'h-11 px-8 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}
