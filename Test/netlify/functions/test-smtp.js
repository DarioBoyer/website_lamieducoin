/**
 * Fonction Netlify pour tester la connexion SMTP
 * Endpoint: /.netlify/functions/test-smtp
 */

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parser la configuration SMTP
        let smtpConfig = {};
        
        if (event.body) {
            const payload = JSON.parse(event.body);
            smtpConfig = payload.smtpConfig || {};
        }

        // Utiliser les variables d'environnement par défaut
        const smtpHost = smtpConfig.host || process.env.SMTP_HOST;
        const smtpPort = smtpConfig.port || parseInt(process.env.SMTP_PORT || '587');
        const smtpUser = smtpConfig.user || process.env.SMTP_USER;
        const smtpPass = smtpConfig.pass || process.env.SMTP_PASS;

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Configuration SMTP incomplète'
                })
            };
        }

        // Créer le transporteur
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            }
        });

        // Tester la connexion
        await transporter.verify();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Connexion SMTP réussie',
                config: {
                    host: smtpHost,
                    port: smtpPort,
                    user: smtpUser,
                    secure: smtpPort === 465
                }
            })
        };

    } catch (error) {
        console.error('Erreur de test SMTP:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                code: error.code
            })
        };
    }
};
