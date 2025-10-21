"""
Script de validation du système de panier d'achat
La mie du coin - Test du panier
"""

import json
import os

def validate_cart_system():
    """Valider que tous les fichiers nécessaires au panier existent"""
    
    print("🛒 VALIDATION DU SYSTÈME DE PANIER D'ACHAT")
    print("=" * 60)
    
    test_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Fichiers à vérifier
    files_to_check = {
        'HTML': {
            'pages/commandes.html': 'Page des commandes avec panier'
        },
        'JavaScript': {
            'js/cart.js': 'Logique du panier (ShoppingCart)',
            'js/products.js': 'Gestion des produits',
            'js/main.js': 'Script principal',
            'js/utils.js': 'Fonctions utilitaires',
            'js/translations.js': 'Système de traduction'
        },
        'CSS': {
            'css/cart.css': 'Styles du panier',
            'css/styles.css': 'Styles généraux'
        },
        'Données': {
            'data/products.json': 'Base de données des produits'
        },
        'Documentation': {
            'Docs/README-PANIER.md': 'Documentation du panier',
            'SUMMARY.md': 'Résumé du projet'
        }
    }
    
    all_ok = True
    
    for category, files in files_to_check.items():
        print(f"\n📁 {category}")
        print("-" * 60)
        
        for file_path, description in files.items():
            full_path = os.path.join(test_dir, file_path)
            exists = os.path.exists(full_path)
            
            status = "✅" if exists else "❌"
            print(f"{status} {file_path}")
            print(f"   {description}")
            
            if not exists:
                all_ok = False
    
    # Vérifier le contenu du products.json
    print(f"\n📊 VALIDATION DES DONNÉES")
    print("-" * 60)
    
    products_path = os.path.join(test_dir, 'data', 'products.json')
    
    if os.path.exists(products_path):
        with open(products_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        total_products = len(data.get('products', []))
        available_products = len([p for p in data.get('products', []) if p.get('available', False)])
        categories = len(data.get('categories', []))
        
        print(f"✅ Total de produits: {total_products}")
        print(f"✅ Produits disponibles: {available_products}")
        print(f"✅ Catégories: {categories}")
        
        # Vérifier que tous les produits disponibles ont les champs requis
        required_fields = ['id', 'category', 'title', 'description', 'price', 'icon', 'unit', 'available']
        invalid_products = []
        
        for product in data.get('products', []):
            if product.get('available', False):
                for field in required_fields:
                    if field not in product:
                        invalid_products.append(f"{product.get('id', 'unknown')} - manque '{field}'")
        
        if invalid_products:
            print(f"❌ Produits invalides trouvés:")
            for p in invalid_products:
                print(f"   - {p}")
            all_ok = False
        else:
            print(f"✅ Tous les produits disponibles sont valides")
    else:
        print("❌ Fichier products.json non trouvé!")
        all_ok = False
    
    # Vérifier la structure du cart.js
    print(f"\n🔧 VALIDATION DU CODE")
    print("-" * 60)
    
    cart_js_path = os.path.join(test_dir, 'js', 'cart.js')
    
    if os.path.exists(cart_js_path):
        with open(cart_js_path, 'r', encoding='utf-8') as f:
            cart_content = f.read()
        
        # Vérifier les méthodes essentielles
        essential_methods = [
            'class ShoppingCart',
            'loadCart()',
            'saveCart()',
            'addItem(',
            'updateQuantity(',
            'removeItem(',
            'clearCart()',
            'getTotal()',
            'loadProducts()',
            'displayProducts()',
            'updateCartDisplay()'
        ]
        
        missing_methods = []
        for method in essential_methods:
            if method not in cart_content:
                missing_methods.append(method)
        
        if missing_methods:
            print(f"❌ Méthodes manquantes dans cart.js:")
            for m in missing_methods:
                print(f"   - {m}")
            all_ok = False
        else:
            print(f"✅ Toutes les méthodes essentielles sont présentes")
        
        # Vérifier localStorage
        if 'localStorage' in cart_content:
            print(f"✅ Utilisation de localStorage pour la persistance")
        else:
            print(f"⚠️  Attention: localStorage non détecté")
    else:
        print("❌ Fichier cart.js non trouvé!")
        all_ok = False
    
    # Résumé final
    print("\n" + "=" * 60)
    if all_ok:
        print("✅ TOUS LES TESTS SONT PASSÉS!")
        print("\n🎉 Le système de panier est prêt à être testé!")
        print("\n📝 Prochaines étapes:")
        print("   1. Lancer un serveur local (python -m http.server 8000)")
        print("   2. Ouvrir http://localhost:8000/pages/commandes.html")
        print("   3. Tester l'ajout de produits au panier")
        print("   4. Vérifier le calcul du total")
        print("   5. Consulter Docs/README-PANIER.md pour plus de détails")
    else:
        print("❌ CERTAINS TESTS ONT ÉCHOUÉ")
        print("\n⚠️  Veuillez vérifier les erreurs ci-dessus")
    
    print("=" * 60)
    
    return all_ok

if __name__ == '__main__':
    validate_cart_system()
