/**
 * Configuration de la base de données Supabase
 * Version pour l'interface publique
 */

// Configuration de connexion Supabase
const DB_CONFIG = {
    url: 'https://mtuimnyoimiqhuyidyjv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dWltbnlvaW1pcWh1eWlkeWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjc3NjksImV4cCI6MjA3Njg0Mzc2OX0.SuB-0Kwaakff6pbZhKgWbGaAfL9h_NWaRBR9rNnaMIw',
    options: {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
};

class DatabaseConnection {
    constructor() {
        this.client = null;
        this.initialized = false;
    }

    /**
     * Initialise la connexion Supabase
     */
    async init() {
        if (this.initialized) {
            return this.client;
        }

        try {
            // Vérifier que la bibliothèque Supabase est chargée
            if (typeof supabase === 'undefined') {
                throw new Error('La bibliothèque Supabase n\'est pas chargée. Assurez-vous d\'inclure le script Supabase.');
            }

            // Créer le client Supabase
            this.client = supabase.createClient(DB_CONFIG.url, DB_CONFIG.anonKey, DB_CONFIG.options);
            this.initialized = true;

            console.log('✅ Connexion à Supabase établie');
            return this.client;
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de Supabase:', error);
            throw error;
        }
    }

    /**
     * Retourne le client Supabase
     */
    getClient() {
        if (!this.initialized) {
            throw new Error('La connexion à la base de données n\'est pas initialisée. Appelez init() d\'abord.');
        }
        return this.client;
    }

    /**
     * Vérifie l'état de la connexion
     */
    async checkConnection() {
        try {
            const { data, error } = await this.client
                .from('Products')
                .select('count')
                .limit(1);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return false;
        }
    }
}

// Instance singleton
const dbConnection = new DatabaseConnection();

// Exporter pour utilisation dans d'autres modules
export default dbConnection;
