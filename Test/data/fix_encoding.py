#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour corriger l'encodage des émojis dans products.json
"""

import json
import os

# Chemin du fichier
file_path = r"c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Lire le fichier avec l'encodage UTF-8
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Dictionnaire de remplacement pour les caractères mal encodés
replacements = {
    # Émojis
    'ðŸž': '🍞',      # Pain
    'ðŸ¥–': '🥖',     # Baguette
    'ðŸŒ¾': '🌾',     # Blé
    'ðŸ¥': '🥨',      # Bretzel
    'ðŸ¥ž': '🥞',     # Crêpes
    'ðŸ¥¯': '🥯',     # Bagel
    'ðŸ¥': '🥐',      # Croissant
    'ðŸ§€': '🧀',     # Fromage
    'ðŸŒ°': '🌰',     # Noix
    'ðŸŒ¿': '🌿',     # Herbes
    'ðŸ…': '🍅',      # Tomate
    'ðŸ«'': '🫒',    # Olive
    'ðŸ§‚': '🧂',     # Sel
    
    # Caractères accentués français
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
    
    # Apostrophe
    '\\u0027': "'",
}

# Appliquer les remplacements
for old, new in replacements.items():
    content = content.replace(old, new)

# Sauvegarder le fichier corrigé
with open(file_path, 'w', encoding='utf-8-sig') as f:
    f.write(content)

print("✅ Encodage corrigé avec succès!")
print(f"📁 Fichier: {file_path}")
