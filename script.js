// Animation et interactivité pour La Mie du Coin

// Animation d'entrée au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Animation fade-in pour les éléments
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer tous les éléments animables
    const animatedElements = document.querySelectorAll('.bread-item, .feature-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Animation des emojis au survol
    const breadEmojis = document.querySelectorAll('.bread-emoji');
    breadEmojis.forEach(emoji => {
        emoji.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        emoji.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Animation des icônes de fonctionnalités
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(-5deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Animation du logo principal
    const breadIcon = document.querySelector('.bread-icon');
    if (breadIcon) {
        breadIcon.addEventListener('click', function() {
            this.style.transform = 'scale(1.3) rotate(360deg)';
            this.style.transition = 'transform 0.8s ease';
            
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 800);
        });
    }

    // Ajout d'emojis animés aléatoires
    createFloatingBread();
    
    // Démarrer l'animation du blé toutes les 10 secondes
    setInterval(createFloatingWheat, 10000);
});

// Gestion du formulaire newsletter
function handleNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    const button = event.target.querySelector('button');
    const originalText = button.textContent;
    
    // Animation du bouton
    button.textContent = 'Inscription...';
    button.style.background = '#28a745';
    button.disabled = true;
    
    // Simulation d'envoi (remplacer par vraie logique)
    setTimeout(() => {
        button.textContent = 'Inscrit! 🎉';
        button.style.background = '#28a745';
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'white';
            button.disabled = false;
            event.target.reset();
        }, 3000);
        
        // Afficher un message de confirmation
        showNotification('Merci! Vous serez informé dès l\'ouverture de La Mie du Coin! 🍞');
    }, 1500);
}

// Fonction pour afficher des notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        font-family: 'Merriweather', serif;
        max-width: 300px;
        transform: translateX(400px);
        transition: transform 0.5s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 4000);
}

// Créer des pains flottants aléatoires
function createFloatingBread() {
    const breadEmojis = ['🍞', '🥖', '🥐', '🧀', '🌾'];
    const container = document.body;
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const bread = document.createElement('div');
            bread.textContent = breadEmojis[Math.floor(Math.random() * breadEmojis.length)];
            bread.style.cssText = `
                position: fixed;
                left: -50px;
                top: ${Math.random() * window.innerHeight}px;
                font-size: 2rem;
                z-index: -1;
                opacity: 0.3;
                pointer-events: none;
                animation: floatAcross 15s linear forwards;
            `;
            
            container.appendChild(bread);
            
            // Supprimer après animation
            setTimeout(() => {
                if (bread.parentNode) {
                    bread.parentNode.removeChild(bread);
                }
            }, 15000);
        }, i * 5000);
    }
}

// Créer du blé flottant
function createFloatingWheat() {
    const container = document.body;
    const wheat = document.createElement('div');
    wheat.textContent = '🌾';
    wheat.style.cssText = `
        position: fixed;
        left: -30px;
        top: ${Math.random() * window.innerHeight}px;
        font-size: 1.5rem;
        z-index: -1;
        opacity: 0.2;
        pointer-events: none;
        animation: floatAcross 12s linear forwards;
    `;
    
    container.appendChild(wheat);
    
    setTimeout(() => {
        if (wheat.parentNode) {
            wheat.parentNode.removeChild(wheat);
        }
    }, 12000);
}

// Ajouter les animations CSS dynamiquement
const style = document.createElement('style');
style.textContent = `
    @keyframes floatAcross {
        from {
            transform: translateX(-50px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        to {
            transform: translateX(calc(100vw + 50px)) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Animation au scroll pour le header
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Effet particules sur clic
document.addEventListener('click', function(e) {
    if (e.target.closest('.bread-item, .feature-card')) {
        createClickEffect(e.clientX, e.clientY);
    }
});

function createClickEffect(x, y) {
    const particles = ['✨', '⭐', '🌟'];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 1rem;
            z-index: 1000;
            pointer-events: none;
            animation: explode 1s ease-out forwards;
        `;
        
        // Animation aléatoire pour chaque particule
        const angle = (Math.PI * 2 * i) / 6;
        const distance = 50;
        particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

// Ajouter l'animation des particules
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes explode {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--dx), var(--dy)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Message de bienvenue au chargement
window.addEventListener('load', function() {
    setTimeout(() => {
        showNotification('Bienvenue chez La Mie du Coin! 🍞 Site en construction...');
    }, 2000);
});