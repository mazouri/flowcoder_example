import { RotateCcw } from 'lucide-react'
import type { GameState } from '@/lib/types'

interface GameOverlayProps {
  state: GameState
  onRestart?: () => void
}

export function GameOverlay({ state, onRestart }: GameOverlayProps) {
  if (state !== 'won' && state !== 'lost') return null

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      <div className="mx-4 max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <h2
          id="game-over-title"
          className={`text-2xl font-bold ${state === 'won' ? 'text-green-600' : 'text-red-600'}`}
        >
          {state === 'won' ? '恭喜胜利！' : '游戏结束'}
        </h2>
        <p className="mt-2 text-gray-600">
          {state === 'won' ? '你成功抵御了僵尸的进攻！' : '僵尸吃掉了你的脑子…'}
        </p>
        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="mt-6 flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-medium text-white transition-colors duration-150 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="再来一局"
          >
            <RotateCcw className="h-5 w-5" aria-hidden />
            再来一局
          </button>
        )}
      </div>
    </div>
  )
}
