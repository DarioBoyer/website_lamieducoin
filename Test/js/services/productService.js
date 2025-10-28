/**
 * Service de gestion des produits - Version publique
 * Gère la récupération des produits disponibles pour les clients
 */

import dbConnection from '../config/database.js';

class ProductService {
    constructor() {
        this.tableName = 'Products';
    }

    /**
     * Récupère tous les produits disponibles pour les clients
     * @param {Object} filters - Filtres optionnels (category, featured, etc.)
     * @returns {Promise<Array>} Liste des produits
     */
    async getAllProducts(filters = {}) {
        try {
            const client = dbConnection.getClient();
            let query = client.from(this.tableName)
                .select('*')
                .eq('status', 'Active')  // Seulement les produits actifs
                .eq('available', true);   // Seulement les produits disponibles

            // Appliquer les filtres
            if (filters.categoryId) {
                query = query.eq('categoryId', filters.categoryId);
            }
            if (filters.featured !== undefined) {
                query = query.eq('featured', filters.featured);
            }

            // Trier par ordre : featured d'abord, puis par titre
            query = query.order('featured', { ascending: false })
                        .order('title_fr', { ascending: true });

            const { data, error } = await query;

            if (error) {
                console.error('❌ Erreur Supabase:', error);
                throw error;
            }
            
            console.log('✅ Produits reçus de Supabase:', data?.length || 0, 'produits');
            return data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            throw error;
        }
    }

    /**
     * Récupère les produits vedettes
     * @returns {Promise<Array>} Liste des produits vedettes
     */
    async getFeaturedProducts() {
        try {
            return await this.getAllProducts({ featured: true });
        } catch (error) {
            console.error('Erreur lors de la récupération des produits vedettes:', error);
            throw error;
        }
    }

    /**
     * Récupère les produits d'une catégorie spécifique
     * @param {string} categoryId - ID de la catégorie
     * @returns {Promise<Array>} Liste des produits
     */
    async getProductsByCategory(categoryId) {
        try {
            return await this.getAllProducts({ categoryId });
        } catch (error) {
            console.error(`Erreur lors de la récupération des produits de la catégorie ${categoryId}:`, error);
            throw error;
        }
    }

    /**
     * Récupère un produit par son ID
     * @param {number} id - ID du produit
     * @returns {Promise<Object>} Produit
     */
    async getProductById(id) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .eq('status', 'Active')
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du produit #${id}:`, error);
            throw error;
        }
    }

    /**
     * Récupère un produit par son code
     * @param {string} code - Code du produit
     * @returns {Promise<Object>} Produit
     */
    async getProductByCode(code) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.tableName)
                .select('*')
                .eq('code', code)
                .eq('status', 'Active')
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du produit avec le code ${code}:`, error);
            throw error;
        }
    }
}

// Instance singleton
const productService = new ProductService();

export default productService;
