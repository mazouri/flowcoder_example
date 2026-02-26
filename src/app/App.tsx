import { useMemo, useState, useCallback, useEffect } from 'react'
import { GameEngine } from '@/lib/game/GameEngine'
import { GameCanvas } from '@/components/GameCanvas'
import { SeedBank } from '@/components/SeedBank'
import { StatusBar } from '@/components/StatusBar'
import { GameOverlay } from '@/components/GameOverlay'
import type { PlantType } from '@/lib/types'

export default function App() {
  const engine = useMemo(() => new GameEngine(), [])
  const [sun, setSun] = useState(engine.getSun())
  const [state, setState] = useState(engine.getState())
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null)
  const [cooldowns, setCooldowns] = useState<Record<PlantType, number>>({} as Record<PlantType, number>)

  const updateCooldowns = useCallback(() => {
    const types: PlantType[] = ['sunflower', 'peashooter', 'wallnut', 'cherrybomb', 'repeater']
    const next: Record<PlantType, number> = {} as Record<PlantType, number>
    for (const t of types) {
      next[t] = engine.getPlantCooldown(t)
    }
    setCooldowns(next)
  }, [engine])

  useEffect(() => {
    const unsub = engine.subscribe((e) => {
      if (e.type === 'sunChange') setSun(e.sun)
      if (e.type === 'stateChange') setState(e.state)
    })
    return unsub
  }, [engine])

  useEffect(() => {
    const interval = setInterval(updateCooldowns, 100)
    return () => clearInterval(interval)
  }, [updateCooldowns])

  const handleStart = useCallback(() => {
    engine.start()
  }, [engine])

  const handlePause = useCallback(() => {
    engine.togglePause()
  }, [engine])

  const handleRestart = useCallback(() => {
    engine.start()
    setSelectedPlant(null)
  }, [engine])

  const handleSelectPlant = useCallback(
    (type: PlantType | null) => {
      engine.selectPlant(type)
      setSelectedPlant(type)
    },
    [engine]
  )

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">植物大战僵尸</h1>
        <p className="mt-1 text-gray-600">Web 版塔防原型 · 点击开始游戏</p>
      </header>

      <StatusBar
        sun={sun}
        state={state}
        onStart={handleStart}
        onPause={handlePause}
        onRestart={handleRestart}
      />

      <SeedBank
        sun={sun}
        selectedPlant={selectedPlant}
        cooldowns={cooldowns}
        onSelectPlant={handleSelectPlant}
        disabled={state !== 'playing' && state !== 'paused'}
      />

      <div className="relative">
        <GameCanvas engine={engine} gameState={state} />
        <GameOverlay state={state} onRestart={handleRestart} />
      </div>

      <aside className="w-full max-w-2xl rounded-xl bg-white/80 p-4 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800">操作说明</h2>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>· 点击「开始游戏」启动</li>
          <li>· 选择植物后点击草地格子放置</li>
          <li>· 点击掉落的阳光收集</li>
          <li>· 向日葵产生阳光，豌豆射手攻击僵尸</li>
          <li>· 坚果墙阻挡，樱桃炸弹范围清除</li>
        </ul>
      </aside>
    </div>
  )
}
