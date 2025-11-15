/**
 * Script de test pour vérifier l'envoi d'email lors d'une commande
 * Simule une commande complète et envoie un email de confirmation
 */

require('dotenv').config();
const fetch = require('node-fetch');

async function testEmailCommande() {
    console.log('🧪 Test d\'envoi d\'email de confirmation de commande\n');
    
    // Données de commande simulées
    const commandeTest = {
        order: {
            id: 123,
            customerFirstName: 'Dario',
            customerLastName: 'Boyer',
            email: 'darioboyer@gmail.com',
            orderNote: 'Test de confirmation de commande',
            deliveryDate: '2025-11-17',
            language: 'fr',
            created_at: new Date().toISOString()
        },
        lines: [
            {
                Products: {
                    title_fr: 'Pain au levain',
                    icon: '🍞'
                },
                quantityOrdered: 2,
                price: 5.50,
                lineTotal: 11.00
            },
            {
                Products: {
                    title_fr: 'Croissants',
                    icon: '🥐'
                },
                quantityOrdered: 6,
                price: 2.25,
                lineTotal: 13.50
            }
        ],
        totalAmount: 24.50,
        orderGuid: 'test-' + Date.now()
    };
    
    console.log('📦 Commande de test:');
    console.log(`   Client: ${commandeTest.order.customerFirstName} ${commandeTest.order.customerLastName}`);
    console.log(`   Email: ${commandeTest.order.email}`);
    console.log(`   Total: ${commandeTest.totalAmount.toFixed(2)} $`);
    console.log('');
    
    // Préparer l'email HTML
    const htmlEmail = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Confirmation de commande</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🍞 La Mie du Coin</h1>
                <p style="margin: 10px 0 0; color: #ffffff;">Confirmation de commande</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <h2 style="color: #333;">Bonjour ${commandeTest.order.customerFirstName},</h2>
                <p>Merci pour votre commande!</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0;">
                    <strong>Numéro de commande:</strong> #${commandeTest.order.id}<br>
                    <strong>Date:</strong> ${new Date(commandeTest.order.created_at).toLocaleDateString('fr-CA')}<br>
                    ${commandeTest.order.deliveryDate ? `<strong>Livraison:</strong> ${new Date(commandeTest.order.deliveryDate).toLocaleDateString('fr-CA')}<br>` : ''}
                </div>
                
                <h3>Détails de la commande</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 10px; text-align: left;">Produit</th>
                            <th style="padding: 10px; text-align: center;">Qté</th>
                            <th style="padding: 10px; text-align: right;">Prix</th>
                            <th style="padding: 10px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${commandeTest.lines.map(line => `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${line.Products.icon} ${line.Products.title_fr}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${line.quantityOrdered}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${line.price.toFixed(2)} $</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${line.lineTotal.toFixed(2)} $</td>
                            </tr>
                        `).join('')}
                        <tr style="background-color: #f8f9fa;">
                            <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold;">Total:</td>
                            <td style="padding: 15px; text-align: right; font-weight: bold; color: #8B4513; font-size: 18px;">${commandeTest.totalAmount.toFixed(2)} $</td>
                        </tr>
                    </tbody>
                </table>
                
                ${commandeTest.order.orderNote ? `
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                    <strong>Note:</strong> ${commandeTest.order.orderNote}
                </div>
                ` : ''}
                
                <p style="margin-top: 30px;">Nous vous remercions de votre confiance.</p>
                <p style="color: #666;">L'équipe de La Mie du Coin</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f8f9fa; text-align: center; color: #666; font-size: 12px;">
                Pour toute question, contactez-nous à contact@lamieducoin.ca
            </td>
        </tr>
    </table>
</body>
</html>
    `;
    
    // Données pour l'API Netlify
    const emailData = {
        email: {
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: commandeTest.order.email,
            subject: `Confirmation de commande #${commandeTest.order.id} - La Mie du Coin`,
            html: htmlEmail,
            text: `Confirmation de commande #${commandeTest.order.id}\n\nMerci pour votre commande!\n\nTotal: ${commandeTest.totalAmount.toFixed(2)} $`
        }
    };
    
    console.log('📧 Envoi de l\'email via Netlify Functions...');
    console.log(`   From: ${emailData.email.from}`);
    console.log(`   To: ${emailData.email.to}`);
    console.log(`   Subject: ${emailData.email.subject}`);
    console.log('');
    
    try {
        // Appeler la fonction Netlify localement
        const response = await fetch('http://localhost:8888/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ EMAIL ENVOYÉ AVEC SUCCÈS!');
            console.log(`📬 Message ID: ${result.messageId}`);
            console.log(`🕐 Timestamp: ${result.timestamp}`);
            console.log('');
            console.log('💡 Vérifiez votre boîte email: darioboyer@gmail.com');
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('✨ Le système d\'envoi d\'emails fonctionne!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        } else {
            console.error('❌ ERREUR:', result.error);
            if (result.details) {
                console.error('Détails:', result.details);
            }
        }
        
    } catch (error) {
        console.error('❌ ERREUR lors de l\'appel à la fonction Netlify:', error.message);
        console.log('');
        console.log('💡 Assurez-vous que Netlify Dev est démarré:');
        console.log('   npm run dev');
        console.log('');
        console.log('   Puis relancez ce script dans un autre terminal.');
    }
}

// Exécuter le test
testEmailCommande().catch(console.error);
