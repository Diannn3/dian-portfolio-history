import { test, expect } from '@playwright/test';
const routes=['uppetite','pasada','disaster-response','campus-navigation'];
for(const route of routes)test(`project ${route} renders`,async({page})=>{await page.goto(`/work/${route}`);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('[data-project-visual]')).toBeVisible();});
