/**
 * Fonction Netlify pour tester la configuration Resend
 * Endpoint: /.netlify/functions/test-resend
 */

const { Resend } = require('resend');

exports.handler = async (event, context) => {
    // Configuration CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    try {
        // Récupérer la clé API Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'La Mie du Coin <noreply@lamieducoin.ca>';
        
        // Vérifier la configuration
        const config = {
            apiKeyConfigured: !!resendApiKey,
            fromEmail: fromEmail,
            apiKeyPreview: resendApiKey ? resendApiKey.substring(0, 10) + '...' : 'Non configuré'
        };
        
        console.log('🔍 Test de configuration Resend:', config);
        
        if (!resendApiKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Configuration Resend manquante',
                    details: 'La clé API Resend (RESEND_API_KEY) n\'est pas configurée',
                    config: config
                })
            };
        }
        
        // Initialiser le client Resend
        const resend = new Resend(resendApiKey);
        
        // Pour un vrai test d'envoi, il faudrait un paramètre avec l'email de destination
        // Ici, on retourne juste la configuration
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Configuration Resend valide',
                config: config,
                info: {
                    service: 'Resend',
                    ready: true,
                    timestamp: new Date().toISOString()
                }
            })
        };
        
    } catch (error) {
        console.error('❌ Erreur lors du test Resend:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
