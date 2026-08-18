import { expect, test } from "@playwright/test"

const projectPaths = [
  "/work/uppetite-elbi/",
  "/work/pasada/",
  "/work/disaster-response/",
  "/work/campus-navigation/",
]

test("homepage renders the full portfolio structure", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("DIAN BUILDS")
  for (const id of ["work", "about", "now", "artifact", "lab", "tools", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
})

test("layout never creates horizontal document overflow", async ({ page }) => {
  await page.goto("/")
  const overflow = await page.evaluate(() => ({
    root: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth,
  }))
  expect(overflow.root).toBeLessThanOrEqual(1)
  expect(overflow.body).toBeLessThanOrEqual(1)
})

test("navigation is keyboard-reachable and mobile menu behaves modally", async ({ page }) => {
  await page.goto("/")
  const viewport = page.viewportSize()
  if ((viewport?.width ?? 1440) < 768) {
    const menu = page.getByRole("button", { name: "Menu" })
    await menu.focus()
    await expect(menu).toBeFocused()
    await menu.click()
    const dialog = page.getByRole("dialog", { name: "Index / Navigation" })
    await expect(dialog).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(menu).toBeFocused()
  } else {
    const work = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" })
    await work.focus()
    await expect(work).toBeFocused()
    await work.click()
    await expect(page.locator("#work")).toBeInViewport()
  }
})

test("every project route renders honest status-oriented case-study content", async ({ page }) => {
  for (const path of projectPaths) {
    await page.goto(path)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByText("TO VERIFY", { exact: true }).first()).toBeVisible()
    await expect(page.getByRole("navigation", { name: "Next project" })).toBeVisible()
  }
})

test("project navigation survives browser back", async ({ page }) => {
  await page.goto("/")
  const firstProject = page.locator("#work a[href^='/work/']").first()
  await firstProject.click()
  await page.waitForURL(/\/work\//)
  await page.goBack()
  await page.waitForURL(/\/$/)
  await expect(page.locator("#work")).toHaveCount(1)
})

test("reduced-motion keeps the static vector-atlas hero meaningful", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto("/")
  const fallback = page.locator('#hero svg[aria-label*="projected parametric manifold"]')
  await expect(fallback).toBeVisible()
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await context.close()
})
