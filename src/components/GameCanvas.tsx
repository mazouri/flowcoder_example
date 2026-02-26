import { useRef, useEffect, useCallback } from 'react'
import { GameEngine } from '@/lib/game/GameEngine'
import { renderGame } from '@/lib/game/GameRenderer'
import { CANVAS_OFFSET_X, CANVAS_OFFSET_Y, GRID_COLS, GRID_ROWS, CELL_WIDTH, CELL_HEIGHT } from '@/lib/constants'
import type { GameState } from '@/lib/types'

interface GameCanvasProps {
  engine: GameEngine
  gameState: GameState
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

const CANVAS_WIDTH = CANVAS_OFFSET_X + GRID_COLS * CELL_WIDTH + 80
const CANVAS_HEIGHT = CANVAS_OFFSET_Y + GRID_ROWS * CELL_HEIGHT + 40

export function GameCanvas({ engine, gameState, onCanvasReady }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      const sun = engine.getSunAt(x, y)
      if (sun) {
        engine.collectSun(sun.id)
        return
      }

      const pos = engine.getGridPosFromPoint(x, y)
      if (pos) {
        engine.placePlant(pos)
      }
    },
    [engine]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    onCanvasReady?.(canvas)

    let lastTime = performance.now()

    const tick = () => {
      const now = performance.now()
      const delta = now - lastTime
      lastTime = now

      engine.update(delta)

      const ctx = canvas.getContext('2d')
      if (ctx) {
        renderGame(
          ctx,
          engine.getPlants(),
          engine.getZombies(),
          engine.getSuns(),
          engine.getPeas()
        )
      }
    }

    if (gameState === 'paused') {
      tick()
      intervalRef.current = setInterval(tick, 250)
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }

    const loop = () => {
      tick()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [engine, onCanvasReady, gameState])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleClick}
      className="cursor-pointer rounded-lg border-2 border-lawn-400 shadow-lg transition-shadow duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      style={{ maxWidth: '100%', height: 'auto' }}
      aria-label="游戏主画布，点击格子放置植物，点击阳光收集"
      tabIndex={0}
    />
  )
}
