/**
 * Script de test pour vérifier la configuration Resend
 * Utilisation: node test-resend.js
 */

const { Resend } = require('resend');
require('dotenv').config();

async function testResend() {
    console.log('🧪 Test de la configuration Resend\n');
    
    // Vérifier que la clé API est configurée
    if (!process.env.RESEND_API_KEY) {
        console.error('❌ ERREUR: RESEND_API_KEY n\'est pas définie dans .env');
        console.log('💡 Créez un fichier .env basé sur .env.example');
        process.exit(1);
    }
    
    if (!process.env.RESEND_FROM_EMAIL) {
        console.warn('⚠️  AVERTISSEMENT: RESEND_FROM_EMAIL n\'est pas définie');
        console.log('💡 Utilisation de l\'adresse par défaut\n');
    }
    
    console.log('✅ Variables d\'environnement trouvées');
    console.log(`📧 From: ${process.env.RESEND_FROM_EMAIL || 'noreply@lamieducoin.ca'}`);
    console.log(`🔑 API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);
    console.log('');
    
    // Initialiser Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Préparer un email de test
    const testEmail = {
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: 'darioboyer@gmail.com', // Email du compte Resend (requis pour le mode test)
        subject: 'Test - Configuration Resend - La Mie du Coin',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #8B4513;">🍞 Test Resend - La Mie du Coin</h1>
                <p>Ceci est un email de test pour vérifier la configuration Resend.</p>
                <p>Si vous recevez cet email, la configuration est correcte! ✅</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    Envoyé le ${new Date().toLocaleString('fr-CA')}<br>
                    Via Resend API
                </p>
            </body>
            </html>
        `,
        text: `Test Resend - La Mie du Coin\n\nCeci est un email de test pour vérifier la configuration Resend.\n\nSi vous recevez cet email, la configuration est correcte!`
    };
    
    console.log('📤 Tentative d\'envoi d\'un email de test...');
    console.log(`   To: ${testEmail.to}`);
    console.log(`   Subject: ${testEmail.subject}`);
    console.log('');
    
    try {
        const { data, error } = await resend.emails.send(testEmail);
        
        if (error) {
            console.error('❌ ERREUR lors de l\'envoi:', error);
            console.log('\n💡 Vérifications à faire:');
            console.log('   1. La clé API est-elle valide?');
            console.log('   2. Le domaine est-il vérifié dans Resend?');
            console.log('   3. L\'adresse FROM utilise-t-elle le domaine vérifié?');
            process.exit(1);
        }
        
        console.log('✅ EMAIL ENVOYÉ AVEC SUCCÈS!');
        console.log(`📬 Message ID: ${data.id}`);
        console.log('\n💡 Prochaines étapes:');
        console.log('   1. Vérifiez votre boîte email de test');
        console.log('   2. Consultez le tableau de bord Resend');
        console.log('   3. Si tout fonctionne, déployez sur Netlify!');
        
    } catch (err) {
        console.error('❌ ERREUR INATTENDUE:', err.message);
        console.error(err);
        process.exit(1);
    }
}

// Exécuter le test
testResend().catch(console.error);
