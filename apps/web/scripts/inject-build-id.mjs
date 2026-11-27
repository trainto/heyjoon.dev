import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const buildId = readFileSync(join('.next', 'BUILD_ID'), 'utf-8').trim();
const swPath = join('out', 'sw.js');

const sw = readFileSync(swPath, 'utf-8');
writeFileSync(swPath, sw.replaceAll('__BUILD_ID__', buildId));
