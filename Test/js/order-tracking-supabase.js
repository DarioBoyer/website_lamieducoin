// Order Tracking with Supabase - JavaScript
// Handles order retrieval from Supabase and display for customer tracking

(function() {
    'use strict';

    let currentLanguage = 'fr';
    let orderData = null;
    let supabaseClient = null;

    // Supabase configuration
    const SUPABASE_URL = 'https://mtuimnyoimiqhuyidyjv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dWltbnlvaW1pcWh1eWlkeWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjc3NjksImV4cCI6MjA3Njg0Mzc2OX0.SuB-0Kwaakff6pbZhKgWbGaAfL9h_NWaRBR9rNnaMIw';

    // Order and line statuses (bilingual)
    const orderStatuses = {
        'New': { fr: 'Nouvelle', en: 'New' },
        'Plan': { fr: 'Planifiée', en: 'Planned' },
        'Production': { fr: 'En production', en: 'In production' },
        'Completed': { fr: 'Complétée', en: 'Completed' },
        'Done': { fr: 'Récupérée', en: 'Picked up' },
        'Cancel': { fr: 'Annulée', en: 'Cancelled' }
    };

    const lineStatuses = {
        'ToDo': { fr: 'À faire', en: 'To do' },
        'Plan': { fr: 'Planifiée', en: 'Planned' },
        'Production': { fr: 'En production', en: 'In production' },
        'Completed': { fr: 'Complétée', en: 'Completed' }
    };

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeSupabase();
        setupLanguageSwitcher();
        loadOrderData();
        setupCommentForm();
    });

    // Initialize Supabase client
    function initializeSupabase() {
        try {
            if (typeof supabase === 'undefined') {
                console.error('Supabase library not loaded');
                return false;
            }
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('✅ Supabase client initialized for order tracking');
            return true;
        } catch (error) {
            console.error('❌ Error initializing Supabase:', error);
            return false;
        }
    }

    // Setup language switcher
    function setupLanguageSwitcher() {
        currentLanguage = localStorage.getItem('language') || 'fr';
        
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            if (btn.dataset.lang === currentLanguage) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', function() {
                const newLang = this.dataset.lang;
                if (newLang !== currentLanguage) {
                    currentLanguage = newLang;
                    localStorage.setItem('language', newLang);
                    
                    langButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    updatePageLanguage();
                    
                    if (orderData) {
                        displayOrder(orderData);
                    }
                }
            });
        });
        
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

    // Load order data from Supabase
    async function loadOrderData() {
        const orderGuid = getUrlParameter('order') || getUrlParameter('guid');
        
        if (!orderGuid) {
            showOrderNotFound();
            return;
        }

        try {
            if (!supabaseClient) {
                throw new Error('Supabase client not initialized');
            }

            console.log('🔍 Searching for order with GUID:', orderGuid);

            // Get order from Supabase
            const { data: order, error: orderError } = await supabaseClient
                .from('Orders')
                .select('*')
                .eq('GuidId', orderGuid)
                .single();

            if (orderError) {
                console.error('❌ Error fetching order:', orderError);
                throw orderError;
            }

            if (!order) {
                console.error('Order not found with GUID:', orderGuid);
                showOrderNotFound();
                return;
            }

            console.log('✅ Order found:', order);

            // Get order lines with product information
            const { data: orderLines, error: linesError } = await supabaseClient
                .from('OrdersLines')
                .select(`
                    *,
                    Products (
                        id,
                        code,
                        title_fr,
                        title_en,
                        description_fr,
                        description_en,
                        icon,
                        price
                    )
                `)
                .eq('orderId', order.id);

            if (linesError) {
                console.error('❌ Error fetching order lines:', linesError);
                throw linesError;
            }

            console.log('✅ Order lines found:', orderLines?.length || 0);

            // Transform the data to match the expected format
            const transformedOrder = {
                orderId: order.id,
                orderGuid: order.GuidId,
                customerFirstName: order.customerFirstName,
                customerLastName: order.customerLastName,
                email: order.email,
                phone: order.phone,
                phoneIsMobile: order.phoneIsMobile,
                language: order.language || 'FR',
                orderNote: order.orderNote,
                totalAmount: order.totalAmount,
                status: order.status,
                scheduledOn: order.scheduledOn || order.created_at,
                deliveryDate: order.deliveryDate,
                deposit: order.deposit || 0,
                paid: order.paid || false,
                orderLines: (orderLines || []).map(line => ({
                    productId: line.Products?.code || `product-${line.productId}`,
                    productName: {
                        fr: line.Products?.title_fr || 'Produit',
                        en: line.Products?.title_en || 'Product'
                    },
                    productDescription: {
                        fr: line.Products?.description_fr || '',
                        en: line.Products?.description_en || ''
                    },
                    productIcon: line.Products?.icon || '🍞',
                    quantityOrdered: line.quantityOrdered,
                    quantityProduced: line.quantityProduced,
                    price: line.price,
                    lineTotal: line.lineTotal,
                    lineStatus: line.lineStatus,
                    scheduledOn: line.scheduledOn
                }))
            };

            // Store order data
            orderData = {
                order: transformedOrder,
                orderStatuses: orderStatuses,
                lineStatuses: lineStatuses
            };

            console.log('📦 Order data prepared for display');

            // Display the order
            displayOrder(orderData);
            
        } catch (error) {
            console.error('❌ Error loading order:', error);
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

        document.getElementById('status-timeline').classList.add('d-none');
        document.getElementById('production-progress').classList.add('d-none');
        document.getElementById('cancelled-status').classList.add('d-none');

        if (status === 'Cancel') {
            document.getElementById('cancelled-status').classList.remove('d-none');
        } else if (status === 'Production') {
            displayProductionProgress(order, lineStatuses);
        } else {
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

        if (currentStatus === 'Plan' && orderData.order.deliveryDate) {
            const plannedDateEl = document.getElementById('planned-date');
            if (plannedDateEl) {
                const deliveryDate = new Date(orderData.order.deliveryDate);
                plannedDateEl.textContent = formatDate(deliveryDate);
            }
        }
    }

    // Display production progress
    function displayProductionProgress(order, lineStatuses) {
        const productionSection = document.getElementById('production-progress');
        productionSection.classList.remove('d-none');

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

        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('completed-items').textContent = completedCount;
        document.getElementById('inprogress-items').textContent = inProgressCount;
        document.getElementById('pending-items').textContent = pendingCount;

        const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
        document.getElementById('progress-percentage').textContent = progressPercentage;
        document.getElementById('progress-text').textContent = progressPercentage;
        
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = progressPercentage + '%';
        progressBar.setAttribute('aria-valuenow', progressPercentage);

        displayProductionItems(order, lineStatuses);
    }

    // Display production items detail
    function displayProductionItems(order, lineStatuses) {
        const container = document.getElementById('production-items');
        container.innerHTML = '';

        order.orderLines.forEach(line => {
            const productName = line.productName[currentLanguage] || line.productId;
            
            const produced = line.quantityProduced || 0;
            const ordered = line.quantityOrdered;
            const itemProgress = ordered > 0 ? Math.round((produced / ordered) * 100) : 0;

            const statusText = lineStatuses[line.lineStatus] ? 
                lineStatuses[line.lineStatus][currentLanguage] : line.lineStatus;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'production-item';
            itemDiv.innerHTML = `
                <div class="production-item-info">
                    <div class="production-item-name">${line.productIcon} ${productName}</div>
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
    function displayOrderItems(order) {
        const container = document.getElementById('order-items');
        container.innerHTML = '';

        order.orderLines.forEach(line => {
            const productName = line.productName[currentLanguage] || line.productId;
            const productDesc = line.productDescription[currentLanguage] || '';

            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${line.productIcon} ${productName}</div>
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

        if (order.deposit && order.deposit > 0) {
            document.getElementById('order-deposit').textContent = formatPrice(order.deposit);
            document.getElementById('deposit-row').style.display = 'flex';
        }

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
    async function submitComment() {
        const commentText = document.getElementById('customer-comment').value.trim();
        
        if (!commentText) {
            return;
        }

        // TODO: Save comment to Supabase (requires a Comments table)
        console.log('Comment submitted:', {
            orderGuid: orderData.order.orderGuid,
            orderId: orderData.order.orderId,
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
