/**
 * Service de gestion des produits
 * Gère toutes les opérations CRUD pour la table Products
 */

import dbConnection from '../config/database.js';

class ProductService {
    constructor() {
        this.tableName = 'Products';
    }

    /**
     * Récupère tous les produits
     * @param {Object} filters - Filtres optionnels (category, available, etc.)
     * @returns {Promise<Array>} Liste des produits
     */
    async getAllProducts(filters = {}) {
        try {
            const client = dbConnection.getClient();
            let query = client.from(this.tableName).select('*');

            // Appliquer les filtres
            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.available !== undefined) {
                query = query.eq('available', filters.available);
            }
            if (filters.featured !== undefined) {
                query = query.eq('featured', filters.featured);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            // Trier par date de mise à jour
            query = query.order('updated_at', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('❌ Erreur Supabase:', error);
                throw error;
            }
            
            console.log('✅ Données reçues de Supabase:', data);
            return data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
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
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du produit avec le code ${code}:`, error);
            throw error;
        }
    }

    /**
     * Crée un nouveau produit
     * @param {Object} productData - Données du produit
     * @returns {Promise<Object>} Produit créé
     */
    async createProduct(productData) {
        try {
            const client = dbConnection.getClient();
            
            // Préparer les données avec valeurs par défaut
            const product = {
                code: productData.code || '',
                category: productData.category || 'pains-base',
                title_fr: productData.title_fr || '',
                title_en: productData.title_en || '',
                description_fr: productData.description_fr || '',
                description_en: productData.description_en || '',
                price: parseFloat(productData.price) || 0,
                currency: productData.currency || 'CDN',
                unit: productData.unit || 'loaf',
                icon: productData.icon || '🍞',
                image: productData.image || '/img/products/pain-blanc-classique.jpg',
                weight: parseFloat(productData.weight) || 0,
                weightUnit: productData.weightUnit || 'g',
                allergens: productData.allergens || [],
                ingredients: productData.ingredients || [],
                available: productData.available !== undefined ? productData.available : true,
                featured: productData.featured !== undefined ? productData.featured : false,
                inventoryQuantity: parseInt(productData.inventoryQuantity) || 0,
                productType: productData.productType || 'retail',
                status: productData.status || 'Active',
                updated_at: new Date().toISOString()
            };

            const { data, error } = await client
                .from(this.tableName)
                .insert([product])
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Produit créé avec succès:', data.code);
            return data;
        } catch (error) {
            console.error('Erreur lors de la création du produit:', error);
            throw error;
        }
    }

    /**
     * Met à jour un produit
     * @param {number} id - ID du produit
     * @param {Object} productData - Nouvelles données du produit
     * @returns {Promise<Object>} Produit mis à jour
     */
    async updateProduct(id, productData) {
        try {
            const client = dbConnection.getClient();
            
            // Ajouter la date de mise à jour
            const updatedData = {
                ...productData,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await client
                .from(this.tableName)
                .update(updatedData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Produit mis à jour avec succès:', data.code);
            return data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du produit #${id}:`, error);
            throw error;
        }
    }

    /**
     * Supprime un produit (soft delete en changeant le status)
     * @param {number} id - ID du produit
     * @returns {Promise<Object>} Produit supprimé
     */
    async deleteProduct(id) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.tableName)
                .update({ 
                    status: 'Deleted',
                    available: false,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Produit supprimé avec succès (soft delete)');
            return data;
        } catch (error) {
            console.error(`Erreur lors de la suppression du produit #${id}:`, error);
            throw error;
        }
    }

    /**
     * Supprime définitivement un produit (hard delete)
     * @param {number} id - ID du produit
     * @returns {Promise<boolean>} True si supprimé
     */
    async hardDeleteProduct(id) {
        try {
            const client = dbConnection.getClient();
            const { error } = await client
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log('✅ Produit supprimé définitivement');
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression définitive du produit #${id}:`, error);
            throw error;
        }
    }

    /**
     * Récupère les catégories distinctes
     * @returns {Promise<Array>} Liste des catégories
     */
    async getCategories() {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.tableName)
                .select('category')
                .neq('status', 'Deleted');

            if (error) throw error;
            
            // Extraire les catégories uniques
            const categories = [...new Set(data.map(item => item.category))];
            return categories.sort();
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            throw error;
        }
    }

    /**
     * Met à jour la quantité en inventaire
     * @param {number} id - ID du produit
     * @param {number} quantity - Nouvelle quantité
     * @returns {Promise<Object>} Produit mis à jour
     */
    async updateInventory(id, quantity) {
        try {
            return await this.updateProduct(id, { 
                inventoryQuantity: parseInt(quantity)
            });
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'inventaire du produit #${id}:`, error);
            throw error;
        }
    }
}

// Instance singleton
const productService = new ProductService();

export default productService;
