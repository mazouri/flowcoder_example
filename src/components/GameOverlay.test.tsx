import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameOverlay } from './GameOverlay'

describe('GameOverlay', () => {
  it('won 时显示胜利文案', () => {
    render(<GameOverlay state="won" />)
    expect(screen.getByRole('heading', { name: /恭喜胜利/i })).toBeInTheDocument()
    expect(screen.getByText(/你成功抵御了僵尸的进攻/i)).toBeInTheDocument()
  })

  it('lost 时显示失败文案', () => {
    render(<GameOverlay state="lost" />)
    expect(screen.getByRole('heading', { name: /游戏结束/i })).toBeInTheDocument()
    expect(screen.getByText(/僵尸吃掉了你的脑子/i)).toBeInTheDocument()
  })

  it('playing 时不渲染', () => {
    const { container } = render(<GameOverlay state="playing" />)
    expect(container.firstChild).toBeNull()
  })

  it('idle 时不渲染', () => {
    const { container } = render(<GameOverlay state="idle" />)
    expect(container.firstChild).toBeNull()
  })

  it('显示再来一局按钮并调用 onRestart', async () => {
    const onRestart = vi.fn()
    render(<GameOverlay state="won" onRestart={onRestart} />)
    const btn = screen.getByRole('button', { name: /再来一局/i })
    await userEvent.click(btn)
    expect(onRestart).toHaveBeenCalledTimes(1)
  })

  it('具有 role="dialog" 和 aria-modal', () => {
    render(<GameOverlay state="won" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })
})
