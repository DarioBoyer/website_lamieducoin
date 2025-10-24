import json

file_path = r"c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Mapping des ID de produits vers leurs icônes correctes
icon_map = {
    'pain-blanc-classique': '\U0001F35E',      # 🍞
    'pain-blanc-sans-sucre': '\U0001F35E',     # 🍞
    'baguette-francaise': '\U0001F956',        # 🥖
    'baguette-tradition': '\U0001F956',        # 🥖
    'pain-integral-classique': '\U0001F33E',   # 🌾
    'pain-integral-graines': '\U0001F33E',     # 🌾
    'pain-integral-levain': '\U0001F33E',      # 🌾
    'pain-de-campagne': '\U0001F33E',          # 🌾
    'pain-aux-noix': '\U0001F330',             # 🌰
    'pain-au-fromage': '\U0001F9C0',           # 🧀
    'pain-grilled-cheese': '\U0001F9C0',       # 🧀
    'miche-a-soupe': '\U0001F963',             # 🥣
    'croissants-francais': '\U0001F950',       # 🥐
    'brioche-maison': '\U0001F950',            # 🥐
    'muffins-anglais': '\U0001F950',           # 🥐
    'bretzel-classique': '\U0001F968',         # 🥨
    'bretzel-cannelle-sucre': '\U0001F968',    # 🥨
    'bretzel-bouchees': '\U0001F968',          # 🥨
    'bagel-classique': '\U0001F96F',           # 🥯
    'bagel-everything': '\U0001F96F',          # 🥯
    'crepes-classiques': '\U0001F95E',         # 🥞
    'galettes-sarrasin': '\U0001F95E',         # 🥞
    'baguette-sans-gluten': '\U0001F33F',      # 🌿
    'focaccia-italienne': '\U0001F345',        # 🍅
    'fougasse-provencale': '\U0001FAD2',       # 🫒
}

# Lire le fichier JSON
with open(file_path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

# Corriger les icônes
count = 0
for product in data['products']:
    product_id = product.get('id', '')
    if product_id in icon_map:
        product['icon'] = icon_map[product_id]
        count += 1
        print(f"✓ {product_id}: {icon_map[product_id]}")

# Sauvegarder le fichier
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"\n✅ {count} icônes corrigées!")
print(f"📁 Fichier sauvegardé: {file_path}")
