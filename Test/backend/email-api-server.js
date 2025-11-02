/**
 * API Backend pour l'envoi d'emails via SMTP
 * Exemple avec Node.js + Express + Nodemailer
 * 
 * INSTALLATION REQUISE:
 * npm install express nodemailer cors body-parser
 * 
 * UTILISATION:
 * node email-api-server.js
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

/**
 * Endpoint pour envoyer un email
 * POST /api/send-email
 */
app.post('/api/send-email', async (req, res) => {
    try {
        const { smtp, email } = req.body;
        
        // Valider les données
        if (!smtp || !email) {
            return res.status(400).json({
                success: false,
                error: 'Configuration SMTP et données d\'email requises'
            });
        }
        
        console.log('📧 Réception d\'une demande d\'envoi d\'email...');
        console.log('📨 Destinataire:', email.to);
        console.log('📋 Sujet:', email.subject);
        
        // Créer le transporteur SMTP
        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure || false, // true pour 465, false pour 587
            auth: {
                user: smtp.auth.user,
                pass: smtp.auth.pass
            },
            tls: {
                // Ne pas échouer sur les certificats invalides (dev uniquement)
                rejectUnauthorized: false
            }
        });
        
        // Vérifier la connexion SMTP
        await transporter.verify();
        console.log('✅ Connexion SMTP vérifiée');
        
        // Préparer l'email
        const mailOptions = {
            from: `"La mie du coin" <${smtp.auth.user}>`,
            to: email.to,
            subject: email.subject,
            text: email.text,
            html: email.html,
            replyTo: email.replyTo || smtp.auth.user
        };
        
        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email envoyé avec succès');
        console.log('📬 Message ID:', info.messageId);
        
        res.json({
            success: true,
            messageId: info.messageId,
            response: info.response
        });
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.toString()
        });
    }
});

/**
 * Endpoint pour tester la connexion SMTP
 * POST /api/test-smtp
 */
app.post('/api/test-smtp', async (req, res) => {
    try {
        const { smtp } = req.body;
        
        if (!smtp) {
            return res.status(400).json({
                success: false,
                error: 'Configuration SMTP requise'
            });
        }
        
        console.log('🔧 Test de connexion SMTP...');
        
        // Créer le transporteur SMTP
        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure || false,
            auth: {
                user: smtp.auth.user,
                pass: smtp.auth.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        // Tester la connexion
        await transporter.verify();
        
        console.log('✅ Connexion SMTP réussie');
        
        res.json({
            success: true,
            message: 'Connexion SMTP réussie',
            server: smtp.host,
            port: smtp.port
        });
        
    } catch (error) {
        console.error('❌ Échec du test de connexion SMTP:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.toString()
        });
    }
});

/**
 * Endpoint de santé
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Email API',
        timestamp: new Date().toISOString()
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('📧 API d\'envoi d\'emails démarrée');
    console.log('='.repeat(60));
    console.log(`🌐 Serveur: http://localhost:${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   - POST /api/send-email    : Envoyer un email`);
    console.log(`   - POST /api/test-smtp     : Tester la connexion SMTP`);
    console.log(`   - GET  /api/health        : Vérifier le statut`);
    console.log('='.repeat(60));
    console.log('\n✅ Prêt à envoyer des emails!\n');
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesse rejetée non gérée:', reason);
});
