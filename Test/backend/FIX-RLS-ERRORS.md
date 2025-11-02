# Résolution des erreurs de configuration SMTP

## 🔴 Problème

Lors du chargement de la page `smtp-config.html`, vous obtenez des erreurs:
- "Failed to load resource: 404"
- "Erreur lors de la création des paramètres par défaut: new row violates row-level security policy"
- "Erreur lors de la récupération des paramètres"

## 🎯 Cause

Les erreurs sont causées par les **politiques de sécurité RLS (Row Level Security)** de Supabase qui bloquent:
1. L'insertion automatique de paramètres par défaut
2. La lecture/écriture de la table Parameters

## ✅ Solution

### Option 1: Exécuter le script SQL (Recommandé)

1. **Ouvrez Supabase Dashboard**: https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (dans le menu gauche)
4. Copiez et collez le contenu du fichier `backend/init-parameters-table.sql`
5. Cliquez sur **RUN** pour exécuter le script

Le script va:
- ✅ Créer ou vérifier la table Parameters
- ✅ Créer l'enregistrement par défaut (id=1)
- ✅ Configurer les politiques RLS pour permettre les opérations

### Option 2: Configuration manuelle dans Supabase

#### Étape 1: Créer l'enregistrement

Dans **Table Editor** → **Parameters**:

1. Cliquez sur **Insert** → **Insert row**
2. Remplissez:
   - `id`: 1
   - `smtp`: NULL (ou vide)
   - `port`: NULL
   - `smtp_account`: NULL
   - `smtp_password`: NULL
   - `LastUpdated`: NOW()
3. Cliquez sur **Save**

#### Étape 2: Configurer les politiques RLS

Dans **Authentication** → **Policies** → Table **Parameters**:

**Politique de lecture:**
```sql
CREATE POLICY "Allow read access to all" 
ON "Parameters" FOR SELECT 
USING (true);
```

**Politique de mise à jour:**
```sql
CREATE POLICY "Allow update access to all" 
ON "Parameters" FOR UPDATE 
USING (true)
WITH CHECK (true);
```

**Politique d'insertion:**
```sql
CREATE POLICY "Allow insert access to all" 
ON "Parameters" FOR INSERT 
WITH CHECK (true);
```

## 🔒 Sécurité (Important pour la production)

Les politiques ci-dessus permettent l'accès à **tous les utilisateurs** (même anonymes). 

**En production**, vous devriez:

1. **Restreindre aux utilisateurs authentifiés**:
```sql
-- Lecture authentifiée uniquement
DROP POLICY IF EXISTS "Allow read access to authenticated only" ON "Parameters";
CREATE POLICY "Allow read access to authenticated only" 
ON "Parameters" FOR SELECT 
USING (auth.role() = 'authenticated');

-- Mise à jour authentifiée uniquement
DROP POLICY IF EXISTS "Allow update access to authenticated only" ON "Parameters";
CREATE POLICY "Allow update access to authenticated only" 
ON "Parameters" FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

2. **Utiliser une API backend sécurisée**:
   - Ne jamais exposer les clés Supabase `service_role` dans le frontend
   - Gérer les paramètres SMTP côté serveur uniquement
   - Utiliser l'API backend créée (`backend/email-api-server.js`)

3. **Chiffrement renforcé**:
   - Remplacer le chiffrement XOR par AES-256
   - Utiliser crypto-js ou une bibliothèque de chiffrement robuste
   - Stocker la clé de chiffrement dans les variables d'environnement

## 🧪 Vérification

Après avoir appliqué la solution:

1. **Rafraîchissez** la page `pagesadmin/smtp-config.html`
2. Vous devriez voir:
   ```
   ✅ Connexion Supabase établie
   📋 Paramètres chargés: { id: 1, smtp: null, ... }
   ```
3. Aucune erreur dans la console
4. Le formulaire de configuration s'affiche

## 📝 Notes

- Les fichiers ont été mis à jour pour utiliser `upsert` au lieu de `insert`
- La création automatique de paramètres a été désactivée
- L'enregistrement avec `id=1` est créé une seule fois
- Les mises à jour utilisent toujours `id=1`

## 🆘 Aide supplémentaire

Si les erreurs persistent:

1. Vérifiez que la table `Parameters` existe dans Supabase
2. Vérifiez que l'enregistrement avec `id=1` existe
3. Vérifiez les politiques RLS dans **Authentication** → **Policies**
4. Consultez les logs Supabase dans le dashboard
5. Vérifiez que votre clé API Supabase est correcte dans `database.js`
