# Script de validation du fichier products.json
# Usage: python validate_products.py

import json
import os

def validate_products_json():
    """Valide le fichier products.json"""
    
    json_path = os.path.join('data', 'products.json')
    
    if not os.path.exists(json_path):
        print("❌ Fichier products.json non trouvé!")
        return False
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("✅ Fichier JSON valide!")
        print()
        
        # Vérifier la structure
        if 'products' not in data:
            print("❌ Clé 'products' manquante!")
            return False
        
        if 'categories' not in data:
            print("❌ Clé 'categories' manquante!")
            return False
        
        # Statistiques
        products = data['products']
        categories = data['categories']
        
        print(f"📊 Statistiques:")
        print(f"   • Nombre de produits: {len(products)}")
        print(f"   • Nombre de catégories: {len(categories)}")
        print()
        
        # Vérifier chaque produit
        required_fields = ['id', 'category', 'title', 'description', 'price', 'icon', 'available']
        errors = []
        
        for idx, product in enumerate(products):
            product_id = product.get('id', f'produit #{idx+1}')
            
            # Vérifier les champs requis
            for field in required_fields:
                if field not in product:
                    errors.append(f"❌ Produit '{product_id}': champ '{field}' manquant")
            
            # Vérifier les traductions
            if 'title' in product:
                if not isinstance(product['title'], dict) or 'fr' not in product['title'] or 'en' not in product['title']:
                    errors.append(f"❌ Produit '{product_id}': titre FR/EN invalide")
            
            if 'description' in product:
                if not isinstance(product['description'], dict) or 'fr' not in product['description'] or 'en' not in product['description']:
                    errors.append(f"❌ Produit '{product_id}': description FR/EN invalide")
        
        if errors:
            print("⚠️  Erreurs de validation:")
            for error in errors[:10]:  # Afficher max 10 erreurs
                print(f"   {error}")
            if len(errors) > 10:
                print(f"   ... et {len(errors) - 10} autres erreurs")
            return False
        
        print("✅ Tous les produits sont valides!")
        print()
        
        # Répartition par catégorie
        print("📦 Produits par catégorie:")
        category_counts = {}
        for product in products:
            cat = product.get('category', 'unknown')
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        for cat in categories:
            cat_id = cat['id']
            count = category_counts.get(cat_id, 0)
            cat_name = cat['name']['fr']
            print(f"   • {cat['icon']} {cat_name}: {count} produits")
        
        print()
        
        # Produits vedettes
        featured = [p for p in products if p.get('featured', False)]
        print(f"⭐ Produits vedettes: {len(featured)}")
        for p in featured:
            print(f"   • {p['icon']} {p['title']['fr']}")
        
        print()
        print("🎉 Validation terminée avec succès!")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Erreur JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == '__main__':
    validate_products_json()
