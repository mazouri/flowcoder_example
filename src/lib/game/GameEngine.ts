import type {
  GameState,
  GridPos,
  PlantType,
  ZombieType,
  PlantEntity,
  ZombieEntity,
  SunEntity,
  PeaEntity,
} from '../types'
import {
  GRID_ROWS,
  GRID_COLS,
  CELL_WIDTH,
  CELL_HEIGHT,
  CANVAS_OFFSET_X,
  CANVAS_OFFSET_Y,
  INITIAL_SUN,
  SUN_SPAWN_INTERVAL,
  SUNFLOWER_PRODUCE_INTERVAL,
  ZOMBIE_SPAWN_INTERVAL,
  ZOMBIE_SPAWN_DELAY,
  PLANTS,
  ZOMBIES,
} from '../constants'

let entityId = 0
const genId = () => `e${++entityId}`

export type GameEvent =
  | { type: 'stateChange'; state: GameState }
  | { type: 'sunChange'; sun: number }
  | { type: 'plantPlaced'; pos: GridPos; plant: PlantEntity }
  | { type: 'zombieSpawned'; zombie: ZombieEntity }
  | { type: 'gameOver'; won: boolean }

export type GameEventListener = (e: GameEvent) => void

export class GameEngine {
  private state: GameState = 'idle'
  private sun = INITIAL_SUN
  private plants: PlantEntity[] = []
  private zombies: ZombieEntity[] = []
  private suns: SunEntity[] = []
  private peas: PeaEntity[] = []
  private lastSunSpawn = 0
  private lastZombieSpawn = 0
  private gameStartTime = 0
  private selectedPlant: PlantType | null = null
  private plantCooldowns: Record<PlantType, number> = {} as Record<PlantType, number>
  private sunflowerLastSun: Record<string, number> = {}
  private listeners: GameEventListener[] = []

  /** 获取当前状态 */
  getState(): GameState {
    return this.state
  }

  /** 获取阳光数 */
  getSun(): number {
    return this.sun
  }

  /** 获取所有植物 */
  getPlants(): PlantEntity[] {
    return [...this.plants]
  }

  /** 获取所有僵尸 */
  getZombies(): ZombieEntity[] {
    return [...this.zombies]
  }

  /** 获取所有阳光 */
  getSuns(): SunEntity[] {
    return this.suns.filter((s) => !s.collected)
  }

  /** 获取所有豌豆 */
  getPeas(): PeaEntity[] {
    return [...this.peas]
  }

  /** 获取选中植物 */
  getSelectedPlant(): PlantType | null {
    return this.selectedPlant
  }

  /** 获取植物冷却 */
  getPlantCooldown(type: PlantType): number {
    return this.plantCooldowns[type] ?? 0
  }

  /** 获取格子上的植物 */
  getPlantAt(pos: GridPos): PlantEntity | undefined {
    return this.plants.find(
      (p) =>
        Math.floor((p.x - CANVAS_OFFSET_X) / CELL_WIDTH) === pos.col &&
        Math.floor((p.y - CANVAS_OFFSET_Y) / CELL_HEIGHT) === pos.row
    )
  }

  /** 订阅事件 */
  subscribe(listener: GameEventListener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private emit(event: GameEvent) {
    this.listeners.forEach((l) => l(event))
  }

  /** 开始游戏 */
  start() {
    if (this.state !== 'idle' && this.state !== 'lost' && this.state !== 'won') return
    this.state = 'playing'
    this.sun = INITIAL_SUN
    this.plants = []
    this.zombies = []
    this.suns = []
    this.peas = []
    this.lastSunSpawn = 0
    this.lastZombieSpawn = 0
    this.gameStartTime = Date.now()
    this.plantCooldowns = {} as Record<PlantType, number>
    this.sunflowerLastSun = {}
    this.emit({ type: 'stateChange', state: 'playing' })
    this.emit({ type: 'sunChange', sun: this.sun })
  }

  /** 暂停/继续 */
  togglePause() {
    if (this.state !== 'playing' && this.state !== 'paused') return
    this.state = this.state === 'playing' ? 'paused' : 'playing'
    this.emit({ type: 'stateChange', state: this.state })
  }

  /** 选择植物 */
  selectPlant(type: PlantType | null) {
    this.selectedPlant = type
  }

  /** 在格子放置植物 */
  placePlant(pos: GridPos): boolean {
    if (this.state !== 'playing' || !this.selectedPlant) return false
    const config = PLANTS[this.selectedPlant]
    if (!config || this.sun < config.cost) return false
    if (this.getPlantAt(pos)) return false

    const cooldown = this.plantCooldowns[this.selectedPlant] ?? 0
    if (cooldown > 0) return false

    const x = CANVAS_OFFSET_X + pos.col * CELL_WIDTH + CELL_WIDTH / 2
    const y = CANVAS_OFFSET_Y + pos.row * CELL_HEIGHT + CELL_HEIGHT / 2

    const plant: PlantEntity = {
      id: genId(),
      type: this.selectedPlant,
      x: x - 40,
      y: y - 50,
      width: 80,
      height: 100,
      hp: config.hp,
      maxHp: config.hp,
      lastAttackTime: 0,
    }

    this.plants.push(plant)
    this.sun -= config.cost
    this.plantCooldowns[this.selectedPlant] = config.cooldown
    this.selectedPlant = null

    if (config.id === 'cherrybomb') {
      setTimeout(() => this.explodeCherryBomb(plant), 1500)
    }

    this.emit({ type: 'plantPlaced', pos, plant })
    this.emit({ type: 'sunChange', sun: this.sun })
    return true
  }

  /** 樱桃炸弹爆炸 */
  private explodeCherryBomb(plant: PlantEntity) {
    const idx = this.plants.indexOf(plant)
    if (idx === -1) return

    const cx = plant.x + plant.width / 2
    const cy = plant.y + plant.height / 2
    const radius = 150

    this.zombies = this.zombies.filter((z) => {
      const dx = (z.x + z.width / 2) - cx
      const dy = (z.y + z.height / 2) - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      return dist > radius
    })

    this.plants.splice(idx, 1)
  }

  /** 收集阳光 */
  collectSun(sunId: string): boolean {
    const sun = this.suns.find((s) => s.id === sunId && !s.collected)
    if (!sun) return false
    sun.collected = true
    this.sun += sun.value
    this.emit({ type: 'sunChange', sun: this.sun })
    return true
  }

  /** 检查阳光是否在点击范围内 */
  getSunAt(x: number, y: number): SunEntity | undefined {
    return this.suns.find((s) => {
      if (s.collected) return false
      const dx = x - (s.x + s.width / 2)
      const dy = y - (s.y + s.height / 2)
      return Math.sqrt(dx * dx + dy * dy) < 40
    })
  }

  /** 获取点击的格子 */
  getGridPosFromPoint(x: number, y: number): GridPos | null {
    const col = Math.floor((x - CANVAS_OFFSET_X) / CELL_WIDTH)
    const row = Math.floor((y - CANVAS_OFFSET_Y) / CELL_HEIGHT)
    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      return { row, col }
    }
    return null
  }

  /** 游戏主循环更新 */
  update(deltaTime: number) {
    if (this.state !== 'playing') return

    const now = Date.now()

    // 阳光自然掉落
    if (now - this.lastSunSpawn > SUN_SPAWN_INTERVAL) {
      this.spawnSun()
      this.lastSunSpawn = now
    }

    // 向日葵产阳光
    for (const plant of this.plants) {
      if (plant.type !== 'sunflower') continue
      const last = this.sunflowerLastSun[plant.id] ?? plant.lastAttackTime
      if (now - last >= SUNFLOWER_PRODUCE_INTERVAL) {
        this.sunflowerLastSun[plant.id] = now
        this.suns.push({
          id: genId(),
          x: plant.x + plant.width / 2 - 20,
          y: plant.y - 10,
          width: 40,
          height: 40,
          value: 25,
          collected: false,
          spawnTime: now,
        })
      }
    }

    // 僵尸生成
    const elapsed = now - this.gameStartTime
    if (elapsed > ZOMBIE_SPAWN_DELAY && now - this.lastZombieSpawn > ZOMBIE_SPAWN_INTERVAL) {
      this.spawnZombie()
      this.lastZombieSpawn = now
    }

    // 植物冷却
    for (const type of Object.keys(this.plantCooldowns) as PlantType[]) {
      if (this.plantCooldowns[type] > 0) {
        this.plantCooldowns[type] = Math.max(0, this.plantCooldowns[type] - deltaTime)
      }
    }

    // 攻击型植物发射豌豆
    for (const plant of this.plants) {
      const config = PLANTS[plant.type]
      if (!config?.attack || !config.attackInterval) continue

      const zombieInRow = this.zombies.find((z) => z.row === Math.floor((plant.y - CANVAS_OFFSET_Y) / CELL_HEIGHT))
      if (!zombieInRow) continue

      if (now - plant.lastAttackTime >= config.attackInterval) {
        plant.lastAttackTime = now
        const damage = config.attack ?? 20
        const count = plant.type === 'repeater' ? 2 : 1
        for (let i = 0; i < count; i++) {
          this.peas.push({
            id: genId(),
            x: plant.x + plant.width,
            y: plant.y + plant.height / 2 - 8,
            width: 16,
            height: 16,
            damage,
            row: Math.floor((plant.y - CANVAS_OFFSET_Y) / CELL_HEIGHT),
            targetX: CANVAS_OFFSET_X + GRID_COLS * CELL_WIDTH,
          })
        }
      }
    }

    // 豌豆移动与碰撞
    this.peas = this.peas.filter((pea) => {
      pea.x += 8
      if (pea.x > pea.targetX) return false

      const hitZombie = this.zombies.find((z) => {
        if (z.row !== pea.row) return false
        return pea.x + pea.width > z.x && pea.x < z.x + z.width
      })
      if (hitZombie) {
        hitZombie.hp -= pea.damage
        return false
      }
      return true
    })

    // 僵尸移动与啃食
    for (const zombie of this.zombies) {
      const plantInFront = this.plants.find((p) => {
        const pRow = Math.floor((p.y - CANVAS_OFFSET_Y) / CELL_HEIGHT)
        const pCol = Math.floor((p.x - CANVAS_OFFSET_X) / CELL_WIDTH)
        const zCol = Math.floor((zombie.x - CANVAS_OFFSET_X) / CELL_WIDTH)
        return pRow === zombie.row && pCol <= zCol + 1 && pCol >= zCol - 1
      })

      if (plantInFront) {
        plantInFront.hp -= (ZOMBIES[zombie.type]?.damage ?? 20) * (deltaTime / 1000)
        if (plantInFront.hp <= 0) {
          this.plants = this.plants.filter((p) => p !== plantInFront)
        }
      } else {
        zombie.x -= (ZOMBIES[zombie.type]?.speed ?? 0.3) * (deltaTime / 10)
      }
    }

    // 移除死亡僵尸
    this.zombies = this.zombies.filter((z) => z.hp > 0)

    // 胜负判定
    if (this.zombies.some((z) => z.x < CANVAS_OFFSET_X + 50)) {
      this.state = 'lost'
      this.emit({ type: 'stateChange', state: 'lost' })
      this.emit({ type: 'gameOver', won: false })
    } else if (elapsed > 60000 && this.zombies.length === 0) {
      this.state = 'won'
      this.emit({ type: 'stateChange', state: 'won' })
      this.emit({ type: 'gameOver', won: true })
    }
  }

  private spawnSun() {
    const row = Math.floor(Math.random() * GRID_ROWS)
    const col = Math.floor(Math.random() * GRID_COLS)
    const x = CANVAS_OFFSET_X + col * CELL_WIDTH + Math.random() * CELL_WIDTH - 20
    const y = CANVAS_OFFSET_Y + row * CELL_HEIGHT - 20

    this.suns.push({
      id: genId(),
      x,
      y,
      width: 40,
      height: 40,
      value: 25,
      collected: false,
      spawnTime: Date.now(),
    })
  }

  private spawnZombie() {
    const types: ZombieType[] = ['normal', 'cone', 'bucket', 'pole']
    const type = types[Math.floor(Math.random() * types.length)]
    const config = ZOMBIES[type]
    const row = Math.floor(Math.random() * GRID_ROWS)

    const zombie: ZombieEntity = {
      id: genId(),
      type,
      x: CANVAS_OFFSET_X + GRID_COLS * CELL_WIDTH - 40,
      y: CANVAS_OFFSET_Y + row * CELL_HEIGHT + 10,
      width: 50,
      height: 80,
      hp: config.hp,
      maxHp: config.hp,
      row,
    }
    this.zombies.push(zombie)
    this.emit({ type: 'zombieSpawned', zombie })
  }
}
