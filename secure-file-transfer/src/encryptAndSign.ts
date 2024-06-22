import * as crypto from 'crypto';
import * as fs from 'fs';

const keys = JSON.parse(fs.readFileSync('data/keys.json', 'utf8')); //Carrega as chaves geradas no arquivo keys.json
const key = Buffer.from(keys.key, 'hex');
const hmacKey = Buffer.from(keys.hmacKey, 'hex');
const iv = crypto.randomBytes(16);

const algorithm = 'aes-256-cbc';
const macAlgorithm = 'sha256';

function encryptAndSignFile(filePath: string, outputFilePath: string): void {
  const fileContent = fs.readFileSync(filePath);

  // Encripta o arquivo
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(fileContent);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Gera o MAC
  const hmac = crypto.createHmac(macAlgorithm, hmacKey);
  hmac.update(encrypted);
  const mac = hmac.digest();

  // Combina IV, conteúdo encriptado e MAC
  const combined = Buffer.concat([iv, encrypted, mac]);

  fs.writeFileSync(outputFilePath, combined);
  console.log(`File encrypted and signed successfully: ${outputFilePath}`);
}

const inputFile = 'data/input.txt';
const outputFile = 'data/output.enc';
encryptAndSignFile(inputFile, outputFile);
