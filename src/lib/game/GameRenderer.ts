import type { PlantEntity, ZombieEntity, SunEntity, PeaEntity } from '../types'
import {
  GRID_ROWS,
  GRID_COLS,
  CELL_WIDTH,
  CELL_HEIGHT,
  CANVAS_OFFSET_X,
  CANVAS_OFFSET_Y,
} from '../constants'

const COLORS = {
  lawn: '#22c55e',
  lawnDark: '#16a34a',
  sun: '#fbbf24',
  pea: '#84cc16',
  plant: '#22c55e',
  zombie: '#6b7280',
  zombieCone: '#94a3b8',
  zombieBucket: '#64748b',
  zombiePole: '#78716c',
  grid: 'rgba(0,0,0,0.1)',
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  plants: PlantEntity[],
  zombies: ZombieEntity[],
  suns: SunEntity[],
  peas: PeaEntity[]
) {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)

  // 绘制草地网格
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const x = CANVAS_OFFSET_X + col * CELL_WIDTH
      const y = CANVAS_OFFSET_Y + row * CELL_HEIGHT
      ctx.fillStyle = (row + col) % 2 === 0 ? COLORS.lawn : COLORS.lawnDark
      ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT)
      ctx.strokeStyle = COLORS.grid
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, CELL_WIDTH, CELL_HEIGHT)
    }
  }

  // 绘制植物
  for (const plant of plants) {
    drawPlant(ctx, plant)
  }

  // 绘制豌豆
  for (const pea of peas) {
    ctx.fillStyle = COLORS.pea
    ctx.beginPath()
    ctx.arc(pea.x + pea.width / 2, pea.y + pea.height / 2, 8, 0, Math.PI * 2)
    ctx.fill()
  }

  // 绘制僵尸
  for (const zombie of zombies) {
    drawZombie(ctx, zombie)
  }

  // 绘制阳光
  for (const sun of suns) {
    if (!sun.collected) {
      drawSun(ctx, sun)
    }
  }
}

function drawPlant(ctx: CanvasRenderingContext2D, plant: PlantEntity) {
  const cx = plant.x + plant.width / 2
  const cy = plant.y + plant.height / 2

  switch (plant.type) {
    case 'sunflower':
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(cx, cy - 10, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(cx, cy - 10, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(cx - 8, cy, 16, 40)
      break
    case 'peashooter':
    case 'repeater':
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(cx - 15, cy - 20, 30, 50)
      ctx.fillStyle = '#15803d'
      ctx.beginPath()
      ctx.arc(cx, cy - 25, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#84cc16'
      ctx.beginPath()
      ctx.arc(cx + 5, cy - 25, 8, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'wallnut':
      ctx.fillStyle = '#a16207'
      ctx.beginPath()
      ctx.ellipse(cx, cy, 35, 40, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#713f12'
      ctx.lineWidth = 2
      ctx.stroke()
      break
    case 'cherrybomb':
      ctx.fillStyle = '#dc2626'
      ctx.beginPath()
      ctx.arc(cx - 12, cy - 10, 18, 0, Math.PI * 2)
      ctx.arc(cx + 12, cy - 10, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(cx - 4, cy + 5, 8, 25)
      break
    default:
      ctx.fillStyle = COLORS.plant
      ctx.fillRect(plant.x, plant.y, plant.width, plant.height)
  }

  // 血条
  if (plant.hp < plant.maxHp) {
    const barW = plant.width
    const barH = 4
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(plant.x, plant.y - 8, barW, barH)
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(plant.x, plant.y - 8, barW * (plant.hp / plant.maxHp), barH)
  }
}

function drawZombie(ctx: CanvasRenderingContext2D, zombie: ZombieEntity) {
  const cx = zombie.x + zombie.width / 2

  ctx.fillStyle = COLORS.zombie
  ctx.fillRect(zombie.x, zombie.y + 20, zombie.width, 50)

  ctx.fillStyle = '#fef3c7'
  ctx.beginPath()
  ctx.arc(cx, zombie.y + 25, 15, 0, Math.PI * 2)
  ctx.fill()

  switch (zombie.type) {
    case 'cone':
      ctx.fillStyle = COLORS.zombieCone
      ctx.beginPath()
      ctx.moveTo(cx - 20, zombie.y + 5)
      ctx.lineTo(cx, zombie.y - 15)
      ctx.lineTo(cx + 20, zombie.y + 5)
      ctx.closePath()
      ctx.fill()
      break
    case 'bucket':
      ctx.fillStyle = COLORS.zombieBucket
      ctx.fillRect(cx - 22, zombie.y - 5, 44, 25)
      ctx.fillRect(cx - 18, zombie.y - 15, 36, 15)
      break
    case 'pole':
      ctx.strokeStyle = '#78716c'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(cx + 25, zombie.y + 30)
      ctx.lineTo(cx + 45, zombie.y - 10)
      ctx.stroke()
      break
  }

  if (zombie.hp < zombie.maxHp) {
    const barW = zombie.width
    const barH = 4
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(zombie.x, zombie.y - 5, barW, barH)
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(zombie.x, zombie.y - 5, barW * (zombie.hp / zombie.maxHp), barH)
  }
}

function drawSun(ctx: CanvasRenderingContext2D, sun: SunEntity) {
  const cx = sun.x + sun.width / 2
  const cy = sun.y + sun.height / 2
  const pulse = Math.sin(Date.now() / 200) * 3 + 1

  ctx.fillStyle = COLORS.sun
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + Date.now() / 500
    const r = 15 * pulse
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#f59e0b'
  ctx.beginPath()
  ctx.arc(cx, cy, 10, 0, Math.PI * 2)
  ctx.fill()
}
