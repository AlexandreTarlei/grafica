import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ThemeMode } from '@/contexts/ThemeContext'
import { useTheme } from '@/hooks/useTheme'

const themeSequence: ThemeMode[] = ['light', 'dark', 'system']

type ThemeToggleProps = {
  className?: string
  size?: 'icon' | 'icon-sm'
}

export function ThemeToggle({ className, size = 'icon' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const cycleTheme = () => {
    const idx = themeSequence.indexOf(theme)
    setTheme(themeSequence[(idx + 1) % themeSequence.length])
  }

  const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun
  const label =
    theme === 'system' ? 'Tema: sistema' : theme === 'dark' ? 'Tema: escuro' : 'Tema: claro'

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      className={className}
      onClick={cycleTheme}
      aria-label={label}
      title={label}
    >
      <ThemeIcon className="size-4" />
    </Button>
  )
}
