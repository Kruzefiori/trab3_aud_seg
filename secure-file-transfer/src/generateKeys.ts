import * as fs from 'fs';
import * as crypto from 'crypto';

const key = crypto.randomBytes(32);
const hmacKey = crypto.randomBytes(32);

fs.writeFileSync('data/keys.json', JSON.stringify({ key: key.toString('hex'), hmacKey: hmacKey.toString('hex') }));
console.log('Keys generated and saved to data/keys.json');
