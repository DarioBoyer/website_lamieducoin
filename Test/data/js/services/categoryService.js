/**
 * Service de gestion des catégories - Version publique
 * Gère la récupération des catégories de produits pour les clients
 */

import dbConnection from '../config/database.js';

class CategoryService {
    constructor() {
        this.tableName = 'BreadCategory';
    }

    /**
     * Récupère toutes les catégories
     * @returns {Promise<Array>} Liste des catégories
     */
    async getAllCategories() {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.tableName)
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error('❌ Erreur Supabase lors de la récupération des catégories:', error);
                throw error;
            }
            
            console.log('✅ Catégories reçues de Supabase:', data?.length || 0, 'catégories');
            return data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            throw error;
        }
    }

    /**
     * Récupère une catégorie par son ID
     * @param {string} id - ID de la catégorie
     * @returns {Promise<Object>} Catégorie
     */
    async getCategoryById(id) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
            throw error;
        }
    }
}

// Instance singleton
const categoryService = new CategoryService();

export default categoryService;
