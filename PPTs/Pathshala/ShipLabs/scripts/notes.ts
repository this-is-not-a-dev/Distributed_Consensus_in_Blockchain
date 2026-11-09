// Writes SPEAKER_NOTES.md from the `say` script of every step (bun scripts/notes.ts).
import { readdirSync, writeFileSync } from 'node:fs';
import { SLIDE_META } from '../src/slides/meta';
import { PARTS } from '../src/config';
import type { SlideDef } from '../src/slides/registry';

const dir = new URL('../src/slides/', import.meta.url);
const files = readdirSync(dir).filter((f) => /^Slide\d+\.tsx$/.test(f)).sort();
let md = '# ShipLabs: Speaker Notes\n\nOne script per step, read aloud while presenting. The same text appears live in the presenter window (press `N`).\n';
let part = '';
for (const [i, f] of files.entries()) {
  const { slide } = (await import(new URL(f, dir).href)) as { slide: SlideDef };
  const meta = SLIDE_META[i];
  if (meta.part !== part) md += `\n## ${PARTS[(part = meta.part)].label}\n`;
  md += `\n### ${meta.id}. ${meta.title} · ~${meta.suggestedMinutes} min\n\n`;
  slide.steps.forEach((s, k) => (md += `${k + 1}. **${s.title}.** ${s.say}\n`));
}
writeFileSync(new URL('../SPEAKER_NOTES.md', import.meta.url), md);
console.log(`SPEAKER_NOTES.md: ${files.length} slides`);
