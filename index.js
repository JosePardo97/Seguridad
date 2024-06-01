const forge = require('node-forge');
const fs = require('fs');

function generateKeyPair(bits = 2048) {
    return forge.pki.rsa.generateKeyPair(bits);
}

function exportKeyPairToPem(keyPair) {
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    return { publicKeyPem, privateKeyPem };
}

function saveKeysToFile(publicKeyPem, privateKeyPem, publicPath = 'clavePublica.pem', privatePath = 'clavePrivada.pem') {
    fs.writeFileSync(publicPath, publicKeyPem);
    fs.writeFileSync(privatePath, privateKeyPem);
    console.log(`Las claves han sido guardadas en los archivos ${publicPath} y ${privatePath}`);
}

function loadKeyFromFile(path) {
    return fs.readFileSync(path, 'utf8');
}

function encryptMessage(message, publicKeyPem) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const bufferMessage = Buffer.from(message, 'utf-8');
    const encryptedMessage = publicKey.encrypt(bufferMessage.toString('binary'), 'RSA-OAEP');
    return Buffer.from(encryptedMessage, 'binary').toString('base64');
}

function decryptMessage(encryptedMessageBase64, privateKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedMessageBuffer = Buffer.from(encryptedMessageBase64, 'base64');
    const decryptedMessage = privateKey.decrypt(encryptedMessageBuffer.toString('binary'), 'RSA-OAEP');
    return decryptedMessage;
}

// Lógica principal
try {
    // Generar par de claves RSA
    const keyPair = generateKeyPair();
    const { publicKeyPem, privateKeyPem } = exportKeyPairToPem(keyPair);

    // Guardar las claves en archivos
    saveKeysToFile(publicKeyPem, privateKeyPem);

    // Mensaje a cifrar
    const mensajeOriginal = 'En este taller nuestra nota sera de 5';
    console.log('Mensaje original que se desea cifrar:');
    console.log(mensajeOriginal);
    console.log();

    // Cifrar el mensaje
    const mensajeCifradoBase64 = encryptMessage(mensajeOriginal, publicKeyPem);
    console.log('Mensaje cifrado en formato Base64:');
    console.log(mensajeCifradoBase64);
    console.log();

    // Descifrar el mensaje
    const mensajeDescifrado = decryptMessage(mensajeCifradoBase64, privateKeyPem);
    console.log('Mensaje después de ser descifrado:');
    console.log(mensajeDescifrado);
} catch (error) {
    console.error('Ha ocurrido un error durante el proceso:', error);
}
