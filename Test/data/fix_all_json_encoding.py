import json
import os

# Répertoire des données
data_dir = r"c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data"

# Liste des fichiers JSON à corriger
json_files = ['products.json', 'orders.json', 'document-parameters.json']

# Corrections d'encodage à appliquer
def fix_encoding(content):
    """Corrige les caractères mal encodés"""
    replacements = {
        'Ã\xa0': 'à',    # à avec espace insécable
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
    
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    return content

# Parcourir et corriger chaque fichier
for filename in json_files:
    filepath = os.path.join(data_dir, filename)
    
    if not os.path.exists(filepath):
        print(f"⚠️  {filename} n'existe pas")
        continue
    
    try:
        # Lire le contenu
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        # Corriger l'encodage
        fixed_content = fix_encoding(content)
        
        # Sauvegarder
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"✅ {filename} - Encodage corrigé")
    
    except Exception as e:
        print(f"❌ {filename} - Erreur: {e}")

print("\n🎉 Tous les fichiers JSON ont été traités!")
