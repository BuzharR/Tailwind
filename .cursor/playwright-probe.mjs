import { chromium } from 'playwright';
import fs from 'node:fs';

const port = process.argv[2] || '5173';
const url = `http://localhost:${port}/`;
const logPath = '.cursor/debug-83596e.log';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(500);

const data = await page.evaluate(() => {
  const root = getComputedStyle(document.documentElement);
  const buttons = [...document.querySelectorAll('button')].map((btn, index) => {
    const cs = getComputedStyle(btn);
    const card = btn.closest('.bg-card');
    const cardWidth = card ? parseFloat(getComputedStyle(card).width) : null;
    const btnWidth = parseFloat(cs.width);
    const bg = cs.backgroundColor;
    return {
      index,
      label: btn.textContent?.trim(),
      className: btn.className,
      backgroundColor: bg,
      color: cs.color,
      widthPx: btnWidth,
      cardWidthPx: cardWidth,
      widthIsFull: cardWidth ? Math.abs(btnWidth - cardWidth) < 2 : null,
      isBackgroundTransparent: bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent',
    };
  });
  return {
    themeVars: {
      colorBtnPrimary: root.getPropertyValue('--color-btn-primary').trim(),
      colorActionPrimary: root.getPropertyValue('--color-action-primary').trim(),
      colorPurple500: root.getPropertyValue('--color-purple-500').trim(),
    },
    buttons,
    buttonCount: buttons.length,
  };
});

await browser.close();

const entries = [
  { hypothesisId: 'C', message: 'theme-css-vars', data: data.themeVars },
  { hypothesisId: 'E', message: 'buttons-in-dom', data: { count: data.buttonCount } },
  ...data.buttons.map((btn, i) => ({
    hypothesisId: i === data.buttons.length - 1 ? 'A' : 'B',
    message: `button-${i}-computed`,
    data: btn,
  })),
];

for (const entry of entries) {
  const line = JSON.stringify({
    sessionId: '83596e',
    location: 'playwright-probe.mjs',
    runId: 'post-fix',
    timestamp: Date.now(),
    ...entry,
  });
  fs.appendFileSync(logPath, line + '\n');
}

console.log(JSON.stringify(data, null, 2));
