/** 格子坐标 (行, 列) */
export type GridPos = { row: number; col: number }

/** 植物类型 */
export type PlantType = 'sunflower' | 'peashooter' | 'wallnut' | 'cherrybomb' | 'repeater'

/** 僵尸类型 */
export type ZombieType = 'normal' | 'cone' | 'bucket' | 'pole'

/** 游戏状态 */
export type GameState = 'idle' | 'playing' | 'paused' | 'won' | 'lost'

/** 植物配置 */
export interface PlantConfig {
  id: PlantType
  name: string
  cost: number
  cooldown: number
  hp: number
  attack?: number
  attackInterval?: number
  range?: number
}

/** 僵尸配置 */
export interface ZombieConfig {
  id: ZombieType
  name: string
  hp: number
  speed: number
  damage: number
}

/** 实体基础 */
export interface Entity {
  id: string
  x: number
  y: number
  width: number
  height: number
}

/** 植物实体 */
export interface PlantEntity extends Entity {
  type: PlantType
  hp: number
  maxHp: number
  lastAttackTime: number
}

/** 僵尸实体 */
export interface ZombieEntity extends Entity {
  type: ZombieType
  hp: number
  maxHp: number
  row: number
}

/** 阳光实体 */
export interface SunEntity extends Entity {
  value: number
  collected: boolean
  spawnTime: number
}

/** 豌豆子弹 */
export interface PeaEntity extends Entity {
  damage: number
  row: number
  targetX: number
}
