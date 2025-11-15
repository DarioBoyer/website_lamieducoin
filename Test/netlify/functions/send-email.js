/**
 * Fonction Netlify Serverless pour l'envoi d'emails via Resend
 * Endpoint: /.netlify/functions/send-email
 */

const { Resend } = require('resend');

/**
 * Handler principal de la fonction Netlify
 */
exports.handler = async (event, context) => {
    // Configuration CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Gérer les requêtes OPTIONS (preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'OK' })
        };
    }

    // Accepter uniquement POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parser le body de la requête
        const payload = JSON.parse(event.body);
        const { email } = payload;

        // Validation des données requises
        if (!email || !email.to || !email.subject || !email.html) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Paramètres manquants',
                    required: ['email.to', 'email.subject', 'email.html']
                })
            };
        }

        // Récupérer la clé API Resend depuis les variables d'environnement
        const resendApiKey = process.env.RESEND_API_KEY;
        
        if (!resendApiKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Configuration Resend incomplète',
                    details: 'La clé API Resend (RESEND_API_KEY) n\'est pas configurée dans les variables d\'environnement Netlify'
                })
            };
        }

        // Initialiser le client Resend
        const resend = new Resend(resendApiKey);

        // Préparer l'adresse d'expéditeur
        // Resend nécessite un domaine vérifié pour l'expéditeur
        const fromEmail = email.from || process.env.RESEND_FROM_EMAIL || 'La Mie du Coin <noreply@lamieducoin.ca>';

        console.log('📧 Envoi via Resend:', {
            to: email.to,
            from: fromEmail,
            subject: email.subject
        });

        // Préparer les données de l'email pour Resend
        const emailData = {
            from: fromEmail,
            to: Array.isArray(email.to) ? email.to : [email.to],
            subject: email.subject,
            html: email.html
        };

        // Ajouter le texte brut si présent
        if (email.text) {
            emailData.text = email.text;
        }

        // Ajouter CC si présent
        if (email.cc) {
            emailData.cc = Array.isArray(email.cc) ? email.cc : [email.cc];
        }

        // Ajouter BCC si présent
        if (email.bcc) {
            emailData.bcc = Array.isArray(email.bcc) ? email.bcc : [email.bcc];
        }

        // Ajouter reply-to si présent
        if (email.replyTo) {
            emailData.reply_to = Array.isArray(email.replyTo) ? email.replyTo : [email.replyTo];
        }

        // Ajouter les pièces jointes si présentes
        if (email.attachments && email.attachments.length > 0) {
            emailData.attachments = email.attachments.map(att => ({
                filename: att.filename,
                content: att.content
            }));
        }

        // Envoyer l'email via Resend
        const { data, error } = await resend.emails.send(emailData);

        if (error) {
            console.error('❌ Erreur Resend:', error);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: error.message || 'Erreur lors de l\'envoi de l\'email',
                    details: error
                })
            };
        }

        console.log('✅ Email envoyé via Resend:', data.id);

        // Retourner le succès
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                messageId: data.id,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);

        // Déterminer le code d'erreur approprié
        let statusCode = 500;
        let errorMessage = error.message || 'Erreur interne du serveur';

        // Gestion des erreurs spécifiques Resend
        if (error.statusCode) {
            statusCode = error.statusCode;
        }

        if (error.name === 'validation_error') {
            statusCode = 400;
            errorMessage = 'Erreur de validation des données de l\'email';
        }

        return {
            statusCode,
            headers,
            body: JSON.stringify({
                success: false,
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
