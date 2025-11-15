/**
 * Service d'envoi d'emails
 * Gère l'envoi de courriels de confirmation de commande
 * Note: L'envoi SMTP réel nécessite un backend (Node.js, PHP, etc.)
 * Ce service prépare les données et peut envoyer via une API
 */

class EmailService {
    constructor() {
        this.emailQueue = [];
        this.fromEmail = 'La Mie du Coin <noreply@lamieducoin.ca>';
        
        // Détection automatique de l'environnement
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // API Endpoint selon l'environnement
        this.apiEndpoint = isLocalhost 
            ? 'http://localhost:8888/.netlify/functions/send-email'  // Netlify Dev
            : '/.netlify/functions/send-email';                       // Netlify Production
        
        console.log('📧 EmailService initialisé avec Resend');
        console.log('🌐 Endpoint:', this.apiEndpoint);
    }

    /**
     * Initialise le service d'email
     */
    async initialize() {
        try {
            console.log('✅ Service d\'email initialisé (Resend)');
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du service d\'email:', error);
            return false;
        }
    }

    /**
     * Prépare l'email de confirmation de commande
     * @param {Object} orderData - Données de la commande
     * @returns {Object} Email préparé
     */
    prepareOrderConfirmationEmail(orderData) {
        const { order, lines, totalAmount, orderGuid } = orderData;
        
        // Déterminer la langue
        const lang = order.language?.toLowerCase() || 'fr';
        
        // Sujet de l'email
        const subject = lang === 'fr' 
            ? `Confirmation de commande #${order.id} - La mie du coin`
            : `Order confirmation #${order.id} - La mie du coin`;
        
        // Corps de l'email HTML
        const htmlBody = this.generateOrderConfirmationHtml(orderData, lang);
        
        // Corps de l'email texte brut (fallback)
        const textBody = this.generateOrderConfirmationText(orderData, lang);
        
        return {
            from: this.fromEmail,
            to: order.email,
            subject: subject,
            html: htmlBody,
            text: textBody,
            replyTo: 'contact@lamieducoin.ca'
        };
    }

    /**
     * Génère le corps HTML de l'email de confirmation
     * @param {Object} orderData - Données de la commande
     * @param {string} lang - Langue (fr/en)
     * @returns {string} HTML
     */
    generateOrderConfirmationHtml(orderData, lang) {
        const { order, lines, totalAmount, orderGuid } = orderData;
        
        const translations = {
            fr: {
                title: 'Confirmation de commande',
                greeting: 'Bonjour',
                thanks: 'Merci pour votre commande!',
                orderNumber: 'Numéro de commande',
                orderDate: 'Date de commande',
                deliveryDate: 'Date de livraison souhaitée',
                orderDetails: 'Détails de la commande',
                product: 'Produit',
                quantity: 'Quantité',
                price: 'Prix',
                total: 'Total',
                grandTotal: 'Total de la commande',
                note: 'Note',
                tracking: 'Suivre ma commande',
                footer: 'Nous vous remercions de votre confiance.',
                contact: 'Pour toute question, contactez-nous à',
                regards: 'Cordialement,',
                team: 'L\'équipe de La mie du coin'
            },
            en: {
                title: 'Order Confirmation',
                greeting: 'Hello',
                thanks: 'Thank you for your order!',
                orderNumber: 'Order number',
                orderDate: 'Order date',
                deliveryDate: 'Requested delivery date',
                orderDetails: 'Order details',
                product: 'Product',
                quantity: 'Quantity',
                price: 'Price',
                total: 'Total',
                grandTotal: 'Order total',
                note: 'Note',
                tracking: 'Track my order',
                footer: 'Thank you for your trust.',
                contact: 'For any questions, contact us at',
                regards: 'Best regards,',
                team: 'The La mie du coin team'
            }
        };
        
        const t = translations[lang];
        const customerName = `${order.customerFirstName} ${order.customerLastName}`;
        const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA');
        const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA') : '-';
        
        // Générer les lignes de produits
        let productsHtml = '';
        if (lines && lines.length > 0) {
            productsHtml = lines.map(line => `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">
                        ${line.Products?.icon || '🍞'} ${line.Products?.title_fr || 'Produit'}
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                        ${line.quantityOrdered}
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                        ${line.price.toFixed(2)} $
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
                        ${line.lineTotal.toFixed(2)} $
                    </td>
                </tr>
            `).join('');
        }
        
        return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 0;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🍞 La mie du coin</h1>
                            <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px;">${t.title}</p>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 30px 30px 20px;">
                            <h2 style="margin: 0 0 15px; color: #333; font-size: 22px;">${t.greeting} ${customerName},</h2>
                            <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">${t.thanks}</p>
                        </td>
                    </tr>
                    
                    <!-- Order Info -->
                    <tr>
                        <td style="padding: 0 30px 20px;">
                            <table style="width: 100%; background-color: #f8f9fa; border-radius: 6px; padding: 15px;">
                                <tr>
                                    <td style="padding: 8px; color: #666;">
                                        <strong>${t.orderNumber}:</strong> #${order.id}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; color: #666;">
                                        <strong>${t.orderDate}:</strong> ${orderDate}
                                    </td>
                                </tr>
                                ${order.deliveryDate ? `
                                <tr>
                                    <td style="padding: 8px; color: #666;">
                                        <strong>${t.deliveryDate}:</strong> ${deliveryDate}
                                    </td>
                                </tr>
                                ` : ''}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 0 30px 20px;">
                            <h3 style="margin: 0 0 15px; color: #333; font-size: 18px;">${t.orderDetails}</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #f8f9fa;">
                                        <th style="padding: 12px; text-align: left; color: #666; font-weight: 600;">${t.product}</th>
                                        <th style="padding: 12px; text-align: center; color: #666; font-weight: 600;">${t.quantity}</th>
                                        <th style="padding: 12px; text-align: right; color: #666; font-weight: 600;">${t.price}</th>
                                        <th style="padding: 12px; text-align: right; color: #666; font-weight: 600;">${t.total}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productsHtml}
                                    <tr style="background-color: #f8f9fa;">
                                        <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px; color: #333;">
                                            ${t.grandTotal}:
                                        </td>
                                        <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #8B4513;">
                                            ${totalAmount.toFixed(2)} $
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Note -->
                    ${order.orderNote ? `
                    <tr>
                        <td style="padding: 0 30px 20px;">
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                                <strong style="color: #856404;">${t.note}:</strong>
                                <p style="margin: 5px 0 0; color: #856404;">${order.orderNote}</p>
                            </div>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 20px 30px; text-align: center;">
                            <a href="http://localhost:8000/pages/suivi-commande.html?order=${orderGuid}" 
                               style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                ${t.tracking}
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; text-align: center;">
                            <p style="margin: 0 0 10px; color: #666; font-size: 14px;">${t.footer}</p>
                            <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
                                ${t.contact} <a href="mailto:contact@lamieducoin.ca" style="color: #8B4513; text-decoration: none;">contact@lamieducoin.ca</a>
                            </p>
                            <p style="margin: 0; color: #999; font-size: 12px;">
                                ${t.regards}<br>
                                <strong>${t.team}</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;
    }

    /**
     * Génère le corps texte brut de l'email de confirmation
     * @param {Object} orderData - Données de la commande
     * @param {string} lang - Langue (fr/en)
     * @returns {string} Texte brut
     */
    generateOrderConfirmationText(orderData, lang) {
        const { order, lines, totalAmount, orderGuid } = orderData;
        
        const translations = {
            fr: {
                title: 'CONFIRMATION DE COMMANDE',
                greeting: 'Bonjour',
                thanks: 'Merci pour votre commande!',
                orderNumber: 'Numéro de commande',
                orderDate: 'Date de commande',
                deliveryDate: 'Date de livraison souhaitée',
                orderDetails: 'DÉTAILS DE LA COMMANDE',
                total: 'TOTAL',
                note: 'Note',
                tracking: 'Suivre votre commande',
                footer: 'Nous vous remercions de votre confiance.',
                contact: 'Pour toute question, contactez-nous à',
                regards: 'Cordialement,',
                team: 'L\'équipe de La mie du coin'
            },
            en: {
                title: 'ORDER CONFIRMATION',
                greeting: 'Hello',
                thanks: 'Thank you for your order!',
                orderNumber: 'Order number',
                orderDate: 'Order date',
                deliveryDate: 'Requested delivery date',
                orderDetails: 'ORDER DETAILS',
                total: 'TOTAL',
                note: 'Note',
                tracking: 'Track your order',
                footer: 'Thank you for your trust.',
                contact: 'For any questions, contact us at',
                regards: 'Best regards,',
                team: 'The La mie du coin team'
            }
        };
        
        const t = translations[lang];
        const customerName = `${order.customerFirstName} ${order.customerLastName}`;
        const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA');
        const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA') : '-';
        
        let text = `
========================================
🍞 LA MIE DU COIN
${t.title}
========================================

${t.greeting} ${customerName},

${t.thanks}

${t.orderNumber}: #${order.id}
${t.orderDate}: ${orderDate}
${order.deliveryDate ? `${t.deliveryDate}: ${deliveryDate}` : ''}

----------------------------------------
${t.orderDetails}
----------------------------------------
`;

        if (lines && lines.length > 0) {
            lines.forEach(line => {
                const productName = line.Products?.title_fr || 'Produit';
                const icon = line.Products?.icon || '🍞';
                text += `\n${icon} ${productName}\n`;
                text += `  Quantité: ${line.quantityOrdered} × ${line.price.toFixed(2)} $ = ${line.lineTotal.toFixed(2)} $\n`;
            });
        }

        text += `\n----------------------------------------\n`;
        text += `${t.total}: ${totalAmount.toFixed(2)} $\n`;
        text += `========================================\n\n`;

        if (order.orderNote) {
            text += `${t.note}: ${order.orderNote}\n\n`;
        }

        text += `${t.tracking}:\n`;
        text += `http://localhost:8000/pages/suivi-commande.html?order=${orderGuid}\n\n`;
        text += `${t.footer}\n`;
        text += `${t.contact} contact@lamieducoin.ca\n\n`;
        text += `${t.regards}\n`;
        text += `${t.team}\n`;

        return text;
    }

    /**
     * Envoie un email de confirmation de commande
     * Note: Cette fonction prépare l'email et simule l'envoi
     * En production, elle devrait appeler une API backend qui utilise nodemailer
     * 
     * @param {Object} orderData - Données de la commande
     * @returns {Promise<boolean>} Succès de l'envoi
     */
    async sendOrderConfirmation(orderData) {
        try {
            // Préparer l'email
            const emailData = this.prepareOrderConfirmationEmail(orderData);
            
            console.log('📧 Préparation de l\'email de confirmation...');
            console.log('📨 Destinataire:', emailData.to);
            console.log('📋 Sujet:', emailData.subject);
            
            // Envoyer via l'API Netlify Functions (Resend)
            try {
                const response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailData
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    console.log('✅ Email envoyé via Resend');
                    console.log('📬 Message ID:', result.messageId);
                    console.log('🕐 Timestamp:', result.timestamp);
                    
                    this.emailQueue.push({
                        timestamp: new Date(),
                        to: emailData.to,
                        subject: emailData.subject,
                        status: 'sent',
                        messageId: result.messageId
                    });
                    
                    return true;
                } else {
                    throw new Error(result.error || 'Erreur inconnue');
                }
                
            } catch (apiError) {
                console.error('❌ Erreur lors de l\'envoi via Resend:', apiError.message);
                console.log('💡 Vérifiez que:');
                console.log('   1. Netlify Dev est démarré: npm run dev');
                console.log('   2. La variable RESEND_API_KEY est configurée dans Netlify');
                console.log('   3. Le domaine d\'envoi est vérifié dans Resend');
                
                // Ne pas faire de simulation, retourner l'erreur
                throw apiError;
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
            return false;
        }
    }

    /**
     * Obtient la file d'attente des emails (pour debug)
     * @returns {Array} Liste des emails envoyés
     */
    getEmailQueue() {
        return this.emailQueue;
    }
}

// Instance singleton
const emailService = new EmailService();

export default emailService;
