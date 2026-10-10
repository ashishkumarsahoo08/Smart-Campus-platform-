# PowerShell Automated Database Backup Script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$DbFile = Join-Path $ProjectRoot "backend\data\campus_db.json"
$BackupDir = Join-Path $ProjectRoot "backend\data\backups"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

if (Test-Path $DbFile) {
    $Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $Dest = Join-Path $BackupDir "campus_db_$Stamp.json"
    Copy-Item -Path $DbFile -Destination $Dest -Force
    Write-Host "✅ Database snapshot backed up successfully to: $Dest"

    # Prune backups older than 30 days
    Get-ChildItem -Path $BackupDir -Filter "campus_db_*.json" | 
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | 
        Remove-Item -Force
} else {
    Write-Warning "⚠️ Database file $DbFile does not exist yet."
}
