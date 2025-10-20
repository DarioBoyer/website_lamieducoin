/**
 * Système de commentaires pour les recettes
 * Utilise Giscus (GitHub Discussions) pour stocker les commentaires
 */

// Configuration Giscus
const GISCUS_CONFIG = {
    repo: 'DarioBoyer/website_lamieducoin',
    repoId: '', // À configurer après activation de Giscus
    category: 'Recettes - Commentaires',
    categoryId: '', // À configurer après activation de Giscus
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    theme: 'light',
    lang: 'fr'
};

/**
 * Initialise le système de commentaires Giscus
 */
function initComments() {
    const commentsContainer = document.getElementById('comments-container');
    
    if (!commentsContainer) {
        console.warn('Container de commentaires non trouvé');
        return;
    }
    
    // Créer le script Giscus
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping);
    script.setAttribute('data-strict', GISCUS_CONFIG.strict);
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled);
    script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata);
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition);
    script.setAttribute('data-theme', GISCUS_CONFIG.theme);
    script.setAttribute('data-lang', GISCUS_CONFIG.lang);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    commentsContainer.appendChild(script);
}

/**
 * Alternative : Système de commentaires local avec localStorage
 * Utile pour tester localement avant d'activer Giscus
 */
function initLocalComments() {
    const commentsContainer = document.getElementById('comments-container');
    
    if (!commentsContainer) {
        return;
    }
    
    const recipeName = document.querySelector('h1').textContent;
    const storageKey = `comments_${recipeName.replace(/\s+/g, '_')}`;
    
    // Créer l'interface de commentaires
    const commentsHTML = `
        <div class="local-comments">
            <h3>💬 Notes et Commentaires</h3>
            <p class="comments-intro">Partagez vos expériences, astuces et modifications de cette recette !</p>
            
            <div class="comment-form">
                <input type="text" id="comment-author" placeholder="Votre nom" class="form-control mb-2" />
                <textarea id="comment-text" placeholder="Votre commentaire..." class="form-control mb-2" rows="4"></textarea>
                <button onclick="addLocalComment()" class="btn btn-primary">Ajouter un commentaire</button>
            </div>
            
            <div id="comments-list" class="comments-list mt-4"></div>
        </div>
    `;
    
    commentsContainer.innerHTML = commentsHTML;
    loadLocalComments();
}

/**
 * Ajoute un commentaire local
 */
function addLocalComment() {
    const author = document.getElementById('comment-author').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    
    if (!author || !text) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const recipeName = document.querySelector('h1').textContent;
    const storageKey = `comments_${recipeName.replace(/\s+/g, '_')}`;
    
    // Récupérer les commentaires existants
    const comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Ajouter le nouveau commentaire
    const newComment = {
        id: Date.now(),
        author: author,
        text: text,
        date: new Date().toISOString()
    };
    
    comments.push(newComment);
    
    // Sauvegarder
    localStorage.setItem(storageKey, JSON.stringify(comments));
    
    // Réinitialiser le formulaire
    document.getElementById('comment-author').value = '';
    document.getElementById('comment-text').value = '';
    
    // Recharger les commentaires
    loadLocalComments();
}

/**
 * Charge les commentaires locaux
 */
function loadLocalComments() {
    const recipeName = document.querySelector('h1').textContent;
    const storageKey = `comments_${recipeName.replace(/\s+/g, '_')}`;
    const comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const commentsList = document.getElementById('comments-list');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">Aucun commentaire pour le moment. Soyez le premier à partager votre expérience !</p>';
        return;
    }
    
    commentsList.innerHTML = comments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <strong class="comment-author">👤 ${escapeHtml(comment.author)}</strong>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${escapeHtml(comment.text)}</div>
            </div>
        `).join('');
}

/**
 * Échappe le HTML pour éviter les injections
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Formate une date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Utiliser le système local pour commencer
    // Une fois Giscus configuré, remplacer par : initComments();
    initLocalComments();
});
