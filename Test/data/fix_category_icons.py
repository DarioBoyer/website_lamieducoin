import json

file_path = r"c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Mapping des catégories vers leurs icônes correctes
category_icons = {
    'pains-base': '🍞',
    'pains-specialises': '🌰',
    'viennoiseries': '🥐',
    'pains-forme': '🥨',
    'sans-gluten': '🌾',
    'pains-mediterraneens': '🇮🇹'
}

# Lire le fichier JSON
with open(file_path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

# Corriger les icônes des catégories
if 'categories' in data:
    for category in data['categories']:
        category_id = category.get('id', '')
        if category_id in category_icons:
            category['icon'] = category_icons[category_id]
            print(f"✓ Catégorie {category_id}: {category_icons[category_id]}")

# Sauvegarder le fichier
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"\n✅ Icônes des catégories corrigées!")
print(f"📁 Fichier: {file_path}")
