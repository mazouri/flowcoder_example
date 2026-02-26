import { Sun, Play, Pause, RotateCcw } from 'lucide-react'
import type { GameState } from '@/lib/types'

interface StatusBarProps {
  sun: number
  state: GameState
  onStart: () => void
  onPause: () => void
  onRestart: () => void
}

export function StatusBar({ sun, state, onStart, onPause, onRestart }: StatusBarProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl bg-lawn-400/90 px-6 py-3 shadow-md"
      role="status"
      aria-live="polite"
      aria-label={`当前阳光：${sun}。游戏状态：${state === 'playing' ? '进行中' : state === 'paused' ? '已暂停' : state === 'won' ? '胜利' : state === 'lost' ? '失败' : '未开始'}`}
    >
      <div className="flex items-center gap-2">
        <Sun className="h-8 w-8 text-primary-500" aria-hidden />
        <span className="text-2xl font-bold text-gray-800 tabular-nums">{sun}</span>
        <span className="text-sm text-gray-600">阳光</span>
      </div>

      <div className="flex items-center gap-2">
        {state === 'idle' && (
          <button
            type="button"
            onClick={onStart}
            className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="开始游戏"
          >
            <Play className="h-5 w-5" aria-hidden />
            开始游戏
          </button>
        )}

        {(state === 'playing' || state === 'paused') && (
          <>
            <button
              type="button"
              onClick={onPause}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-white/90 p-2 transition-colors duration-150 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={state === 'playing' ? '暂停游戏' : '继续游戏'}
            >
              {state === 'playing' ? (
                <Pause className="h-6 w-6 text-gray-700" aria-hidden />
              ) : (
                <Play className="h-6 w-6 text-gray-700" aria-hidden />
              )}
            </button>
          </>
        )}

        {(state === 'won' || state === 'lost') && (
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 font-medium text-white transition-colors duration-150 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="重新开始"
          >
            <RotateCcw className="h-5 w-5" aria-hidden />
            再来一局
          </button>
        )}
      </div>
    </div>
  )
}
