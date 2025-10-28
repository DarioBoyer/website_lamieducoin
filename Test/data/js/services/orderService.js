/**
 * Service de gestion des commandes
 * Gère toutes les opérations CRUD pour les tables Orders et OrdersLines
 */

import dbConnection from '../config/database.js';

class OrderService {
    constructor() {
        this.ordersTable = 'Orders';
        this.ordersLinesTable = 'OrdersLines';
    }

    /**
     * Récupère toutes les commandes
     * @param {Object} filters - Filtres optionnels (status, date, etc.)
     * @returns {Promise<Array>} Liste des commandes
     */
    async getAllOrders(filters = {}) {
        try {
            const client = dbConnection.getClient();
            let query = client.from(this.ordersTable).select('*');

            // Appliquer les filtres
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.paid !== undefined) {
                query = query.eq('paid', filters.paid);
            }
            if (filters.scheduledOn) {
                query = query.eq('scheduledOn', filters.scheduledOn);
            }
            if (filters.deliveryDate) {
                query = query.eq('deliveryDate', filters.deliveryDate);
            }
            if (filters.language) {
                query = query.eq('language', filters.language);
            }

            // Trier par date de création (plus récent en premier)
            query = query.order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('❌ Erreur Supabase:', error);
                throw error;
            }
            
            console.log('✅ Commandes récupérées de Supabase:', data?.length || 0);
            return data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            throw error;
        }
    }

    /**
     * Récupère une commande par son ID
     * @param {number} id - ID de la commande
     * @returns {Promise<Object>} Commande
     */
    async getOrderById(id) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.ordersTable)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la commande #${id}:`, error);
            throw error;
        }
    }

    /**
     * Récupère une commande par son GUID
     * @param {string} guidId - GUID de la commande
     * @returns {Promise<Object>} Commande
     */
    async getOrderByGuid(guidId) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.ordersTable)
                .select('*')
                .eq('GuidId', guidId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la commande avec GUID ${guidId}:`, error);
            throw error;
        }
    }

    /**
     * Récupère une commande complète avec ses lignes
     * @param {number} id - ID de la commande
     * @returns {Promise<Object>} Commande avec lignes
     */
    async getOrderWithLines(id) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.ordersTable)
                .select(`
                    *,
                    OrdersLines (
                        *,
                        Products (
                            code,
                            title_fr,
                            title_en,
                            icon,
                            categoryId
                        )
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la commande complète #${id}:`, error);
            throw error;
        }
    }

    /**
     * Crée une nouvelle commande
     * @param {Object} orderData - Données de la commande
     * @returns {Promise<Object>} Commande créée
     */
    async createOrder(orderData) {
        try {
            const client = dbConnection.getClient();
            
            // Générer un GUID si non fourni
            const guidId = orderData.GuidId || this.generateGuid();
            
            // Préparer les données avec valeurs par défaut
            const order = {
                GuidId: guidId,
                customerLastName: orderData.customerLastName || '',
                customerFirstName: orderData.customerFirstName || '',
                email: orderData.email || null,
                phone: orderData.phone || null,
                phoneIsMobile: orderData.phoneIsMobile !== undefined ? orderData.phoneIsMobile : null,
                language: orderData.language || 'FR',
                orderNote: orderData.orderNote || null,
                totalAmount: parseFloat(orderData.totalAmount) || 0,
                status: orderData.status || 'New',
                scheduledOn: orderData.scheduledOn || null,
                deliveryDate: orderData.deliveryDate || null,
                deposit: parseFloat(orderData.deposit) || 0,
                paid: orderData.paid !== undefined ? orderData.paid : false
            };

            const { data, error } = await client
                .from(this.ordersTable)
                .insert([order])
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Commande créée avec succès:', data.GuidId);
            return data;
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            throw error;
        }
    }

    /**
     * Met à jour une commande
     * @param {number} id - ID de la commande
     * @param {Object} orderData - Nouvelles données de la commande
     * @returns {Promise<Object>} Commande mise à jour
     */
    async updateOrder(id, orderData) {
        try {
            const client = dbConnection.getClient();
            
            const { data, error } = await client
                .from(this.ordersTable)
                .update(orderData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Commande mise à jour avec succès:', data.GuidId);
            return data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la commande #${id}:`, error);
            throw error;
        }
    }

    /**
     * Supprime une commande (les lignes seront supprimées en cascade)
     * @param {number} id - ID de la commande
     * @returns {Promise<boolean>} True si supprimé
     */
    async deleteOrder(id) {
        try {
            const client = dbConnection.getClient();
            const { error } = await client
                .from(this.ordersTable)
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log('✅ Commande supprimée avec succès');
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression de la commande #${id}:`, error);
            throw error;
        }
    }

    /**
     * Met à jour le statut d'une commande
     * @param {number} id - ID de la commande
     * @param {string} status - Nouveau statut
     * @returns {Promise<Object>} Commande mise à jour
     */
    async updateOrderStatus(id, status) {
        try {
            return await this.updateOrder(id, { status });
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du statut de la commande #${id}:`, error);
            throw error;
        }
    }

    /**
     * Marque une commande comme payée
     * @param {number} id - ID de la commande
     * @param {boolean} paid - Statut de paiement
     * @returns {Promise<Object>} Commande mise à jour
     */
    async updateOrderPaidStatus(id, paid = true) {
        try {
            return await this.updateOrder(id, { paid });
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du statut de paiement de la commande #${id}:`, error);
            throw error;
        }
    }

    // ============================================
    // MÉTHODES POUR LES LIGNES DE COMMANDE
    // ============================================

    /**
     * Récupère toutes les lignes d'une commande
     * @param {number} orderId - ID de la commande
     * @returns {Promise<Array>} Liste des lignes de commande
     */
    async getOrderLines(orderId) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.ordersLinesTable)
                .select(`
                    *,
                    Products (
                        code,
                        title_fr,
                        title_en,
                        icon,
                        categoryId,
                        unit
                    )
                `)
                .eq('orderId', orderId)
                .order('id', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error(`Erreur lors de la récupération des lignes de la commande #${orderId}:`, error);
            throw error;
        }
    }

    /**
     * Récupère une ligne de commande par son ID
     * @param {number} id - ID de la ligne
     * @returns {Promise<Object>} Ligne de commande
     */
    async getOrderLineById(id) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.ordersLinesTable)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la ligne #${id}:`, error);
            throw error;
        }
    }

    /**
     * Crée une nouvelle ligne de commande
     * @param {Object} lineData - Données de la ligne
     * @returns {Promise<Object>} Ligne créée
     */
    async createOrderLine(lineData) {
        try {
            const client = dbConnection.getClient();
            
            // Préparer les données avec valeurs par défaut
            const line = {
                orderId: lineData.orderId,
                productId: lineData.productId,
                quantityOrdered: parseInt(lineData.quantityOrdered) || 0,
                quantityProduced: parseInt(lineData.quantityProduced) || 0,
                price: parseFloat(lineData.price) || 0,
                lineTotal: parseFloat(lineData.lineTotal) || 0,
                lineStatus: lineData.lineStatus || 'ToDo',
                scheduledOn: lineData.scheduledOn || null
            };

            const { data, error } = await client
                .from(this.ordersLinesTable)
                .insert([line])
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Ligne de commande créée avec succès');
            return data;
        } catch (error) {
            console.error('Erreur lors de la création de la ligne de commande:', error);
            throw error;
        }
    }

    /**
     * Met à jour une ligne de commande
     * @param {number} id - ID de la ligne
     * @param {Object} lineData - Nouvelles données de la ligne
     * @returns {Promise<Object>} Ligne mise à jour
     */
    async updateOrderLine(id, lineData) {
        try {
            const client = dbConnection.getClient();
            
            const { data, error } = await client
                .from(this.ordersLinesTable)
                .update(lineData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Ligne de commande mise à jour avec succès');
            return data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la ligne #${id}:`, error);
            throw error;
        }
    }

    /**
     * Supprime une ligne de commande
     * @param {number} id - ID de la ligne
     * @returns {Promise<boolean>} True si supprimé
     */
    async deleteOrderLine(id) {
        try {
            const client = dbConnection.getClient();
            const { error } = await client
                .from(this.ordersLinesTable)
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log('✅ Ligne de commande supprimée avec succès');
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression de la ligne #${id}:`, error);
            throw error;
        }
    }

    /**
     * Met à jour le statut d'une ligne de commande
     * @param {number} id - ID de la ligne
     * @param {string} lineStatus - Nouveau statut
     * @returns {Promise<Object>} Ligne mise à jour
     */
    async updateOrderLineStatus(id, lineStatus) {
        try {
            return await this.updateOrderLine(id, { lineStatus });
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du statut de la ligne #${id}:`, error);
            throw error;
        }
    }

    /**
     * Met à jour la quantité produite d'une ligne
     * @param {number} id - ID de la ligne
     * @param {number} quantityProduced - Quantité produite
     * @returns {Promise<Object>} Ligne mise à jour
     */
    async updateOrderLineQuantityProduced(id, quantityProduced) {
        try {
            return await this.updateOrderLine(id, { 
                quantityProduced: parseInt(quantityProduced)
            });
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la quantité produite de la ligne #${id}:`, error);
            throw error;
        }
    }

    /**
     * Crée une commande complète avec ses lignes
     * @param {Object} orderData - Données de la commande
     * @param {Array} lines - Tableau des lignes de commande
     * @returns {Promise<Object>} Commande créée avec ses lignes
     */
    async createOrderWithLines(orderData, lines = []) {
        try {
            const client = dbConnection.getClient();
            
            // Créer la commande
            const order = await this.createOrder(orderData);
            
            // Créer les lignes si présentes
            if (lines.length > 0) {
                const orderLines = lines.map(line => ({
                    orderId: order.id,
                    productId: line.productId,
                    quantityOrdered: parseInt(line.quantityOrdered) || 0,
                    quantityProduced: parseInt(line.quantityProduced) || 0,
                    price: parseFloat(line.price) || 0,
                    lineTotal: parseFloat(line.lineTotal) || 0,
                    lineStatus: line.lineStatus || 'ToDo',
                    scheduledOn: line.scheduledOn || null
                }));

                const { data: linesData, error: linesError } = await client
                    .from(this.ordersLinesTable)
                    .insert(orderLines)
                    .select();

                if (linesError) throw linesError;
                
                console.log(`✅ ${linesData.length} ligne(s) de commande créée(s)`);
                
                return {
                    ...order,
                    OrdersLines: linesData
                };
            }
            
            return order;
        } catch (error) {
            console.error('Erreur lors de la création de la commande complète:', error);
            throw error;
        }
    }

    /**
     * Récupère les commandes par date de livraison
     * @param {string} deliveryDate - Date de livraison (format YYYY-MM-DD)
     * @returns {Promise<Array>} Liste des commandes
     */
    async getOrdersByDeliveryDate(deliveryDate) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.ordersTable)
                .select('*')
                .eq('deliveryDate', deliveryDate)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error(`Erreur lors de la récupération des commandes pour le ${deliveryDate}:`, error);
            throw error;
        }
    }

    /**
     * Récupère les commandes par date de production planifiée
     * @param {string} scheduledOn - Date de production (format YYYY-MM-DD)
     * @returns {Promise<Array>} Liste des commandes
     */
    async getOrdersByScheduledDate(scheduledOn) {
        try {
            const client = dbConnection.getClient();
            const { data, error } = await client
                .from(this.ordersTable)
                .select('*')
                .eq('scheduledOn', scheduledOn)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error(`Erreur lors de la récupération des commandes planifiées pour le ${scheduledOn}:`, error);
            throw error;
        }
    }

    /**
     * Génère un GUID unique pour une commande
     * @returns {string} GUID généré
     */
    generateGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Instance singleton
const orderService = new OrderService();

export default orderService;
