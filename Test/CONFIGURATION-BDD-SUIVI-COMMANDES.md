# Modifications de la base de données Supabase pour le suivi de commandes

## Vue d'ensemble

Ce document décrit les modifications nécessaires à la structure de la base de données Supabase pour supporter le suivi de commandes avec affichage bilingue.

## Modifications requises

### Table `Products`

La table Products doit avoir les colonnes suivantes pour supporter l'affichage bilingue des produits dans le suivi de commandes :

```sql
-- Vérifier/ajouter les colonnes de titre bilingue
ALTER TABLE public."Products" 
ADD COLUMN IF NOT EXISTS title_fr VARCHAR,
ADD COLUMN IF NOT EXISTS title_en VARCHAR,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;
```

### Migration des données existantes

Si vous avez déjà une colonne `title` et `description` (format JSON), vous devrez peut-être migrer les données :

```sql
-- Option 1 : Si les colonnes title et description sont en JSON
UPDATE public."Products"
SET 
    title_fr = (title->>'fr')::VARCHAR,
    title_en = (title->>'en')::VARCHAR,
    description_fr = (description->>'fr')::TEXT,
    description_en = (description->>'en')::TEXT
WHERE title IS NOT NULL;

-- Option 2 : Si vous avez besoin de créer des valeurs par défaut
UPDATE public."Products"
SET 
    title_fr = COALESCE(title_fr, 'Produit'),
    title_en = COALESCE(title_en, 'Product'),
    description_fr = COALESCE(description_fr, ''),
    description_en = COALESCE(description_en, '')
WHERE title_fr IS NULL OR title_en IS NULL;
```

### Exemples de données de produits

Voici comment les produits devraient être structurés dans Supabase :

```sql
-- Exemple d'insertion de produit
INSERT INTO public."Products" (
    id,
    code,
    title_fr,
    title_en,
    description_fr,
    description_en,
    icon,
    price,
    available,
    productType
) VALUES (
    1,
    'pain-blanc',
    'Pain Blanc Classique',
    'Classic White Bread',
    'Pain blanc moelleux et savoureux, parfait pour tous les jours',
    'Soft and tasty white bread, perfect for everyday',
    '🍞',
    4.50,
    true,
    'retail'
);
```

## Mapping des produits

Le système utilise les IDs suivants pour les produits. Assurez-vous que votre base de données contient ces produits avec les bons IDs :

| ID | Code | Nom FR | Nom EN |
|----|------|--------|--------|
| 1 | pain-blanc | Pain Blanc Classique | Classic White Bread |
| 2 | baguette | Baguette Française | French Baguette |
| 3 | pain-campagne | Pain de Campagne | Country Bread |
| 4 | pain-noix | Pain aux Noix | Walnut Bread |
| 5 | pain-fromage | Pain au Fromage | Cheese Bread |
| 6 | croissant | Croissant au Beurre | Butter Croissant |
| 7 | brioche | Brioche Maison | Homemade Brioche |
| 8 | pain-chocolat | Pain au Chocolat | Chocolate Croissant |
| 9 | bagel | Bagel Nature | Plain Bagel |
| 10 | bretzel | Bretzel Classique | Classic Pretzel |
| 11 | pain-sg-classique | Pain Sans Gluten | Gluten-Free Bread |
| 12 | focaccia | Focaccia Italienne | Italian Focaccia |

## Requêtes de test

### Tester la récupération d'une commande

```javascript
// Dans la console du navigateur
const { data, error } = await supabaseClient
    .from('Orders')
    .select('*')
    .eq('GuidId', 'VOTRE-GUID-ICI')
    .single();

console.log('Order:', data);
```

### Tester la récupération des lignes de commande avec produits

```javascript
const { data, error } = await supabaseClient
    .from('OrdersLines')
    .select(`
        *,
        Products (
            id,
            code,
            title_fr,
            title_en,
            description_fr,
            description_en,
            icon,
            price
        )
    `)
    .eq('orderId', 1);

console.log('Order lines:', data);
```

## Vérification de la configuration

### Script SQL pour vérifier la structure

```sql
-- Vérifier les colonnes de la table Products
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'Products'
ORDER BY ordinal_position;

-- Vérifier les produits existants
SELECT id, code, title_fr, title_en, icon, price
FROM public."Products"
ORDER BY id;

-- Vérifier les commandes
SELECT id, "GuidId", "customerFirstName", "customerLastName", status, "totalAmount"
FROM public."Orders"
ORDER BY created_at DESC
LIMIT 10;

-- Vérifier les lignes de commande
SELECT ol.id, ol."orderId", ol."productId", p.code, ol."quantityOrdered", ol."lineTotal"
FROM public."OrdersLines" ol
LEFT JOIN public."Products" p ON p.id = ol."productId"
ORDER BY ol."orderId" DESC, ol.id
LIMIT 10;
```

## Permissions Supabase

Assurez-vous que les permissions suivantes sont configurées :

### Pour la table Orders
```sql
-- Permettre la lecture publique (anonyme) des commandes par GUID
CREATE POLICY "Allow public read access by GUID" 
ON public."Orders"
FOR SELECT
USING (true);
```

### Pour la table OrdersLines
```sql
-- Permettre la lecture publique des lignes de commande
CREATE POLICY "Allow public read access to order lines"
ON public."OrdersLines"
FOR SELECT
USING (true);
```

### Pour la table Products
```sql
-- Permettre la lecture publique des produits
CREATE POLICY "Allow public read access to products"
ON public."Products"
FOR SELECT
USING (true);
```

## Dépannage

### Erreur : Column does not exist

Si vous obtenez une erreur indiquant qu'une colonne n'existe pas (par exemple `title_fr`), exécutez les commandes ALTER TABLE ci-dessus.

### Erreur : Foreign key violation

Assurez-vous que tous les `productId` dans `OrdersLines` correspondent à des IDs valides dans la table `Products`.

### Produits non affichés

Vérifiez que :
1. Les colonnes `title_fr` et `title_en` sont remplies
2. La relation entre `OrdersLines` et `Products` fonctionne
3. Les permissions de lecture sont correctement configurées

## Notes importantes

1. **Sécurité** : Les commandes sont accessibles publiquement via leur GUID. Assurez-vous que les GUIDs sont suffisamment complexes et uniques.

2. **Performance** : Pour de meilleures performances, créez un index sur la colonne `GuidId` :
   ```sql
   CREATE INDEX IF NOT EXISTS idx_orders_guidid ON public."Orders"("GuidId");
   ```

3. **Données sensibles** : Ne stockez jamais d'informations de carte de crédit ou autres données sensibles dans ces tables.

## Support

Pour toute question concernant la configuration de la base de données, consultez :
- Documentation Supabase : https://supabase.com/docs
- Code source : `Test/js/order-tracking-supabase.js`
