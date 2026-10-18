param(
  [string]$JavaHome = 'C:\Program Files\Android\Android Studio\jbr',
  [string]$AndroidSdk = "$env:LOCALAPPDATA\Android\Sdk"
)
$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
if (!(Test-Path -LiteralPath (Join-Path $JavaHome 'bin/java.exe'))) { throw 'Java não encontrado. Informe -JavaHome.' }
if (!(Test-Path -LiteralPath (Join-Path $AndroidSdk 'platforms/android-36/android.jar'))) { throw 'SDK Android 36 não encontrado. Informe -AndroidSdk.' }
$taskSecretFile = Join-Path $taskRoot 'signing/password.dpapi'
if (!(Test-Path -LiteralPath $taskSecretFile)) { throw 'Chave privada local não configurada. Consulte README.md.' }
$taskSecure = (Get-Content -LiteralPath $taskSecretFile -Raw).Trim() | ConvertTo-SecureString
$taskCredential = [PSCredential]::new('simuladoup-upload', $taskSecure)
$taskOldJava = $env:JAVA_HOME
$taskOldSdk = $env:ANDROID_HOME
$taskOldKey = $env:SIMULADOUP_KEY_PASSWORD
try {
  $env:JAVA_HOME = $JavaHome
  $env:ANDROID_HOME = $AndroidSdk
  $env:SIMULADOUP_KEY_PASSWORD = $taskCredential.GetNetworkCredential().Password
  $taskSdkLine = 'sdk.dir=' + $AndroidSdk.Replace('\', '/').Replace(':', '\:') + "`n"
  [IO.File]::WriteAllText((Join-Path $taskRoot 'local.properties'), $taskSdkLine, [Text.Encoding]::ASCII)
  Push-Location $taskRoot
  try {
    & '.\gradlew.bat' bundleRelease assembleRelease lintRelease --no-daemon --console=plain --max-workers=2 '-Dorg.gradle.jvmargs=-Xmx1536m -Dfile.encoding=UTF-8'
    if ($LASTEXITCODE -ne 0) { throw "Build Android falhou (código $LASTEXITCODE)." }
  } finally { Pop-Location }
} finally {
  $env:JAVA_HOME = $taskOldJava
  $env:ANDROID_HOME = $taskOldSdk
  $env:SIMULADOUP_KEY_PASSWORD = $taskOldKey
  $taskCredential = $null
}
