/**
 * Service de gestion des commandes avec Supabase
 */

class OrderService {
    constructor() {
        this.supabaseUrl = 'https://mtuimnyoimiqhuyidyjv.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dWltbnlvaW1pcWh1eWlkeWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjc3NjksImV4cCI6MjA3Njg0Mzc2OX0.SuB-0Kwaakff6pbZhKgWbGaAfL9h_NWaRBR9rNnaMIw';
        this.client = null;
        this.productsCache = null; // Cache des produits pour le mapping
    }

    /**
     * Initialiser le client Supabase
     */
    async init() {
        try {
            // Vérifier que la bibliothèque Supabase est chargée
            if (typeof supabase === 'undefined') {
                console.error('La bibliothèque Supabase n\'est pas chargée');
                return false;
            }

            // Créer le client Supabase
            this.client = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            
            // Charger les produits pour le mapping code -> id
            await this.loadProductsMapping();
            
            console.log('✅ Service de commandes initialisé avec Supabase');
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du service de commandes:', error);
            return false;
        }
    }

    /**
     * Charger les produits depuis Supabase pour créer le mapping code -> id
     */
    async loadProductsMapping() {
        try {
            const { data, error } = await this.client
                .from('Products')
                .select('id, code')
                .eq('productType', 'retail')
                .eq('status', 'Active');

            if (error) throw error;
            
            this.productsCache = data || [];
            console.log(`✅ ${this.productsCache.length} produits chargés pour le mapping`);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des produits:', error);
            this.productsCache = [];
        }
    }

    /**
     * Générer un GUID unique pour la commande
     */
    generateGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Créer une nouvelle commande dans Supabase
     * @param {Object} orderData - Données de la commande
     * @returns {Promise<Object>} - Commande créée avec ses lignes
     */
    async createOrder(orderData) {
        try {
            if (!this.client) {
                await this.init();
            }

            // Générer un GUID unique pour la commande
            const orderGuid = this.generateGuid();

            // Calculer le total de la commande
            const totalAmount = orderData.orderLines.reduce((sum, line) => {
                return sum + (line.price * line.quantityOrdered);
            }, 0);

            // Préparer les données de la commande pour Supabase
            const orderRecord = {
                GuidId: orderGuid,
                customerFirstName: orderData.customerFirstName,
                customerLastName: orderData.customerLastName,
                email: orderData.email || null,
                phone: orderData.phone || null,
                phoneIsMobile: true, // Par défaut on assume que c'est un mobile
                language: orderData.language || 'FR',
                orderNote: orderData.orderNote || null,
                totalAmount: totalAmount,
                status: 'New',
                deliveryDate: orderData.deliveryDate || null,
                scheduledOn: null,
                deposit: 0,
                paid: false
            };

            console.log('📝 Création de la commande:', orderRecord);

            // Insérer la commande dans Supabase
            const { data: order, error: orderError } = await this.client
                .from('Orders')
                .insert([orderRecord])
                .select()
                .single();

            if (orderError) {
                console.error('❌ Erreur lors de la création de la commande:', orderError);
                throw orderError;
            }

            console.log('✅ Commande créée avec succès:', order);

            // Préparer les lignes de commande
            const orderLines = orderData.orderLines.map(line => {
                const productId = this.getProductIdFromCode(line.productId);
                
                if (!productId) {
                    console.error(`❌ Impossible de trouver le produit avec le code: ${line.productId}`);
                    throw new Error(`Produit introuvable: ${line.productId}`);
                }
                
                return {
                    orderId: order.id,
                    productId: productId,
                    quantityOrdered: line.quantityOrdered,
                    quantityProduced: 0,
                    price: line.price,
                    lineTotal: line.price * line.quantityOrdered,
                    lineStatus: 'ToDo',
                    scheduledOn: null
                };
            });

            console.log('📝 Création des lignes de commande:', orderLines);

            // Insérer les lignes de commande
            const { data: lines, error: linesError } = await this.client
                .from('OrdersLines')
                .insert(orderLines)
                .select();

            if (linesError) {
                console.error('❌ Erreur lors de la création des lignes de commande:', linesError);
                // Si l'insertion des lignes échoue, on pourrait supprimer la commande
                // Mais pour l'instant on lance juste une erreur
                throw linesError;
            }

            console.log('✅ Lignes de commande créées avec succès:', lines);

            // Retourner la commande complète
            return {
                order: order,
                lines: lines,
                orderGuid: orderGuid,
                orderId: order.id,
                totalAmount: totalAmount
            };

        } catch (error) {
            console.error('❌ Erreur lors de la création de la commande:', error);
            throw error;
        }
    }

    /**
     * Obtenir l'ID numérique d'un produit à partir de son code/id string
     * Utilise le cache des produits chargés depuis Supabase
     */
    getProductIdFromCode(productCode) {
        if (!this.productsCache || this.productsCache.length === 0) {
            console.error('❌ Cache des produits non initialisé. Appelez init() d\'abord.');
            return null;
        }

        // Chercher le produit par son code
        const product = this.productsCache.find(p => p.code === productCode);
        
        if (!product) {
            console.warn(`⚠️ Produit non trouvé pour le code: ${productCode}`);
            return null;
        }

        return product.id;
    }

    /**
     * Récupérer une commande par son GUID
     */
    async getOrderByGuid(guid) {
        try {
            if (!this.client) {
                await this.init();
            }

            const { data: order, error: orderError } = await this.client
                .from('Orders')
                .select('*')
                .eq('GuidId', guid)
                .single();

            if (orderError) throw orderError;

            // Récupérer les lignes de commande
            const { data: lines, error: linesError } = await this.client
                .from('OrdersLines')
                .select('*, Products(*)')
                .eq('orderId', order.id);

            if (linesError) throw linesError;

            return {
                order: order,
                lines: lines
            };

        } catch (error) {
            console.error('❌ Erreur lors de la récupération de la commande:', error);
            throw error;
        }
    }

    /**
     * Récupérer toutes les commandes d'un client par email
     */
    async getOrdersByEmail(email) {
        try {
            if (!this.client) {
                await this.init();
            }

            const { data: orders, error } = await this.client
                .from('Orders')
                .select('*')
                .eq('email', email)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return orders;

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des commandes:', error);
            throw error;
        }
    }
}

// Créer une instance globale du service
const orderService = new OrderService();

// Initialiser au chargement
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        orderService.init();
    });
}
