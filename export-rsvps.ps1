# Downloads all RSVP records from Firestore and writes them to a CSV file (one row per RSVP).
#
# Prerequisites:
#   - Node.js (https://nodejs.org/)
#   - Firebase/Google credentials (choose one):
#       $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account-key.json"
#     or:
#       gcloud auth application-default login
#
# Usage:
#   .\export-rsvps.ps1
#   .\export-rsvps.ps1 -OutputPath ".\rsvps.csv"

[CmdletBinding()]
param(
    [Alias('o')]
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$ProjectRoot = $PSScriptRoot
Set-Location $ProjectRoot

function Require-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "$Name is required but was not found on PATH."
    }
}

Require-Command node
Require-Command npm

if (-not (Test-Path (Join-Path $ProjectRoot 'node_modules'))) {
    Write-Host 'Installing dependencies (first run only)...'
    npm install --no-fund --no-audit
    if ($LASTEXITCODE -ne 0) {
        throw 'npm install failed.'
    }
}

$nodeArgs = @('export-rsvps.js')
if ($OutputPath) {
    $nodeArgs += @('--output', $OutputPath)
}

& node @nodeArgs
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
