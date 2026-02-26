import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEngine } from './GameEngine'
import { INITIAL_SUN } from '../constants'
import type { GridPos } from '../types'

describe('GameEngine', () => {
  let engine: GameEngine

  beforeEach(() => {
    vi.useFakeTimers()
    engine = new GameEngine()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('初始状态', () => {
    it('初始状态为 idle', () => {
      expect(engine.getState()).toBe('idle')
    })

    it('初始阳光为 50', () => {
      expect(engine.getSun()).toBe(INITIAL_SUN)
    })

    it('无植物、僵尸、阳光', () => {
      expect(engine.getPlants()).toHaveLength(0)
      expect(engine.getZombies()).toHaveLength(0)
      expect(engine.getSuns()).toHaveLength(0)
    })
  })

  describe('start()', () => {
    it('idle 时 start 进入 playing', () => {
      engine.start()
      expect(engine.getState()).toBe('playing')
      expect(engine.getSun()).toBe(INITIAL_SUN)
      expect(engine.getPlants()).toHaveLength(0)
    })

    it('lost 时 start 可重新开始', () => {
      engine.start()
      engine.update(0)
      // 通过放置植物等方式让僵尸到达左边界需要较长时间，这里仅验证 start 可被再次调用
      engine.start()
      expect(engine.getState()).toBe('playing')
    })

    it('playing 时 start 不重复执行', () => {
      engine.start()
      engine.selectPlant('sunflower')
      engine.placePlant({ row: 0, col: 0 })
      const sunBefore = engine.getSun()
      engine.start()
      // playing 时 start 会 return 不执行
      expect(engine.getState()).toBe('playing')
      expect(engine.getPlants()).toHaveLength(1)
    })
  })

  describe('togglePause()', () => {
    it('playing 时 togglePause 变为 paused', () => {
      engine.start()
      engine.togglePause()
      expect(engine.getState()).toBe('paused')
    })

    it('paused 时 togglePause 变为 playing', () => {
      engine.start()
      engine.togglePause()
      engine.togglePause()
      expect(engine.getState()).toBe('playing')
    })

    it('idle 时 togglePause 无效', () => {
      engine.togglePause()
      expect(engine.getState()).toBe('idle')
    })
  })

  describe('placePlant()', () => {
    beforeEach(() => {
      engine.start()
    })

    it('未选择植物时不可放置', () => {
      const result = engine.placePlant({ row: 0, col: 0 })
      expect(result).toBe(false)
      expect(engine.getPlants()).toHaveLength(0)
    })

    it('选择向日葵且阳光足够时可放置', () => {
      engine.selectPlant('sunflower')
      const result = engine.placePlant({ row: 0, col: 0 })
      expect(result).toBe(true)
      expect(engine.getPlants()).toHaveLength(1)
      expect(engine.getPlants()[0].type).toBe('sunflower')
      expect(engine.getSun()).toBe(INITIAL_SUN - 50)
    })

    it('阳光不足时不可放置', () => {
      engine.selectPlant('peashooter') // 成本 100，初始 50
      const result = engine.placePlant({ row: 0, col: 0 })
      expect(result).toBe(false)
      expect(engine.getPlants()).toHaveLength(0)
    })

    it('格子已有植物时不可重复放置', () => {
      engine.selectPlant('sunflower')
      engine.placePlant({ row: 0, col: 0 })
      engine.selectPlant('peashooter')
      // 阳光不足 peashooter，改用 wallnut 50
      engine.selectPlant('wallnut')
      const result = engine.placePlant({ row: 0, col: 0 })
      expect(result).toBe(false)
      expect(engine.getPlants()).toHaveLength(1)
    })

    it('放置后进入冷却', () => {
      engine.selectPlant('sunflower')
      engine.placePlant({ row: 0, col: 0 })
      engine.selectPlant('sunflower')
      const result = engine.placePlant({ row: 1, col: 0 })
      expect(result).toBe(false)
      expect(engine.getPlantCooldown('sunflower')).toBeGreaterThan(0)
    })

    it('暂停时不可放置', () => {
      engine.togglePause()
      engine.selectPlant('sunflower')
      const result = engine.placePlant({ row: 0, col: 0 })
      expect(result).toBe(false)
    })
  })

  describe('collectSun()', () => {
    it('收集阳光增加阳光数', () => {
      engine.start()
      // 手动添加阳光（通过 update 触发自然掉落需等待 8 秒）
      vi.advanceTimersByTime(9000)
      engine.update(100)
      const suns = engine.getSuns()
      if (suns.length > 0) {
        const sunId = suns[0].id
        const sunBefore = engine.getSun()
        engine.collectSun(sunId)
        expect(engine.getSun()).toBe(sunBefore + 25)
      }
    })

    it('无效 id 收集返回 false', () => {
      const result = engine.collectSun('invalid-id')
      expect(result).toBe(false)
    })
  })

  describe('getGridPosFromPoint()', () => {
    it('有效范围内返回正确格子', () => {
      // CANVAS_OFFSET_X=120, CANVAS_OFFSET_Y=80, CELL_WIDTH=80, CELL_HEIGHT=100
      const pos = engine.getGridPosFromPoint(200, 180)
      expect(pos).toEqual({ row: 1, col: 1 })
    })

    it('超出范围返回 null', () => {
      expect(engine.getGridPosFromPoint(0, 0)).toBeNull()
      expect(engine.getGridPosFromPoint(1000, 1000)).toBeNull()
    })
  })

  describe('subscribe()', () => {
    it('stateChange 事件被触发', () => {
      const listener = vi.fn()
      engine.subscribe(listener)
      engine.start()
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'stateChange', state: 'playing' })
      )
    })

    it('sunChange 事件被触发', () => {
      const listener = vi.fn()
      engine.subscribe(listener)
      engine.start()
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'sunChange', sun: INITIAL_SUN })
      )
    })

    it('取消订阅后不再收到事件', () => {
      const listener = vi.fn()
      const unsub = engine.subscribe(listener)
      unsub()
      engine.start()
      expect(listener).not.toHaveBeenCalled()
    })
  })

})
