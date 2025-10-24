$file = "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Lire le contenu
$content = Get-Content -Path $file -Raw -Encoding UTF8

# Corrections - utiliser des caractères Unicode directs
$fixes = @(
    @{old='ðŸž'; new=[char]::ConvertFromUtf32(0x1F35E)},  # 🍞 Pain
    @{old='ðŸ¥–'; new=[char]::ConvertFromUtf32(0x1F956)}, # 🥖 Baguette
    @{old='ðŸŒ¾'; new=[char]::ConvertFromUtf32(0x1F33E)}, # 🌾 Blé
    @{old='ðŸŒ°'; new=[char]::ConvertFromUtf32(0x1F330)}, # 🌰 Noix
    @{old='ðŸ§€'; new=[char]::ConvertFromUtf32(0x1F9C0)}, # 🧀 Fromage
    @{old='ðŸ¥'; new=[char]::ConvertFromUtf32(0x1F950)},  # 🥐 Croissant
    @{old='ðŸ¥£'; new=[char]::ConvertFromUtf32(0x1F963)}, # 🥣 Bol
    @{old='ðŸ¥—'; new=[char]::ConvertFromUtf32(0x1F957)}, # 🥗 Salade
    @{old='ðŸ¥ª'; new=[char]::ConvertFromUtf32(0x1F96A)}, # 🥪 Sandwich
    @{old='ðŸ¥¯'; new=[char]::ConvertFromUtf32(0x1F96F)}, # 🥯 Bagel
    @{old='ðŸ«'; new=[char]::ConvertFromUtf32(0x1F9C6)},  # 🧆 Falafel (backup icon)
    @{old='ðŸ¥¨'; new=[char]::ConvertFromUtf32(0x1F968)}, # 🥨 Pretzel
    @{old='ðŸŒ¿'; new=[char]::ConvertFromUtf32(0x1F33F)}  # 🌿 Herbes
)

# Appliquer les corrections
foreach ($fix in $fixes) {
    $content = $content.Replace($fix.old, $fix.new)
}

# Corriger aussi les caractères accentués
$content = $content.Replace('Ã ', 'à')
$content = $content.Replace('Ã©', 'é')
$content = $content.Replace('Ã¨', 'è')
$content = $content.Replace('Ãª', 'ê')
$content = $content.Replace('Ã®', 'î')
$content = $content.Replace('Ã´', 'ô')
$content = $content.Replace('Ã»', 'û')
$content = $content.Replace('Ã§', 'ç')
$content = $content.Replace('Ã‰', 'É')
$content = $content.Replace('Ã€', 'À')
$content = $content.Replace('\u0027', "'")

# Sauvegarder
[System.IO.File]::WriteAllText($file, $content, [System.Text.UTF8Encoding]::new($false))

Write-Host "Fichier corrige!" -ForegroundColor Green
