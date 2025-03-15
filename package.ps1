# Script de packaging pour l'extension Calculateur de Moyenne - École Directe
# Ce script crée deux versions de l'extension, une pour Chrome et une pour Firefox

# Nettoyer les répertoires de sortie existants
$outputDir = ".\dist"
if (Test-Path -Path $outputDir) {
    Remove-Item -Path $outputDir -Recurse -Force
}

# Création des répertoires pour Chrome et Firefox
New-Item -ItemType Directory -Path "$outputDir\chrome" -Force
New-Item -ItemType Directory -Path "$outputDir\firefox" -Force

# Liste d'exclusion explicite
$excludeDirs = @("dist", "node_modules", ".git", "keys")

# Copie des fichiers (sans la copie récursive qui cause le problème)
$files = Get-ChildItem -Path "." -File | Where-Object { 
    $_.Name -notlike "manifest*.json" -and 
    $_.Name -ne "package.ps1" 
}

foreach ($file in $files) {
    Copy-Item -Path $file.FullName -Destination "$outputDir\chrome\"
    Copy-Item -Path $file.FullName -Destination "$outputDir\firefox\"
}

# Copie des dossiers (sans la copie récursive)
$directories = Get-ChildItem -Path "." -Directory | Where-Object { $excludeDirs -notcontains $_.Name }
foreach ($dir in $directories) {
    # Crée le dossier de destination s'il n'existe pas
    $chromeDestDir = "$outputDir\chrome\$($dir.Name)"
    $firefoxDestDir = "$outputDir\firefox\$($dir.Name)"
    
    if (!(Test-Path -Path $chromeDestDir)) {
        New-Item -ItemType Directory -Path $chromeDestDir -Force
    }
    if (!(Test-Path -Path $firefoxDestDir)) {
        New-Item -ItemType Directory -Path $firefoxDestDir -Force
    }
    
    # Copie le contenu du dossier
    Copy-Item -Path "$($dir.FullName)\*" -Destination $chromeDestDir -Recurse -Force
    Copy-Item -Path "$($dir.FullName)\*" -Destination $firefoxDestDir -Recurse -Force
}

# Copie des manifests
Copy-Item -Path "manifest_chrome.json" -Destination "$outputDir\chrome\manifest.json" -Force
Copy-Item -Path "manifest.json" -Destination "$outputDir\firefox\manifest.json" -Force

Write-Host "Packaging terminé avec succès !"
Write-Host "Version Chrome : $outputDir\chrome"
Write-Host "Version Firefox : $outputDir\firefox" 