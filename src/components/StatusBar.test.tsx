import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusBar } from './StatusBar'

describe('StatusBar', () => {
  const defaultProps = {
    sun: 50,
    state: 'idle' as const,
    onStart: vi.fn(),
    onPause: vi.fn(),
    onRestart: vi.fn(),
  }

  it('显示阳光数', () => {
    render(<StatusBar {...defaultProps} sun={75} />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('idle 时显示开始游戏按钮', () => {
    render(<StatusBar {...defaultProps} />)
    expect(screen.getByRole('button', { name: /开始游戏/i })).toBeInTheDocument()
  })

  it('点击开始游戏调用 onStart', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    render(<StatusBar {...defaultProps} onStart={onStart} />)
    await user.click(screen.getByRole('button', { name: /开始游戏/i }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('playing 时显示暂停按钮', () => {
    render(<StatusBar {...defaultProps} state="playing" />)
    expect(screen.getByRole('button', { name: /暂停游戏/i })).toBeInTheDocument()
  })

  it('paused 时显示继续按钮', () => {
    render(<StatusBar {...defaultProps} state="paused" />)
    expect(screen.getByRole('button', { name: /继续游戏/i })).toBeInTheDocument()
  })

  it('won 时显示再来一局按钮', () => {
    render(<StatusBar {...defaultProps} state="won" />)
    expect(screen.getByRole('button', { name: /重新开始/i })).toBeInTheDocument()
  })

  it('lost 时显示再来一局按钮', () => {
    render(<StatusBar {...defaultProps} state="lost" />)
    expect(screen.getByRole('button', { name: /重新开始/i })).toBeInTheDocument()
  })

  it('具有 role="status" 和 aria-live', () => {
    render(<StatusBar {...defaultProps} />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })
})
