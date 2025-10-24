#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script Master pour corriger tous les problèmes d'encodage
des fichiers JSON du projet La Mie du Coin
"""

import json
import os
import sys

# Configuration
DATA_DIR = r"c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data"

# Mapping des icônes pour les produits
PRODUCT_ICONS = {
    'pain-blanc-classique': '🍞',
    'pain-blanc-sans-sucre': '🍞',
    'baguette-francaise': '🥖',
    'baguette-tradition': '🥖',
    'pain-integral-classique': '🌾',
    'pain-integral-graines': '🌾',
    'pain-integral-levain': '🌾',
    'pain-de-campagne': '🌾',
    'pain-aux-noix': '🌰',
    'pain-au-fromage': '🧀',
    'pain-grilled-cheese': '🧀',
    'miche-a-soupe': '🥣',
    'croissants-francais': '🥐',
    'brioche-maison': '🥐',
    'muffins-anglais': '🥐',
    'bretzel-classique': '🥨',
    'bretzel-cannelle-sucre': '🥨',
    'bretzel-bouchees': '🥨',
    'bagel-classique': '🥯',
    'bagel-everything': '🥯',
    'crepes-classiques': '🥞',
    'galettes-sarrasin': '🥞',
    'baguette-sans-gluten': '🌿',
    'focaccia-italienne': '🍅',
    'fougasse-provencale': '🫒',
}

# Mapping des icônes pour les catégories
CATEGORY_ICONS = {
    'pains-base': '🍞',
    'pains-specialises': '🌰',
    'viennoiseries': '🥐',
    'pains-forme': '🥨',
    'sans-gluten': '🌾',
    'pains-mediterraneens': '🇮🇹'
}

# Replacements pour les caractères accentués
ENCODING_FIXES = {
    'Ã\xa0': 'à',
    'Ã ': 'à',
    'Ã¢': 'â',
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ãª': 'ê',
    'Ã«': 'ë',
    'Ã®': 'î',
    'Ã¯': 'ï',
    'Ã´': 'ô',
    'Ã¶': 'ö',
    'Ã»': 'û',
    'Ã¼': 'ü',
    'Ã§': 'ç',
    'Ã‰': 'É',
    'Ãˆ': 'È',
    'ÃŠ': 'Ê',
    'Ã€': 'À',
    'Ã‚': 'Â',
    'Ã"': 'Ô',
    'Ã‡': 'Ç',
    '\\u0027': "'",
}


def fix_text_encoding(content):
    """Corrige les caractères mal encodés dans une chaîne"""
    for old, new in ENCODING_FIXES.items():
        content = content.replace(old, new)
    return content


def fix_products_json():
    """Corrige le fichier products.json"""
    filepath = os.path.join(DATA_DIR, 'products.json')
    
    if not os.path.exists(filepath):
        print(f"❌ {filepath} n'existe pas")
        return False
    
    try:
        # Lire le fichier
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
        
        fixed_products = 0
        fixed_categories = 0
        
        # Corriger les icônes des produits
        if 'products' in data:
            for product in data['products']:
                product_id = product.get('id', '')
                if product_id in PRODUCT_ICONS:
                    product['icon'] = PRODUCT_ICONS[product_id]
                    fixed_products += 1
        
        # Corriger les icônes des catégories
        if 'categories' in data:
            for category in data['categories']:
                category_id = category.get('id', '')
                if category_id in CATEGORY_ICONS:
                    category['icon'] = CATEGORY_ICONS[category_id]
                    fixed_categories += 1
        
        # Sauvegarder
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        print(f"✅ products.json:")
        print(f"   • {fixed_products} icônes de produits corrigées")
        print(f"   • {fixed_categories} icônes de catégories corrigées")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur avec products.json: {e}")
        return False


def fix_json_encoding(filename):
    """Corrige l'encodage d'un fichier JSON"""
    filepath = os.path.join(DATA_DIR, filename)
    
    if not os.path.exists(filepath):
        print(f"⚠️  {filename} n'existe pas")
        return False
    
    try:
        # Lire le contenu
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        # Corriger l'encodage
        fixed_content = fix_text_encoding(content)
        
        # Sauvegarder
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"✅ {filename} - Encodage des caractères accentués corrigé")
        return True
        
    except Exception as e:
        print(f"❌ {filename} - Erreur: {e}")
        return False


def main():
    """Fonction principale"""
    print("🔧 Correction des problèmes d'encodage - La Mie du Coin")
    print("=" * 60)
    print()
    
    # Étape 1: Corriger products.json (icônes + encodage)
    print("📦 Étape 1: Correction de products.json...")
    fix_products_json()
    print()
    
    # Étape 2: Corriger l'encodage de tous les fichiers JSON
    print("📝 Étape 2: Correction de l'encodage des autres fichiers...")
    json_files = ['products.json', 'orders.json', 'document-parameters.json']
    
    for filename in json_files:
        fix_json_encoding(filename)
    
    print()
    print("=" * 60)
    print("🎉 Toutes les corrections sont terminées!")
    print()
    print("💡 Conseils:")
    print("   • Rafraîchissez votre navigateur (Ctrl+F5)")
    print("   • Videz le cache si les icônes ne s'affichent pas")
    print("   • Assurez-vous d'utiliser un serveur local pour tester")
    print()


if __name__ == '__main__':
    main()
