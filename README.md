Código referente ao Trabalho 03 de Auditoria e Segurança de sistemas de informação do professor Bruno da UNIFEI.
Código encripta e assina um arquivo e valida sua assinatura e seu conteudo.
Comandos para execução:
npx ts-node src/generateKeys.ts - Gera as chaves de criptografia para serem as mesmas entre os arquivos 
npx ts-node src/encryptAndSign.ts - Encripta o arquivo com base em um caminho referência no código
npx ts-node src/verifyAndDecrypt.ts - Desemcripta e valida o arquivo com base em um caminho referência no código
