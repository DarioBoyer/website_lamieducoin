/**
 * Fonction Netlify Serverless pour l'envoi d'emails via SMTP
 * Endpoint: /.netlify/functions/send-email
 */

const nodemailer = require('nodemailer');

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
        const { email, smtpConfig } = payload;

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

        // Configuration SMTP (priorité: paramètres envoyés > variables d'environnement)
        const smtpHost = smtpConfig?.host || process.env.SMTP_HOST;
        const smtpPort = smtpConfig?.port || parseInt(process.env.SMTP_PORT || '587');
        const smtpUser = smtpConfig?.user || process.env.SMTP_USER;
        const smtpPass = smtpConfig?.pass || process.env.SMTP_PASS;
        const smtpFrom = email.from || process.env.SMTP_FROM || `La Mie du Coin <${smtpUser}>`;

        // Validation de la configuration SMTP
        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Configuration SMTP incomplète',
                    details: 'Vérifiez les variables d\'environnement Netlify'
                })
            };
        }

        console.log('📧 Configuration SMTP:', {
            host: smtpHost,
            port: smtpPort,
            user: smtpUser,
            secure: smtpPort === 465
        });

        // Créer le transporteur SMTP
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true pour port 465, false pour autres (TLS)
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            }
        });

        // Vérifier la connexion SMTP
        await transporter.verify();
        console.log('✅ Connexion SMTP vérifiée');

        // Préparer les options de l'email
        const mailOptions = {
            from: smtpFrom,
            to: email.to,
            subject: email.subject,
            html: email.html,
            text: email.text || '', // Version texte optionnelle
            attachments: email.attachments || []
        };

        // Ajouter CC/BCC si présents
        if (email.cc) mailOptions.cc = email.cc;
        if (email.bcc) mailOptions.bcc = email.bcc;

        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email envoyé:', info.messageId);

        // Retourner le succès
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                messageId: info.messageId,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);

        // Déterminer le code d'erreur approprié
        let statusCode = 500;
        let errorMessage = error.message;

        if (error.code === 'EAUTH') {
            statusCode = 401;
            errorMessage = 'Authentification SMTP échouée. Vérifiez les identifiants.';
        } else if (error.code === 'ECONNECTION') {
            statusCode = 503;
            errorMessage = 'Impossible de se connecter au serveur SMTP.';
        } else if (error.code === 'ETIMEDOUT') {
            statusCode = 504;
            errorMessage = 'Délai d\'attente dépassé lors de la connexion SMTP.';
        }

        return {
            statusCode,
            headers,
            body: JSON.stringify({
                success: false,
                error: errorMessage,
                code: error.code,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
