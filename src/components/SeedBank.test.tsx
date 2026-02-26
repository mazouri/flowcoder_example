import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeedBank } from './SeedBank'
import type { PlantType } from '@/lib/types'

const emptyCooldowns: Record<PlantType, number> = {
  sunflower: 0,
  peashooter: 0,
  wallnut: 0,
  cherrybomb: 0,
  repeater: 0,
}

describe('SeedBank', () => {
  const defaultProps = {
    sun: 100,
    selectedPlant: null as PlantType | null,
    cooldowns: emptyCooldowns,
    onSelectPlant: vi.fn(),
    disabled: false,
  }

  it('显示 5 种植物', () => {
    render(<SeedBank {...defaultProps} />)
    expect(screen.getByRole('button', { name: /向日葵/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /豌豆射手/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /坚果墙/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /樱桃炸弹/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /双发豌豆/i })).toBeInTheDocument()
  })

  it('显示植物成本', () => {
    render(<SeedBank {...defaultProps} />)
    const costs = screen.getAllByText('50')
    expect(costs.length).toBeGreaterThanOrEqual(1) // 向日葵、坚果墙均为 50
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
  })

  it('阳光不足时植物卡片禁用', () => {
    render(<SeedBank {...defaultProps} sun={30} />)
    const peashooter = screen.getByRole('button', { name: /豌豆射手/i })
    expect(peashooter).toBeDisabled()
  })

  it('冷却中显示倒计时', () => {
    render(
      <SeedBank
        {...defaultProps}
        cooldowns={{ ...emptyCooldowns, sunflower: 5000 }}
      />
    )
    expect(screen.getByText('5s')).toBeInTheDocument()
  })

  it('disabled 时所有按钮禁用', () => {
    render(<SeedBank {...defaultProps} disabled />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => expect(btn).toBeDisabled())
  })

  it('具有 role="toolbar" 和 aria-label', () => {
    render(<SeedBank {...defaultProps} />)
    const toolbar = screen.getByRole('toolbar', { name: /植物选择栏/i })
    expect(toolbar).toBeInTheDocument()
  })

  it('选中时 aria-pressed 为 true', () => {
    render(<SeedBank {...defaultProps} selectedPlant="sunflower" />)
    const btn = screen.getByRole('button', { name: /向日葵/i })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })
})
