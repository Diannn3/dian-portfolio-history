const { chromium } = require('playwright');
const path = require('path');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    console.log('Navigating to http://127.0.0.1:4321 ...');
    // Wait for the network to be idle to ensure WebGL and canvas are fully rendered
    await page.goto('http://127.0.0.1:4321', { waitUntil: 'networkidle' });
    
    // Give it an extra second for animations or Three.js to render
    await page.waitForTimeout(2000);

    console.log('Taking desktop screenshot...');
    await page.setViewportSize({ width: 1440, height: 900 });
    // Let resize settle
    await page.waitForTimeout(500);
    const desktopPath = path.join('C:', 'Users', 'Dian', '.gemini', 'antigravity', 'brain', '20ba8ccf-b1a8-4d76-a492-f9349258b860', 'desktop_hero.png');
    await page.screenshot({ path: desktopPath });
    
    console.log('Taking mobile screenshot...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    const mobilePath = path.join('C:', 'Users', 'Dian', '.gemini', 'antigravity', 'brain', '20ba8ccf-b1a8-4d76-a492-f9349258b860', 'mobile_hero.png');
    await page.screenshot({ path: mobilePath });
    
    await browser.close();
    console.log('Screenshots saved.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
