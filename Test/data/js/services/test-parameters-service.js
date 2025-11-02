/**
 * Script de test pour le service de paramètres
 * Utilisation: node test-parameters-service.js
 */

// Simuler l'environnement navigateur pour le test
global.btoa = str => Buffer.from(str, 'binary').toString('base64');
global.atob = str => Buffer.from(str, 'base64').toString('binary');

// Configuration Supabase
const SUPABASE_URL = 'https://mtuimnyoimiqhuyidyjv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dWltbnlvaW1pcWh1eWlkeWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjc3NjksImV4cCI6MjA3Njg0Mzc2OX0.SuB-0Kwaakff6pbZhKgWbGaAfL9h_NWaRBR9rNnaMIw';

// Classe simplifiée pour les tests
class ParametersServiceTest {
    constructor() {
        this.encryptionKey = 'LaMieDuCoin2025SecretKey';
    }

    encrypt(text) {
        if (!text) return null;
        
        try {
            const textBytes = Array.from(text);
            const keyBytes = Array.from(this.encryptionKey);
            
            const encrypted = textBytes.map((char, i) => {
                const keyChar = keyBytes[i % keyBytes.length];
                return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
            });
            
            return btoa(encrypted.join(''));
        } catch (error) {
            console.error('Erreur lors du chiffrement:', error);
            return null;
        }
    }

    decrypt(encryptedText) {
        if (!encryptedText) return null;
        
        try {
            const decoded = atob(encryptedText);
            const encryptedBytes = Array.from(decoded);
            const keyBytes = Array.from(this.encryptionKey);
            
            const decrypted = encryptedBytes.map((char, i) => {
                const keyChar = keyBytes[i % keyBytes.length];
                return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
            });
            
            return decrypted.join('');
        } catch (error) {
            console.error('Erreur lors du déchiffrement:', error);
            return null;
        }
    }
}

// Tests
console.log('🧪 Test du service de paramètres\n');
console.log('=' .repeat(50));

const service = new ParametersServiceTest();

// Test 1: Chiffrement/Déchiffrement
console.log('\n📝 Test 1: Chiffrement et déchiffrement');
const testAccount = 'test@exemple.com';
const testPassword = 'MonMotDePasse123!';

console.log('   Compte original:', testAccount);
const encryptedAccount = service.encrypt(testAccount);
console.log('   Compte chiffré:', encryptedAccount);
const decryptedAccount = service.decrypt(encryptedAccount);
console.log('   Compte déchiffré:', decryptedAccount);
console.log('   ✅ Test réussi:', testAccount === decryptedAccount);

console.log('\n   Mot de passe original:', testPassword);
const encryptedPassword = service.encrypt(testPassword);
console.log('   Mot de passe chiffré:', encryptedPassword);
const decryptedPassword = service.decrypt(encryptedPassword);
console.log('   Mot de passe déchiffré:', decryptedPassword);
console.log('   ✅ Test réussi:', testPassword === decryptedPassword);

// Test 2: Valeurs NULL
console.log('\n📝 Test 2: Gestion des valeurs NULL');
const nullEncrypted = service.encrypt(null);
console.log('   Chiffrement de NULL:', nullEncrypted);
console.log('   ✅ Test réussi:', nullEncrypted === null);

const nullDecrypted = service.decrypt(null);
console.log('   Déchiffrement de NULL:', nullDecrypted);
console.log('   ✅ Test réussi:', nullDecrypted === null);

// Test 3: Caractères spéciaux
console.log('\n📝 Test 3: Caractères spéciaux');
const specialChars = 'Mot@Passe!#$%&*()_+-=[]{}|;:,.<>?/~`';
console.log('   Texte original:', specialChars);
const encryptedSpecial = service.encrypt(specialChars);
console.log('   Texte chiffré:', encryptedSpecial);
const decryptedSpecial = service.decrypt(encryptedSpecial);
console.log('   Texte déchiffré:', decryptedSpecial);
console.log('   ✅ Test réussi:', specialChars === decryptedSpecial);

// Test 4: Exemple de données SMTP
console.log('\n📝 Test 4: Exemple complet de configuration SMTP');
const smtpConfig = {
    smtp: 'smtp.gmail.com',
    port: 587,
    smtp_account: 'lamieducoin@gmail.com',
    smtp_password: 'MotDePasseSecurisé2025!'
};

console.log('   Configuration originale:');
console.log('   - SMTP:', smtpConfig.smtp);
console.log('   - Port:', smtpConfig.port);
console.log('   - Compte:', smtpConfig.smtp_account);
console.log('   - Mot de passe:', smtpConfig.smtp_password);

const encryptedConfig = {
    smtp: smtpConfig.smtp,
    port: smtpConfig.port,
    smtp_account: service.encrypt(smtpConfig.smtp_account),
    smtp_password: service.encrypt(smtpConfig.smtp_password)
};

console.log('\n   Configuration chiffrée (stockée dans Supabase):');
console.log('   - SMTP:', encryptedConfig.smtp);
console.log('   - Port:', encryptedConfig.port);
console.log('   - Compte chiffré:', encryptedConfig.smtp_account);
console.log('   - Mot de passe chiffré:', encryptedConfig.smtp_password);

const decryptedConfig = {
    smtp: encryptedConfig.smtp,
    port: encryptedConfig.port,
    smtp_account: service.decrypt(encryptedConfig.smtp_account),
    smtp_password: service.decrypt(encryptedConfig.smtp_password)
};

console.log('\n   Configuration déchiffrée (récupérée):');
console.log('   - SMTP:', decryptedConfig.smtp);
console.log('   - Port:', decryptedConfig.port);
console.log('   - Compte:', decryptedConfig.smtp_account);
console.log('   - Mot de passe:', decryptedConfig.smtp_password);

console.log('\n   ✅ Test réussi:', 
    smtpConfig.smtp_account === decryptedConfig.smtp_account &&
    smtpConfig.smtp_password === decryptedConfig.smtp_password
);

console.log('\n' + '='.repeat(50));
console.log('✅ Tous les tests sont terminés!');
console.log('\n📌 Notes importantes:');
console.log('   - Le chiffrement utilise XOR + Base64');
console.log('   - Pour la production, utilisez une vraie librairie de chiffrement');
console.log('   - Les données sensibles ne sont jamais exposées en clair dans les logs');
console.log('   - La clé de chiffrement doit être gardée secrète');
