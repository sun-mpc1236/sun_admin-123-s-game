<#
Convert an .fbx file to .glb using a local FBX2glTF binary placed in `tools/bin`.

Usage:
  .\convert-fbx.ps1 -input "models/myModel.fbx" -output "models/myModel.glb"
#>
Param(
    [Parameter(Mandatory=$true)] [string]$input,
    [string]$output = ""
)

if(-not (Test-Path $input)) { Write-Error "Input file not found: $input"; exit 1 }
if($output -eq "") { $output = [System.IO.Path]::ChangeExtension($input, ".glb") }

$toolsBin = Join-Path $PSScriptRoot "bin"
$fbx2gltf = Get-ChildItem -Path $toolsBin -File -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Name -match "fbx2gltf|FBX2glTF|fbx2gltf" } | Select-Object -First 1
if(-not $fbx2gltf) { Write-Error "fbx2gltf binary not found in tools/bin. Place the binary there or run download-tools.ps1 first."; exit 1 }

Write-Host "Using converter: $($fbx2gltf.FullName)"
& $fbx2gltf.FullName -i $input -o $output
if($LASTEXITCODE -ne 0) { Write-Error "Conversion failed (exit $LASTEXITCODE)"; exit $LASTEXITCODE }
Write-Host "Converted: $output"
