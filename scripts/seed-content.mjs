// Writes backend/database/data/seed.json: the default website content that Laravel's ContentSeeder
// (and the /setup page) loads into empty tables.
import { mkdirSync, writeFileSync } from 'node:fs';
import { seedContent } from '../src/data/seed.js';

mkdirSync('backend/database/data', { recursive: true });
writeFileSync('backend/database/data/seed.json', JSON.stringify(seedContent()));
console.log('[seed-content] backend/database/data/seed.json written');
