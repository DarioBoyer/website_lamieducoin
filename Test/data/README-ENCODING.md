# Scripts de Correction d'Encodage

Ce dossier contient des scripts Python pour corriger les problèmes d'encodage dans les fichiers JSON du projet.

## Problème

Les fichiers JSON créés ou modifiés avec PowerShell peuvent avoir des problèmes d'encodage, notamment:
- Les émojis (🍞, 🥖, etc.) s'affichent comme `ðŸž`, `ðŸ¥–`
- Les caractères accentués français (à, é, è) s'affichent comme `Ã `, `Ã©`, `Ã¨`

## Solution

### Script Principal (Recommandé)

**`fix_encoding_master.py`** - Script complet qui corrige tout en une seule exécution:

```bash
python fix_encoding_master.py
```

Ce script va:
1. Corriger toutes les icônes des produits (23 produits)
2. Corriger toutes les icônes des catégories (6 catégories)
3. Corriger tous les caractères accentués dans tous les fichiers JSON

### Scripts Spécialisés

Si vous avez besoin de corrections spécifiques:

- **`fix_icons_final.py`** - Corrige uniquement les icônes des produits
- **`fix_category_icons.py`** - Corrige uniquement les icônes des catégories  
- **`fix_accents.py`** - Corrige uniquement les caractères accentués
- **`fix_all_json_encoding.py`** - Corrige l'encodage de tous les JSON

## Utilisation

1. Ouvrir PowerShell dans le dossier `Test/data`
2. Exécuter le script master:
   ```bash
   python fix_encoding_master.py
   ```
3. Rafraîchir le navigateur (Ctrl+F5) pour voir les changements

## Prévention

Pour éviter ces problèmes à l'avenir:

1. **Utilisez Python** au lieu de PowerShell pour modifier les fichiers JSON
2. **Toujours utiliser l'encodage UTF-8** (sans BOM pour JSON)
3. **Ne jamais copier/coller** des émojis directement dans PowerShell
4. **Utiliser des codes Unicode** (`\u1F35E`) au lieu d'émojis directs dans les scripts

## Mapping des Icônes

### Produits
- Pain blanc: 🍞 (`\u1F35E`)
- Baguette: 🥖 (`\u1F956`)
- Pain intégral: 🌾 (`\u1F33E`)
- Noix: 🌰 (`\u1F330`)
- Fromage: 🧀 (`\u1F9C0`)
- Croissant: 🥐 (`\u1F950`)
- Bagel: 🥯 (`\u1F96F`)
- Bretzel: 🥨 (`\u1F968`)
- Crêpes: 🥞 (`\u1F95E`)
- Herbes: 🌿 (`\u1F33F`)
- Tomate: 🍅 (`\u1F345`)
- Olive: 🫒 (`\u1FAD2`)

### Catégories
- Pains de base: 🍞
- Pains spécialisés: 🌰
- Viennoiseries: 🥐
- Pains en forme: 🥨
- Sans gluten: 🌾
- Méditerranéens: 🇮🇹

## Fichiers Corrigés

- `products.json` - Produits et catégories
- `orders.json` - Commandes
- `document-parameters.json` - Paramètres système

## Support

Si vous rencontrez des problèmes, vérifiez:
1. Python est installé (`python --version`)
2. Vous êtes dans le bon répertoire
3. Les fichiers JSON existent
4. Vous avez les permissions d'écriture
