import * as crypto from 'crypto';
import * as fs from 'fs';

const keys = JSON.parse(fs.readFileSync('data/keys.json', 'utf8'));//carrega as chaves geradas no arquivo keys.json
const key = Buffer.from(keys.key, 'hex');
const hmacKey = Buffer.from(keys.hmacKey, 'hex');

const algorithm = 'aes-256-cbc';
const macAlgorithm = 'sha256';

function verifyAndDecryptFile(encryptedFilePath: string, outputFilePath: string): void {
  const fileContent = fs.readFileSync(encryptedFilePath);

    // Separa o IV, o MAC e o conteúdo encriptado
  const iv = fileContent.slice(0, 16);
  const mac = fileContent.slice(-32);
  const encrypted = fileContent.slice(16, -32);

  // verifique a integridade do arquivo
  const hmac = crypto.createHmac(macAlgorithm, hmacKey);
  hmac.update(encrypted);
  const calculatedMac = hmac.digest();

  if (!crypto.timingSafeEqual(mac, calculatedMac)) {
    throw new Error('File integrity check failed.');//Se o MAC não for igual ao calculado, o arquivo foi alterado
  }

  // Descriptografa o arquivo
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Salva o arquivo descriptografado
  fs.writeFileSync(outputFilePath, decrypted);
  console.log(`File decrypted and verified successfully: ${outputFilePath}`);
}

// pegue os caminhos dos arquivos da linha de comando
const [encryptedFile, decryptedFile] = process.argv.slice(2);

if (!encryptedFile || !decryptedFile) {
  console.error('Usage: npx ts-node src/verifyAndDecrypt.ts <encryptedFilePath> <decryptedFilePath>');
  process.exit(1);
}

verifyAndDecryptFile(encryptedFile, decryptedFile);
