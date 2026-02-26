import type { PlantConfig, ZombieConfig } from './types'

/** 网格尺寸 */
export const GRID_ROWS = 5
export const GRID_COLS = 9
export const CELL_WIDTH = 80
export const CELL_HEIGHT = 100

/** 画布偏移 */
export const CANVAS_OFFSET_X = 120
export const CANVAS_OFFSET_Y = 80

/** 植物选择栏 */
export const SEED_BANK_HEIGHT = 100

/** 游戏配置 */
export const INITIAL_SUN = 50
export const SUN_SPAWN_INTERVAL = 8000
export const SUNFLOWER_PRODUCE_INTERVAL = 10000
export const SUN_FALL_DURATION = 4000
export const ZOMBIE_SPAWN_INTERVAL = 6000
export const ZOMBIE_SPAWN_DELAY = 10000

/** 植物配置表 */
export const PLANTS: Record<string, PlantConfig> = {
  sunflower: {
    id: 'sunflower',
    name: '向日葵',
    cost: 50,
    cooldown: 7500,
    hp: 80,
  },
  peashooter: {
    id: 'peashooter',
    name: '豌豆射手',
    cost: 100,
    cooldown: 7500,
    hp: 100,
    attack: 20,
    attackInterval: 1500,
    range: 1,
  },
  wallnut: {
    id: 'wallnut',
    name: '坚果墙',
    cost: 50,
    cooldown: 30000,
    hp: 400,
  },
  cherrybomb: {
    id: 'cherrybomb',
    name: '樱桃炸弹',
    cost: 150,
    cooldown: 50000,
    hp: 100,
  },
  repeater: {
    id: 'repeater',
    name: '双发豌豆',
    cost: 200,
    cooldown: 7500,
    hp: 100,
    attack: 20,
    attackInterval: 1500,
    range: 1,
  },
}

/** 僵尸配置表 */
export const ZOMBIES: Record<string, ZombieConfig> = {
  normal: {
    id: 'normal',
    name: '普通僵尸',
    hp: 100,
    speed: 0.3,
    damage: 20,
  },
  cone: {
    id: 'cone',
    name: '路障僵尸',
    hp: 250,
    speed: 0.3,
    damage: 20,
  },
  bucket: {
    id: 'bucket',
    name: '铁桶僵尸',
    hp: 500,
    speed: 0.25,
    damage: 20,
  },
  pole: {
    id: 'pole',
    name: '撑杆僵尸',
    hp: 100,
    speed: 0.5,
    damage: 20,
  },
}
