<#
PowerShell helper to download external tools into the repository `tools/bin` folder.

Usage examples:
  .\download-tools.ps1 -fbx2gltfUrl "https://example.com/path/to/fbx2gltf.exe"

If you don't provide a URL the script prints manual instructions.
#>
Param(
    [string]$fbx2gltfUrl = ""
)

$toolsDir = Join-Path $PSScriptRoot "bin"
if(-not (Test-Path $toolsDir)) { New-Item -ItemType Directory -Path $toolsDir | Out-Null }

if($fbx2gltfUrl -ne "") {
    $fileName = Split-Path $fbx2gltfUrl -Leaf
    $out = Join-Path $toolsDir $fileName
    Write-Host "Downloading $fbx2gltfUrl -> $out"
    Invoke-WebRequest -Uri $fbx2gltfUrl -OutFile $out -UseBasicParsing
    Write-Host "Downloaded to $out"
} else {
    Write-Host "No URL provided. Manual install instructions follow:`n"
    Write-Host "1) Blender (recommended for editing/inspecting .fbx): https://www.blender.org/download/"
    Write-Host "2) FBX2glTF (convert .fbx -> .glb/.gltf) — see the project's GitHub releases and download the Windows binary:" 
    Write-Host "   e.g. https://github.com/facebookresearch/FBX2glTF/releases or the project's release page"
    Write-Host "3) Place the downloaded binary into the repository 'tools/bin' folder and run 'tools/convert-fbx.ps1' to convert files."
}
