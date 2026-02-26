import { test, expect } from '@playwright/test'

test.describe('植物大战僵尸 - E2E', () => {
  test('页面加载显示标题与操作说明', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /植物大战僵尸/i })).toBeVisible()
    await expect(page.getByText(/点击开始游戏/i)).toBeVisible()
    await expect(page.getByText(/操作说明/i)).toBeVisible()
  })

  test('点击开始游戏后进入进行中状态', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /开始游戏/i }).click()
    await expect(page.getByRole('button', { name: /暂停游戏/i })).toBeVisible()
    await expect(page.getByRole('status')).toContainText('50')
  })

  test('暂停与继续', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /开始游戏/i }).click()
    await page.getByRole('button', { name: /暂停游戏/i }).click()
    await expect(page.getByRole('button', { name: /继续游戏/i })).toBeVisible()
    await page.getByRole('button', { name: /继续游戏/i }).click()
    await expect(page.getByRole('button', { name: /暂停游戏/i })).toBeVisible()
  })

  test('植物选择栏可点击且显示成本', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /开始游戏/i }).click()
    const toolbar = page.getByRole('toolbar', { name: /植物选择栏/i })
    await expect(toolbar).toBeVisible()
    await expect(page.getByRole('button', { name: /向日葵.*50/i })).toBeVisible()
  })

  test('选择植物后点击格子可放置', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /开始游戏/i }).click()
    await page.getByRole('button', { name: /向日葵.*50/i }).click()
    const canvas = page.getByLabel(/游戏主画布/i)
    await canvas.click({ position: { x: 200, y: 150 } })
    await expect(page.getByRole('status')).toContainText('0')
  })

  test('画布可见且可交互', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /开始游戏/i }).click()
    const canvas = page.getByLabel(/游戏主画布/i)
    await expect(canvas).toBeVisible()
    await expect(canvas).toBeEnabled()
  })
})
