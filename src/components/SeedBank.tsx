import { Sun, CircleDot, Shield, Bomb, Repeat } from 'lucide-react'
import type { PlantType } from '@/lib/types'
import { PLANTS } from '@/lib/constants'

const ICONS: Record<PlantType, React.ReactNode> = {
  sunflower: <Sun className="h-6 w-6" aria-hidden />,
  peashooter: <CircleDot className="h-6 w-6" aria-hidden />,
  wallnut: <Shield className="h-6 w-6" aria-hidden />,
  cherrybomb: <Bomb className="h-6 w-6" aria-hidden />,
  repeater: <Repeat className="h-6 w-6" aria-hidden />,
}

interface SeedBankProps {
  sun: number
  selectedPlant: PlantType | null
  cooldowns: Record<PlantType, number>
  onSelectPlant: (type: PlantType | null) => void
  disabled?: boolean
}

export function SeedBank({
  sun,
  selectedPlant,
  cooldowns,
  onSelectPlant,
  disabled = false,
}: SeedBankProps) {
  const plantTypes: PlantType[] = ['sunflower', 'peashooter', 'wallnut', 'cherrybomb', 'repeater']

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-lawn-400/80 p-4 shadow-md"
      role="toolbar"
      aria-label="植物选择栏"
    >
      {plantTypes.map((type) => {
        const config = PLANTS[type]
        const canAfford = sun >= config.cost
        const cooldown = cooldowns[type] ?? 0
        const isOnCooldown = cooldown > 0
        const isDisabled = disabled || !canAfford || isOnCooldown
        const isSelected = selectedPlant === type

        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelectPlant(isSelected ? null : type)}
            disabled={isDisabled}
            className={`
              relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg border-2 px-4 py-2
              transition-all duration-150
              ${isSelected ? 'border-primary-500 bg-primary-100 ring-2 ring-primary-500' : 'border-lawn-600 bg-white/90'}
              ${!isDisabled ? 'cursor-pointer hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500' : 'cursor-not-allowed opacity-60'}
            `}
            aria-pressed={isSelected}
            aria-label={`${config.name}，消耗 ${config.cost} 阳光${isOnCooldown ? `，冷却中 ${Math.ceil(cooldown / 1000)} 秒` : ''}`}
          >
            <span className="text-lawn-600">{ICONS[type]}</span>
            <span className="text-xs font-medium text-gray-700">{config.cost}</span>
            {isOnCooldown && (
              <span
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 text-xs font-bold text-white"
                style={{ fontSize: '10px' }}
              >
                {Math.ceil(cooldown / 1000)}s
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
