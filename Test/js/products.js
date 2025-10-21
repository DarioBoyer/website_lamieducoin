// Products Management Script
// Loads and displays products dynamically from products.json

let productsData = null;
let currentLanguage = localStorage.getItem('language') || 'fr';

// Load products from JSON file
async function loadProducts() {
    try {
        console.log('🔄 Chargement des produits depuis JSON...');
        const response = await fetch('../data/products.json');
        console.log('📡 Réponse reçue:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Failed to load products: ${response.status} ${response.statusText}`);
        }
        
        productsData = await response.json();
        console.log('✅ Produits chargés:', productsData.products.length, 'produits');
        displayProducts();
    } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error);
        console.error('💡 Assurez-vous d\'utiliser un serveur local (ex: python -m http.server 8000)');
        // Fallback: keep static content if JSON fails to load
    }
}

// Display all products grouped by category
function displayProducts() {
    if (!productsData) {
        console.warn('⚠️ Pas de données produits à afficher');
        return;
    }

    console.log('🎨 Affichage des produits...');
    
    // Get current language from localStorage or default to French
    currentLanguage = localStorage.getItem('language') || 'fr';
    console.log('🌐 Langue courante:', currentLanguage);

    // Sort categories by order
    const sortedCategories = [...productsData.categories].sort((a, b) => a.order - b.order);
    console.log('📦 Catégories à afficher:', sortedCategories.length);

    // Process each category
    sortedCategories.forEach(category => {
        displayCategory(category);
    });
    
    console.log('✅ Affichage terminé');
}

// Display products for a specific category
function displayCategory(category) {
    const sectionId = category.id;
    const section = document.getElementById(sectionId);
    
    if (!section) {
        console.warn(`Section ${sectionId} not found`);
        return;
    }

    // Update section title and description
    const titleElement = section.querySelector('.section-title h2');
    const descriptionElement = section.querySelector('.section-title p');
    
    if (titleElement) {
        titleElement.innerHTML = `${category.icon} ${category.name[currentLanguage]}`;
    }
    
    if (descriptionElement) {
        descriptionElement.textContent = category.description[currentLanguage];
    }

    // Get products for this category
    const categoryProducts = productsData.products.filter(p => p.category === category.id && p.available);
    
    // Sort products by title in current language
    categoryProducts.sort((a, b) => {
        const titleA = a.title[currentLanguage].toLowerCase();
        const titleB = b.title[currentLanguage].toLowerCase();
        return titleA.localeCompare(titleB, currentLanguage);
    });

    // Get or create products container
    let productsContainer = section.querySelector('.row.g-4');
    if (!productsContainer) {
        productsContainer = document.createElement('div');
        productsContainer.className = 'row g-4';
        section.appendChild(productsContainer);
    }

    // Clear existing products
    productsContainer.innerHTML = '';

    // Add products to container
    categoryProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const col = document.createElement('div');
    
    // Determine column width based on category
    if (product.category === 'pains-mediterraneens') {
        col.className = 'col-md-6';
    } else {
        col.className = 'col-md-6 col-lg-4';
    }

    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Add featured class if applicable
    if (product.featured) {
        card.classList.add('featured');
    }

    // Product icon
    const icon = document.createElement('div');
    icon.className = 'product-icon';
    icon.textContent = product.icon;

    // Product title
    const title = document.createElement('h4');
    title.textContent = product.title[currentLanguage];

    // Product description
    const description = document.createElement('p');
    description.textContent = product.description[currentLanguage];

    // Product price
    const price = document.createElement('div');
    price.className = 'product-price';
    
    // Format price with unit if needed
    let priceText = `${product.price.toFixed(2)}$`;
    if (product.unit !== 'loaf' && product.unit !== 'piece') {
        const unitTranslations = {
            'pack of 6': { fr: '/ paquet de 6', en: '/ pack of 6' },
            'bag': { fr: '/ sac', en: '/ bag' }
        };
        if (unitTranslations[product.unit]) {
            priceText += ` ${unitTranslations[product.unit][currentLanguage]}`;
        }
    } else if (product.unit === 'piece') {
        const pieceText = currentLanguage === 'fr' ? '/ pièce' : '/ piece';
        priceText += ` ${pieceText}`;
    }
    
    price.textContent = priceText;

    // Product weight (optional display)
    const weight = document.createElement('small');
    weight.className = 'text-muted d-block mt-2';
    weight.textContent = product.weight;

    // Assemble card
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);
    // Optionally add weight: card.appendChild(weight);

    col.appendChild(card);
    return col;
}

// Update products when language changes
function updateProductsLanguage() {
    const newLanguage = localStorage.getItem('language') || 'fr';
    if (newLanguage !== currentLanguage) {
        currentLanguage = newLanguage;
        displayProducts();
    }
}

// Listen for language change events
window.addEventListener('languageChanged', updateProductsLanguage);

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Also expose for manual refresh if needed
window.refreshProducts = displayProducts;
