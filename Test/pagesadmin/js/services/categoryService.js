/**
 * Service de gestion des catégories de pain
 * Gère toutes les opérations CRUD pour la table BreadCategory
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
            
            console.log('✅ Catégories reçues de Supabase:', data);
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

    /**
     * Crée une nouvelle catégorie
     * @param {Object} categoryData - Données de la catégorie
     * @returns {Promise<Object>} Catégorie créée
     */
    async createCategory(categoryData) {
        try {
            const client = dbConnection.getClient();
            
            const category = {
                id: categoryData.id || '',
                NameFR: categoryData.NameFR || '',
                NameEN: categoryData.NameEN || '',
                DescriptionFR: categoryData.DescriptionFR || '',
                DescriptionEN: categoryData.DescriptionEN || '',
                icon: categoryData.icon || '🍞'
            };

            const { data, error } = await client
                .from(this.tableName)
                .insert([category])
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Catégorie créée:', data.id);
            return data;
        } catch (error) {
            console.error('Erreur lors de la création de la catégorie:', error);
            throw error;
        }
    }

    /**
     * Met à jour une catégorie
     * @param {string} id - ID de la catégorie
     * @param {Object} categoryData - Nouvelles données
     * @returns {Promise<Object>} Catégorie mise à jour
     */
    async updateCategory(id, categoryData) {
        try {
            const client = dbConnection.getClient();
            
            const { data, error } = await client
                .from(this.tableName)
                .update(categoryData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Catégorie mise à jour:', data.id);
            return data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la catégorie ${id}:`, error);
            throw error;
        }
    }

    /**
     * Supprime une catégorie
     * @param {string} id - ID de la catégorie
     * @returns {Promise<boolean>} True si supprimée
     */
    async deleteCategory(id) {
        try {
            const client = dbConnection.getClient();
            const { error } = await client
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log('✅ Catégorie supprimée');
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression de la catégorie ${id}:`, error);
            throw error;
        }
    }
}

// Instance singleton
const categoryService = new CategoryService();

export default categoryService;
