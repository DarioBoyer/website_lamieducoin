/**
 * Fonction Netlify pour obtenir les paramètres SMTP depuis Supabase
 * Cette fonction utilise les variables d'environnement Netlify de manière sécurisée
 * Endpoint: /.netlify/functions/get-smtp-config
 */

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Retourner la configuration SMTP depuis les variables d'environnement
        // Sans exposer les mots de passe
        const config = {
            smtp: process.env.SMTP_HOST || null,
            port: parseInt(process.env.SMTP_PORT || '587'),
            from: process.env.SMTP_FROM || null,
            configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                config
            })
        };

    } catch (error) {
        console.error('Erreur:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
