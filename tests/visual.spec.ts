import { expect, test } from "@playwright/test"

async function settle(page: import("@playwright/test").Page) {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.evaluate(() => document.fonts.ready)
}

test("desktop visual checkpoints", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440")
  await settle(page)
  for (const [name, selector] of [
    ["hero-desktop", "#hero"],
    ["selected-work", "#work"],
    ["about", "#about"],
    ["digital-artifact", "#artifact"],
    ["lab", "#lab"],
    ["contact", "#contact"],
  ] as const) {
    await expect(page.locator(selector)).toHaveScreenshot(`${name}.png`, { animations: "disabled" })
  }

  await page.goto("/work/uppetite-elbi/")
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator("article").first()).toHaveScreenshot("project-page.png", { animations: "disabled" })
})

test("mobile hero and menu checkpoints", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375")
  await settle(page)
  await expect(page.locator("#hero")).toHaveScreenshot("hero-mobile.png", { animations: "disabled" })
  await page.getByRole("button", { name: "Menu" }).click()
  await expect(page.getByRole("dialog", { name: "Index / Navigation" })).toHaveScreenshot("mobile-menu.png", { animations: "disabled" })
})
