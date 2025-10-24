import json
import codecs

file_path = r"c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Lire le contenu brut
with open(file_path, 'rb') as f:
    raw_content = f.read()

# Décoder en latin-1 puis réencoder en UTF-8
try:
    # Essayer de décoder comme si c'était du latin-1
    content = raw_content.decode('latin-1')
    
    # Mapping des séquences corrompues
    replacements = {
        '\xc3\x83\xc2\xa0': '\xc3\xa0',  # à
        '\xc3\x83\xc2\xa9': '\xc3\xa9',  # é
        '\xc3\x83\xc2\xa8': '\xc3\xa8',  # è
        '\xc3\x83\xc2\xaa': '\xc3\xaa',  # ê
        '\xc3\x83\xc2\xae': '\xc3\xae',  # î
        '\xc3\x83\xc2\xb4': '\xc3\xb4',  # ô
        '\xc3\x83\xc2\xbb': '\xc3\xbb',  # û
        '\xc3\x83\xc2\xa7': '\xc3\xa7',  # ç
    }
    
    # Écrire avec UTF-8 BOM
    with open(file_path, 'w', encoding='utf-8-sig') as f:
        f.write(content)
    
    print("Fichier reécrit en UTF-8 avec BOM")
    
except Exception as e:
    print(f"Erreur: {e}")
