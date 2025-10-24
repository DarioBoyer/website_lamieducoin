import json
import re

file_path = r"c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Lire le fichier JSON
with open(file_path, 'r', encoding='utf-8-sig') as f:
    content = f.read()

# Corriger les caractères accentués mal encodés
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

# Sauvegarder
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Caractères accentués corrigés!")
print(f"📁 Fichier: {file_path}")
