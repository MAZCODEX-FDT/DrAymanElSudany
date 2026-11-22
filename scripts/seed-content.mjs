// Writes dist/api/seed.json: the default website content that setup.php loads into empty tables.
import { mkdirSync, writeFileSync } from 'node:fs';
import { seedContent } from '../src/data/seed.js';

mkdirSync('dist/api', { recursive: true });
writeFileSync('dist/api/seed.json', JSON.stringify(seedContent()));
console.log('[seed-content] dist/api/seed.json written');
