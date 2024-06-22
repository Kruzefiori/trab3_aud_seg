import * as crypto from 'crypto';
import * as fs from 'fs';

const keys = JSON.parse(fs.readFileSync('data/keys.json', 'utf8'));
const key = Buffer.from(keys.key, 'hex');
const hmacKey = Buffer.from(keys.hmacKey, 'hex');

const algorithm = 'aes-256-cbc';
const macAlgorithm = 'sha256';

function verifyAndDecryptFile(encryptedFilePath: string, outputFilePath: string): void {
  const fileContent = fs.readFileSync(encryptedFilePath);

  // Extract IV, encrypted content, and MAC
  const iv = fileContent.slice(0, 16);
  const mac = fileContent.slice(-32);
  const encrypted = fileContent.slice(16, -32);

  // Verify MAC
  const hmac = crypto.createHmac(macAlgorithm, hmacKey);
  hmac.update(encrypted);
  const calculatedMac = hmac.digest();

  if (!crypto.timingSafeEqual(mac, calculatedMac)) {
    throw new Error('File integrity check failed.');
  }

  // Decrypt the file
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  fs.writeFileSync(outputFilePath, decrypted);
  console.log(`File decrypted and verified successfully: ${outputFilePath}`);
}

const encryptedFile = 'data/output.enc';
const decryptedFile = 'data/decrypted.txt';
verifyAndDecryptFile(encryptedFile, decryptedFile);