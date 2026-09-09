import { readFile } from 'node:fs/promises';
import { validateExpoData } from './expo-data-health.mjs';
const data = JSON.parse(await readFile(new URL('../src/data/expos.generated.json', import.meta.url), 'utf8'));
console.log('Schedule deployment check:', validateExpoData(data));
