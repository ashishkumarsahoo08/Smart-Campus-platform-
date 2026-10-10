Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Smart Campus Android APK Rebuilder" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$env:JAVA_HOME = "E:\smart-campus-platform\build-tools\jdk-21"
$env:ANDROID_HOME = "E:\smart-campus-platform\build-tools\android-sdk"
$env:ANDROID_SDK_ROOT = "E:\smart-campus-platform\build-tools\android-sdk"
$env:PATH = "E:\smart-campus-platform\build-tools\jdk-21\bin;E:\smart-campus-platform\build-tools\android-sdk\cmdline-tools\latest\bin;E:\smart-campus-platform\build-tools\android-sdk\platform-tools;$env:PATH"

Write-Host "1. Syncing Web Assets to Android Project..." -ForegroundColor Yellow
Set-Location "E:\smart-campus-platform"
& npx.cmd cap copy android

Write-Host "2. Compiling Debug APK via Gradle..." -ForegroundColor Yellow
Set-Location "E:\smart-campus-platform\android"
& .\gradlew.bat assembleDebug

$sourceApk = "E:\smart-campus-platform\android\app\build\outputs\apk\debug\app-debug.apk"
$destApk = "E:\smart-campus-platform\SmartCampus-debug.apk"

if (Test-Path $sourceApk) {
    Copy-Item -Path $sourceApk -Destination $destApk -Force
    $fileInfo = Get-Item $destApk
    Write-Host ""
    Write-Host "[SUCCESS] APK ready at: $($fileInfo.FullName)" -ForegroundColor Green
    Write-Host "File Size: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "[ERROR] APK compilation failed." -ForegroundColor Red
}
