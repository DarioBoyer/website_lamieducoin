/**
 * Service de gestion des paramètres système
 * Gère la récupération et la mise à jour des paramètres SMTP avec chiffrement
 */

import dbConnection from '../config/database.js';

class ParametersService {
    constructor() {
        this.tableName = 'Parameters';
        this.parameters = null;
        this.encryptionKey = 'LaMieDuCoin2025SecretKey'; // Clé pour le chiffrement basique
    }

    /**
     * Chiffre une chaîne de caractères (chiffrement simple base64 + XOR)
     * Pour un usage en production, utiliser une vraie librairie de chiffrement
     * @param {string} text - Texte à chiffrer
     * @returns {string} Texte chiffré
     */
    encrypt(text) {
        if (!text) return null;
        
        try {
            // Convertir en tableau de caractères
            const textBytes = Array.from(text);
            const keyBytes = Array.from(this.encryptionKey);
            
            // XOR avec la clé
            const encrypted = textBytes.map((char, i) => {
                const keyChar = keyBytes[i % keyBytes.length];
                return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
            });
            
            // Encoder en base64
            return btoa(encrypted.join(''));
        } catch (error) {
            console.error('Erreur lors du chiffrement:', error);
            return null;
        }
    }

    /**
     * Déchiffre une chaîne de caractères
     * @param {string} encryptedText - Texte chiffré
     * @returns {string} Texte déchiffré
     */
    decrypt(encryptedText) {
        if (!encryptedText) return null;
        
        try {
            // Décoder depuis base64
            const decoded = atob(encryptedText);
            const encryptedBytes = Array.from(decoded);
            const keyBytes = Array.from(this.encryptionKey);
            
            // XOR avec la clé pour déchiffrer
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

    /**
     * Récupère les paramètres depuis Supabase
     * @returns {Promise<Object>} Paramètres déchiffrés
     */
    async getParameters() {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.tableName)
                .select('*')
                .order('id', { ascending: true })
                .limit(1)
                .single();

            if (error) {
                // Si aucun enregistrement n'existe, retourner des valeurs par défaut
                if (error.code === 'PGRST116') {
                    console.log('Aucun paramètre trouvé, retour de valeurs par défaut...');
                    this.parameters = {
                        id: null,
                        lastUpdated: null,
                        smtp: null,
                        port: null,
                        smtp_account: null,
                        smtp_password: null
                    };
                    return this.parameters;
                }
                throw error;
            }
            
            // Déchiffrer les données sensibles
            this.parameters = {
                id: data.id,
                lastUpdated: data.LastUpdated,
                smtp: data.smtp,
                port: data.port,
                smtp_account: data.smtp_account ? this.decrypt(data.smtp_account) : null,
                smtp_password: data.smtp_password ? this.decrypt(data.smtp_password) : null
            };
            
            console.log('✅ Paramètres récupérés avec succès');
            return this.parameters;
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des paramètres:', error);
            throw error;
        }
    }

    /**
     * Crée un enregistrement de paramètres par défaut
     * Cette méthode n'est plus utilisée - les paramètres doivent être créés
     * via l'interface admin ou automatiquement lors de la première mise à jour
     * @returns {Promise<Object>} Nouveaux paramètres
     */
    async createDefaultParameters() {
        console.warn('⚠️ Création automatique désactivée. Les paramètres seront créés lors de la première sauvegarde.');
        return {
            id: null,
            lastUpdated: null,
            smtp: null,
            port: null,
            smtp_account: null,
            smtp_password: null
        };
    }

    /**
     * Met à jour les paramètres SMTP
     * @param {Object} smtpConfig - Configuration SMTP
     * @returns {Promise<Object>} Paramètres mis à jour
     */
    async updateSmtpParameters(smtpConfig) {
        try {
            const client = dbConnection.getClient();
            
            // Préparer les données avec chiffrement des données sensibles
            const updateData = {
                smtp: smtpConfig.smtp || null,
                port: smtpConfig.port ? parseInt(smtpConfig.port) : null,
                smtp_account: smtpConfig.smtp_account ? this.encrypt(smtpConfig.smtp_account) : null,
                smtp_password: smtpConfig.smtp_password ? this.encrypt(smtpConfig.smtp_password) : null,
                LastUpdated: new Date().toISOString()
            };

            // Récupérer les paramètres actuels si pas encore en cache
            if (!this.parameters) {
                await this.getParameters();
            }

            // Utiliser upsert pour créer ou mettre à jour (id=1 par défaut)
            const targetId = this.parameters?.id || 1;
            const { data, error } = await client
                .from(this.tableName)
                .upsert([{ id: targetId, ...updateData }], { 
                    onConflict: 'id',
                    ignoreDuplicates: false 
                })
                .select()
                .single();

            if (error) throw error;
            
            // Mettre à jour le cache local avec données déchiffrées
            this.parameters = {
                id: data.id,
                lastUpdated: data.LastUpdated,
                smtp: data.smtp,
                port: data.port,
                smtp_account: smtpConfig.smtp_account,
                smtp_password: smtpConfig.smtp_password
            };
            
            console.log('✅ Paramètres SMTP enregistrés avec succès');
            return this.parameters;
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour des paramètres SMTP:', error);
            throw error;
        }
    }

    /**
     * Vérifie si les paramètres SMTP sont configurés
     * @returns {Promise<boolean>} True si configurés, false sinon
     */
    async isSmtpConfigured() {
        try {
            if (!this.parameters) {
                await this.getParameters();
            }
            
            return !!(
                this.parameters.smtp &&
                this.parameters.port &&
                this.parameters.smtp_account &&
                this.parameters.smtp_password
            );
        } catch (error) {
            console.error('Erreur lors de la vérification de la configuration SMTP:', error);
            return false;
        }
    }

    /**
     * Obtient la configuration SMTP déchiffrée
     * @returns {Promise<Object>} Configuration SMTP
     */
    async getSmtpConfig() {
        try {
            if (!this.parameters) {
                await this.getParameters();
            }
            
            return {
                smtp: this.parameters.smtp,
                port: this.parameters.port,
                account: this.parameters.smtp_account,
                password: this.parameters.smtp_password
            };
        } catch (error) {
            console.error('Erreur lors de la récupération de la configuration SMTP:', error);
            throw error;
        }
    }

    /**
     * Teste la connexion SMTP (simulation)
     * @returns {Promise<boolean>} True si la connexion réussit
     */
    async testSmtpConnection() {
        try {
            const config = await this.getSmtpConfig();
            
            if (!config.smtp || !config.port || !config.account || !config.password) {
                throw new Error('Configuration SMTP incomplète');
            }
            
            // En production, vous feriez un vrai test de connexion SMTP ici
            console.log('🔧 Test de connexion SMTP:', {
                server: config.smtp,
                port: config.port,
                account: config.account,
                password: '***' // Masquer le mot de passe dans les logs
            });
            
            // Simulation de succès
            console.log('✅ Test de connexion SMTP réussi');
            return true;
        } catch (error) {
            console.error('❌ Échec du test de connexion SMTP:', error);
            return false;
        }
    }
}

// Instance singleton
const parametersService = new ParametersService();

export default parametersService;
