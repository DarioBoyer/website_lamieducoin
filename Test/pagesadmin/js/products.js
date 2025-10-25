/**
 * Gestion de l'interface d'administration des produits
 */

import dbConnection from './config/database.js';
import productService from './services/productService.js';

// État global
let allProducts = [];
let currentEditId = null;

/**
 * Initialisation de la page
 */
async function init() {
    try {
        // Initialiser la connexion à la base de données
        await dbConnection.init();
        
        // Vérifier la connexion
        const isConnected = await dbConnection.checkConnection();
        if (!isConnected) {
            showError('Impossible de se connecter à la base de données. Vérifiez votre configuration.');
            return;
        }

        // Charger les produits
        await loadProducts();
        
        // Charger les catégories pour le filtre
        await loadCategories();
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError('Erreur lors de l\'initialisation: ' + error.message);
    }
}

/**
 * Charge tous les produits
 */
async function loadProducts() {
    try {
        showLoading(true);
        allProducts = await productService.getAllProducts();
        console.log('📦 Produits chargés:', allProducts);
        console.log('📊 Nombre de produits:', allProducts.length);
        displayProducts(allProducts);
        showLoading(false);
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        showError('Erreur lors du chargement des produits: ' + error.message);
        showLoading(false);
    }
}

/**
 * Charge les catégories pour le filtre
 */
async function loadCategories() {
    try {
        const categories = await productService.getCategories();
        const select = document.getElementById('filterCategory');
        
        // Garder l'option "Toutes les catégories"
        select.innerHTML = '<option value="">Toutes les catégories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = formatCategory(category);
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

/**
 * Affiche les produits dans le tableau
 */
function displayProducts(products) {
    const tbody = document.getElementById('productsBody');
    const table = document.getElementById('productsTable');
    const noProducts = document.getElementById('no-products');
    
    if (!products || products.length === 0) {
        table.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    table.style.display = 'table';
    noProducts.style.display = 'none';
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td class="product-icon">${product.icon}</td>
            <td><strong>${product.code}</strong></td>
            <td>${product.title_fr}</td>
            <td>${formatCategory(product.category)}</td>
            <td>${product.price.toFixed(2)} ${product.currency}</td>
            <td>${product.inventoryQuantity}</td>
            <td><span class="badge ${getStatusBadgeClass(product.status)}">${product.status}</span></td>
            <td><span class="badge ${product.available ? 'badge-success' : 'badge-danger'}">${product.available ? 'Oui' : 'Non'}</span></td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editProduct(${product.id})">✏️ Modifier</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})" style="padding: 8px 16px; font-size: 13px;">🗑️ Supprimer</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Applique les filtres
 */
function applyFilters() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const availableFilter = document.getElementById('filterAvailable').value;
    const searchFilter = document.getElementById('filterSearch').value.toLowerCase();
    
    let filtered = allProducts;
    
    if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    if (statusFilter) {
        filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    if (availableFilter !== '') {
        const isAvailable = availableFilter === 'true';
        filtered = filtered.filter(p => p.available === isAvailable);
    }
    
    if (searchFilter) {
        filtered = filtered.filter(p => 
            p.code.toLowerCase().includes(searchFilter) ||
            p.title_fr.toLowerCase().includes(searchFilter) ||
            p.title_en.toLowerCase().includes(searchFilter)
        );
    }
    
    displayProducts(filtered);
}

/**
 * Ouvre le modal pour créer un nouveau produit
 */
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    currentEditId = productId;
    
    if (productId) {
        title.textContent = 'Modifier le Produit';
        loadProductData(productId);
    } else {
        title.textContent = 'Nouveau Produit';
        resetForm();
    }
    
    modal.style.display = 'block';
}

/**
 * Ferme le modal
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    currentEditId = null;
    resetForm();
}

/**
 * Charge les données d'un produit dans le formulaire
 */
async function loadProductData(productId) {
    try {
        const product = await productService.getProductById(productId);
        
        document.getElementById('productId').value = product.id;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productTitleFr').value = product.title_fr;
        document.getElementById('productTitleEn').value = product.title_en;
        document.getElementById('productDescFr').value = product.description_fr;
        document.getElementById('productDescEn').value = product.description_en;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCurrency').value = product.currency;
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('productWeight').value = product.weight;
        document.getElementById('productWeightUnit').value = product.weightUnit;
        document.getElementById('productInventory').value = product.inventoryQuantity;
        document.getElementById('productIcon').value = product.icon;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productType').value = product.productType;
        document.getElementById('productStatus').value = product.status;
        document.getElementById('productAvailable').checked = product.available;
        document.getElementById('productFeatured').checked = product.featured;
        
        // Charger les allergènes
        loadArrayItems('allergens', product.allergens || []);
        
        // Charger les ingrédients
        loadArrayItems('ingredients', product.ingredients || []);
        
    } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        showError('Erreur lors du chargement du produit: ' + error.message);
    }
}

/**
 * Réinitialise le formulaire
 */
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productAvailable').checked = true;
    document.getElementById('productFeatured').checked = false;
    document.getElementById('productCurrency').value = 'CDN';
    document.getElementById('productUnit').value = 'loaf';
    document.getElementById('productWeightUnit').value = 'g';
    document.getElementById('productType').value = 'retail';
    document.getElementById('productStatus').value = 'Active';
    document.getElementById('productIcon').value = '🍞';
    document.getElementById('productInventory').value = '0';
    
    loadArrayItems('allergens', []);
    loadArrayItems('ingredients', []);
}

/**
 * Sauvegarde un produit
 */
async function saveProduct() {
    try {
        const productData = {
            code: document.getElementById('productCode').value,
            category: document.getElementById('productCategory').value,
            title_fr: document.getElementById('productTitleFr').value,
            title_en: document.getElementById('productTitleEn').value,
            description_fr: document.getElementById('productDescFr').value,
            description_en: document.getElementById('productDescEn').value,
            price: parseFloat(document.getElementById('productPrice').value),
            currency: document.getElementById('productCurrency').value,
            unit: document.getElementById('productUnit').value,
            weight: parseFloat(document.getElementById('productWeight').value) || 0,
            weightUnit: document.getElementById('productWeightUnit').value,
            inventoryQuantity: parseInt(document.getElementById('productInventory').value) || 0,
            icon: document.getElementById('productIcon').value,
            image: document.getElementById('productImage').value,
            productType: document.getElementById('productType').value,
            status: document.getElementById('productStatus').value,
            available: document.getElementById('productAvailable').checked,
            featured: document.getElementById('productFeatured').checked,
            allergens: getArrayItems('allergens'),
            ingredients: getArrayItems('ingredients')
        };
        
        if (currentEditId) {
            await productService.updateProduct(currentEditId, productData);
            alert('✅ Produit mis à jour avec succès!');
        } else {
            await productService.createProduct(productData);
            alert('✅ Produit créé avec succès!');
        }
        
        closeProductModal();
        await loadProducts();
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('❌ Erreur lors de la sauvegarde: ' + error.message);
    }
}

/**
 * Modifier un produit
 */
function editProduct(productId) {
    openProductModal(productId);
}

/**
 * Supprimer un produit
 */
async function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
        return;
    }
    
    try {
        await productService.deleteProduct(productId);
        alert('✅ Produit supprimé avec succès!');
        await loadProducts();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('❌ Erreur lors de la suppression: ' + error.message);
    }
}

/**
 * Actualiser les produits
 */
async function refreshProducts() {
    await loadProducts();
    alert('✅ Liste actualisée!');
}

/**
 * Gestion des tableaux (allergènes, ingrédients)
 */
function loadArrayItems(type, items) {
    const container = document.getElementById(`${type}Container`);
    container.innerHTML = '';
    
    if (items.length === 0) {
        addArrayItem(type);
    } else {
        items.forEach(item => {
            addArrayItemWithValue(type, item);
        });
    }
}

function addArrayItem(type) {
    addArrayItemWithValue(type, '');
}

function addArrayItemWithValue(type, value) {
    const container = document.getElementById(`${type}Container`);
    const itemDiv = document.createElement('div');
    itemDiv.className = 'array-item';
    itemDiv.innerHTML = `
        <input type="text" value="${value}" placeholder="Entrez un élément...">
        <button type="button" class="btn-remove-item" onclick="removeArrayItem(this)">✕</button>
    `;
    container.appendChild(itemDiv);
}

function removeArrayItem(button) {
    button.parentElement.remove();
}

function getArrayItems(type) {
    const container = document.getElementById(`${type}Container`);
    const inputs = container.querySelectorAll('input');
    return Array.from(inputs)
        .map(input => input.value.trim())
        .filter(value => value !== '');
}

/**
 * Utilitaires
 */
function formatCategory(category) {
    const categories = {
        'pains-base': 'Pains de base',
        'pains-specialite': 'Pains spécialisés',
        'viennoiseries': 'Viennoiseries',
        'sans-gluten': 'Sans gluten'
    };
    return categories[category] || category;
}

function getStatusBadgeClass(status) {
    const classes = {
        'Active': 'badge-success',
        'Inactive': 'badge-warning',
        'Deleted': 'badge-danger'
    };
    return classes[status] || 'badge-info';
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const container = document.getElementById('error-container');
    container.innerHTML = `<div class="error">❌ ${message}</div>`;
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Exposer les fonctions globalement pour les événements onclick
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.refreshProducts = refreshProducts;
window.applyFilters = applyFilters;
window.addArrayItem = addArrayItem;
window.removeArrayItem = removeArrayItem;

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
}

// Initialiser au chargement de la page
init();
