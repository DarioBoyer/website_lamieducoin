// Order Tracking JavaScript
// Handles order display, status tracking, and customer interactions

(function() {
    'use strict';

    let currentLanguage = 'fr';
    let orderData = null;

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Get language from localStorage or default to French
        currentLanguage = localStorage.getItem('selectedLanguage') || 'fr';
        
        // Set up language switcher
        setupLanguageSwitcher();
        
        // Load order data
        loadOrderData();
        
        // Setup comment form
        setupCommentForm();
    });

    // Setup language switcher
    function setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            if (btn.dataset.lang === currentLanguage) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', function() {
                const newLang = this.dataset.lang;
                if (newLang !== currentLanguage) {
                    currentLanguage = newLang;
                    localStorage.setItem('selectedLanguage', newLang);
                    
                    langButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update translations
                    updatePageLanguage();
                    
                    // Refresh order display with new language
                    if (orderData) {
                        displayOrder(orderData);
                    }
                }
            });
        });
        
        // Initial translation
        updatePageLanguage();
    }

    // Update page language
    function updatePageLanguage() {
        if (typeof translations === 'undefined') return;
        
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.dataset.i18n;
            const translation = getTranslation(key);
            if (translation) {
                el.textContent = translation;
            }
        });
        
        // Update placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const translation = getTranslation(key);
            if (translation) {
                el.placeholder = translation;
            }
        });
    }

    // Get translation by key
    function getTranslation(key) {
        if (typeof translations === 'undefined') return null;
        
        const keys = key.split('.');
        let value = translations[currentLanguage];
        
        for (let k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return value;
    }

    // Get URL parameter
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Load order data
    async function loadOrderData() {
        // Support both 'guid' and 'order' parameters
        const orderGuid = getUrlParameter('order') || getUrlParameter('guid');
        
        if (!orderGuid) {
            showOrderNotFound();
            return;
        }

        try {
            // Load orders from JSON file
            const response = await fetch('../data/orders.json');
            if (!response.ok) {
                throw new Error('Failed to load orders data');
            }

            const data = await response.json();
            
            // Load local orders from localStorage
            let localOrders = [];
            try {
                const storedOrders = localStorage.getItem('localOrders');
                if (storedOrders) {
                    localOrders = JSON.parse(storedOrders);
                    console.log(`Loaded ${localOrders.length} orders from localStorage`);
                }
            } catch (error) {
                console.error('Error loading local orders:', error);
            }
            
            // Merge orders from JSON file and localStorage
            const allOrders = [...data.orders, ...localOrders];
            
            // Find order by GUID
            const order = allOrders.find(o => o.orderGuid === orderGuid);
            
            if (!order) {
                console.error('Order not found:', orderGuid);
                showOrderNotFound();
                return;
            }

            // Store order data and statuses
            orderData = {
                order: order,
                orderStatuses: data.orderStatuses,
                lineStatuses: data.lineStatuses
            };

            // Display the order
            displayOrder(orderData);
            
        } catch (error) {
            console.error('Error loading order:', error);
            showOrderNotFound();
        }
    }

    // Show order not found
    function showOrderNotFound() {
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('order-not-found').classList.remove('d-none');
    }

    // Display order
    function displayOrder(data) {
        const { order, orderStatuses, lineStatuses } = data;
        
        // Hide loading, show content
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('order-content').classList.remove('d-none');

        // Order header
        document.getElementById('order-number').textContent = order.orderId;
        document.getElementById('customer-name').textContent = 
            `${order.customerFirstName} ${order.customerLastName}`;
        
        // Format and display order date
        const orderDate = new Date(order.scheduledOn);
        document.getElementById('order-date').textContent = formatDate(orderDate);

        // Status badge
        displayStatusBadge(order.status, orderStatuses);

        // Display status section based on order status
        displayStatusSection(order, orderStatuses, lineStatuses);

        // Display delivery date if available
        if (order.deliveryDate) {
            const deliveryDate = new Date(order.deliveryDate);
            document.getElementById('delivery-date').textContent = formatDate(deliveryDate);
            document.getElementById('scheduled-info').classList.remove('d-none');
        }

        // Display order items
        displayOrderItems(order);

        // Display order note if exists
        if (order.orderNote && order.orderNote.trim()) {
            document.getElementById('order-note').textContent = order.orderNote;
            document.getElementById('order-note-section').style.display = 'block';
        }

        // Display order summary
        displayOrderSummary(order);

        // Display contact info
        document.getElementById('customer-email').textContent = order.email;
        document.getElementById('customer-phone').textContent = order.phone;
    }

    // Display status badge
    function displayStatusBadge(status, orderStatuses) {
        const statusBadge = document.getElementById('status-badge');
        const statusText = orderStatuses[status] ? orderStatuses[status][currentLanguage] : status;
        
        statusBadge.textContent = statusText;
        statusBadge.className = 'status-badge status-' + status.toLowerCase();
    }

    // Display status section
    function displayStatusSection(order, orderStatuses, lineStatuses) {
        const status = order.status;

        // Hide all status displays first
        document.getElementById('status-timeline').classList.add('d-none');
        document.getElementById('production-progress').classList.add('d-none');
        document.getElementById('cancelled-status').classList.add('d-none');

        if (status === 'Cancel') {
            // Show cancelled message
            document.getElementById('cancelled-status').classList.remove('d-none');
        } else if (status === 'Production') {
            // Show production progress
            displayProductionProgress(order, lineStatuses);
        } else {
            // Show timeline
            displayStatusTimeline(status);
        }
    }

    // Display status timeline
    function displayStatusTimeline(currentStatus) {
        const timeline = document.getElementById('status-timeline');
        timeline.classList.remove('d-none');

        const statusOrder = ['New', 'Plan', 'Production', 'Completed', 'Done'];
        const currentIndex = statusOrder.indexOf(currentStatus);

        const timelineItems = timeline.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const itemStatus = item.dataset.status;
            const itemIndex = statusOrder.indexOf(itemStatus);

            item.classList.remove('active', 'completed');

            if (itemIndex < currentIndex) {
                item.classList.add('completed');
            } else if (itemIndex === currentIndex) {
                item.classList.add('active');
            }
        });

        // Update planned date if status is Plan
        if (currentStatus === 'Plan') {
            const plannedDateEl = document.getElementById('planned-date');
            if (plannedDateEl && orderData.order.deliveryDate) {
                const deliveryDate = new Date(orderData.order.deliveryDate);
                plannedDateEl.textContent = formatDate(deliveryDate);
            }
        }
    }

    // Display production progress
    function displayProductionProgress(order, lineStatuses) {
        const productionSection = document.getElementById('production-progress');
        productionSection.classList.remove('d-none');

        // Calculate statistics
        let totalItems = 0;
        let completedCount = 0;
        let inProgressCount = 0;
        let pendingCount = 0;

        order.orderLines.forEach(line => {
            totalItems += line.quantityOrdered;
            
            const produced = line.quantityProduced || 0;
            const ordered = line.quantityOrdered;

            if (produced >= ordered) {
                completedCount += ordered;
            } else if (produced > 0) {
                completedCount += produced;
                inProgressCount += (ordered - produced);
            } else {
                if (line.lineStatus === 'Production') {
                    inProgressCount += ordered;
                } else {
                    pendingCount += ordered;
                }
            }
        });

        // Update statistics
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('completed-items').textContent = completedCount;
        document.getElementById('inprogress-items').textContent = inProgressCount;
        document.getElementById('pending-items').textContent = pendingCount;

        // Calculate overall progress
        const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
        document.getElementById('progress-percentage').textContent = progressPercentage;
        document.getElementById('progress-text').textContent = progressPercentage;
        
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = progressPercentage + '%';
        progressBar.setAttribute('aria-valuenow', progressPercentage);

        // Display production items detail
        displayProductionItems(order, lineStatuses);
    }

    // Display production items detail
    async function displayProductionItems(order, lineStatuses) {
        const container = document.getElementById('production-items');
        container.innerHTML = '';

        // Load products data to get product names
        let productsData = {};
        try {
            const response = await fetch('../data/products.json');
            if (response.ok) {
                const data = await response.json();
                data.products.forEach(product => {
                    productsData[product.id] = product;
                });
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }

        order.orderLines.forEach(line => {
            const product = productsData[line.productId];
            const productName = product ? product.title[currentLanguage] : line.productId;
            
            const produced = line.quantityProduced || 0;
            const ordered = line.quantityOrdered;
            const itemProgress = ordered > 0 ? Math.round((produced / ordered) * 100) : 0;

            const statusText = lineStatuses[line.lineStatus] ? 
                lineStatuses[line.lineStatus][currentLanguage] : line.lineStatus;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'production-item';
            itemDiv.innerHTML = `
                <div class="production-item-info">
                    <div class="production-item-name">${productName}</div>
                    <div class="production-item-quantity">
                        ${produced} / ${ordered} ${getTranslation('tracking.completed') || 'complété'}
                    </div>
                    <div class="item-progress">
                        <div class="item-progress-bar" style="width: ${itemProgress}%"></div>
                    </div>
                </div>
                <div class="production-item-status">
                    <span class="item-status-badge status-${line.lineStatus.toLowerCase()}">${statusText}</span>
                </div>
            `;

            container.appendChild(itemDiv);
        });
    }

    // Display order items
    async function displayOrderItems(order) {
        const container = document.getElementById('order-items');
        container.innerHTML = '';

        // Load products data
        let productsData = {};
        try {
            const response = await fetch('../data/products.json');
            if (response.ok) {
                const data = await response.json();
                data.products.forEach(product => {
                    productsData[product.id] = product;
                });
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }

        order.orderLines.forEach(line => {
            const product = productsData[line.productId];
            const productName = product ? product.title[currentLanguage] : line.productId;
            const productDesc = product ? product.description[currentLanguage] : '';

            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${productName}</div>
                    <div class="order-item-details">${productDesc}</div>
                </div>
                <div class="order-item-price">
                    <div class="order-item-quantity">Qté: ${line.quantityOrdered}</div>
                    <div>${formatPrice(line.lineTotal)}</div>
                </div>
            `;

            container.appendChild(itemDiv);
        });
    }

    // Display order summary
    function displayOrderSummary(order) {
        document.getElementById('order-total').textContent = formatPrice(order.totalAmount);
        document.getElementById('order-total-final').textContent = formatPrice(order.totalAmount);

        // Display deposit if exists
        if (order.deposit && order.deposit > 0) {
            document.getElementById('order-deposit').textContent = formatPrice(order.deposit);
            document.getElementById('deposit-row').style.display = 'flex';
        }

        // Payment status
        const paymentStatusDiv = document.getElementById('payment-status');
        const isPaid = order.paid;
        const statusText = isPaid ? 
            (getTranslation('tracking.paymentPaid') || 'Payé') : 
            (getTranslation('tracking.paymentUnpaid') || 'Non payé');
        
        paymentStatusDiv.innerHTML = `
            <div class="payment-badge ${isPaid ? 'paid' : 'unpaid'}">
                <i class="bi bi-${isPaid ? 'check-circle' : 'exclamation-circle'}"></i> ${statusText}
            </div>
        `;
    }

    // Setup comment form
    function setupCommentForm() {
        const form = document.getElementById('comment-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitComment();
        });
    }

    // Submit comment
    function submitComment() {
        const commentText = document.getElementById('customer-comment').value.trim();
        
        if (!commentText) {
            return;
        }

        // In a real application, this would send the comment to the server
        // For now, we'll just show a success message
        console.log('Comment submitted:', {
            orderGuid: orderData.order.orderGuid,
            comment: commentText,
            timestamp: new Date().toISOString()
        });

        // Show success message
        const successDiv = document.getElementById('comment-success');
        successDiv.classList.remove('d-none');

        // Clear the form
        document.getElementById('customer-comment').value = '';

        // Hide success message after 5 seconds
        setTimeout(() => {
            successDiv.classList.add('d-none');
        }, 5000);
    }

    // Format date
    function formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return date.toLocaleDateString(currentLanguage === 'fr' ? 'fr-CA' : 'en-CA', options);
    }

    // Format price
    function formatPrice(price) {
        return new Intl.NumberFormat(currentLanguage === 'fr' ? 'fr-CA' : 'en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(price);
    }

})();
