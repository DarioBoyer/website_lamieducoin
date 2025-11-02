-- Script SQL pour initialiser la table Parameters dans Supabase
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Créer ou vérifier l'existence de la table Parameters
CREATE TABLE IF NOT EXISTS "Parameters" (
    id INTEGER PRIMARY KEY,
    smtp TEXT,
    port INTEGER,
    smtp_account TEXT,
    smtp_password TEXT,
    "LastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer l'enregistrement par défaut (id=1)
INSERT INTO "Parameters" (id, smtp, port, smtp_account, smtp_password, "LastUpdated")
VALUES (1, NULL, NULL, NULL, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Activer Row Level Security (RLS)
ALTER TABLE "Parameters" ENABLE ROW LEVEL SECURITY;

-- 4. Créer une politique pour permettre la LECTURE à tous (authentifiés et anonymes)
DROP POLICY IF EXISTS "Allow read access to all" ON "Parameters";
CREATE POLICY "Allow read access to all" 
ON "Parameters" FOR SELECT 
USING (true);

-- 5. Créer une politique pour permettre la MISE À JOUR à tous
-- (En production, restreindre ceci aux utilisateurs authentifiés)
DROP POLICY IF EXISTS "Allow update access to all" ON "Parameters";
CREATE POLICY "Allow update access to all" 
ON "Parameters" FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 6. Créer une politique pour permettre l'INSERTION à tous
-- (En production, restreindre ceci aux utilisateurs authentifiés)
DROP POLICY IF EXISTS "Allow insert access to all" ON "Parameters";
CREATE POLICY "Allow insert access to all" 
ON "Parameters" FOR INSERT 
WITH CHECK (true);

-- 7. Vérifier que l'enregistrement existe
SELECT * FROM "Parameters" WHERE id = 1;

-- Note: En production, vous devriez:
-- 1. Restreindre les politiques RLS aux utilisateurs authentifiés seulement
-- 2. Utiliser un service role key côté serveur pour les opérations sensibles
-- 3. Ne jamais exposer la clé de service dans le code frontend

-- Exemple de politique RLS plus sécurisée (à utiliser en production):
/*
DROP POLICY IF EXISTS "Allow update access to authenticated only" ON "Parameters";
CREATE POLICY "Allow update access to authenticated only" 
ON "Parameters" FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
*/
