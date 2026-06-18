import fs from 'node:fs';

const file = process.argv[2] || '.cursor/dev-live.css';
const raw = fs.readFileSync(file, 'utf8');
const match = raw.match(/const __vite__css = "([\s\S]*)";\n/);
const css = match ? JSON.parse(`"${match[1]}"`) : raw;

for (const name of [
  '--color-purple-500',
  '--color-action-primary',
  '--color-btn-primary',
  '--color-surface',
  '--color-card',
  '--color-cream-50',
  '--color-cream-100',
  '--color-cream-200',
  '--color-ink',
]) {
  const idx = css.indexOf(name);
  console.log(name + ':', idx >= 0 ? css.slice(idx, idx + 80).replace(/\n/g, ' ') : 'MISSING');
}

for (const sel of ['.bg-btn-primary', '.bg-btn-secondary', '.bg-card', '.w-full', '.w-fit']) {
  const idx = css.indexOf(sel);
  console.log(sel + ':', idx >= 0 ? css.slice(idx, idx + 100).replace(/\n/g, ' ') : 'MISSING');
}
