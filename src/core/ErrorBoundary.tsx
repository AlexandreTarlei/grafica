import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type Props = { children: ReactNode }

type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info)
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
          <p className="text-muted-foreground max-w-md text-center text-sm">
            Algo saiu do esperado. Você pode tentar novamente.
          </p>
          <Button type="button" onClick={() => this.setState({ error: null })}>
            Tentar novamente
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
