# sun_admin-123-s-game

Práca s .fbx súbormi a nasadenie stránky (SK)

Tento repozitár obsahuje jednoduché nástroje a workflow na prácu s `.fbx` modelmi a nasadenie HTML aplikácie `my-html-game` na GitHub Pages.

Čo som pridal:
- `tools/download-tools.ps1` — skript na stiahnutie externých nástrojov do `tools/bin` (ak zadáte URL).
- `tools/convert-fbx.ps1` — skript na konverziu `.fbx` -> `.glb` pomocou lokálneho `fbx2gltf` binárneho súboru v `tools/bin`.
- `.github/workflows/deploy.yml` — GitHub Actions workflow, ktorý nasadí `my-html-game` na GitHub Pages pri push na `main`.

Odporúčané nástroje a postupy:
- Blender (úprava a kontrola `.fbx`): https://www.blender.org/download/
- FBX2glTF (rýchla konverzia .fbx -> .glb/.gltf): nájdite oficiálne release stránky projektu na GitHub a stiahnite Windows binary.

Rýchly príklad konverzie (po stiahnutí `fbx2gltf` do `tools/bin`):

PowerShell:
```
.\tools\convert-fbx.ps1 -input "path\to\model.fbx" -output "path\to\model.glb"
```

Nasadenie na GitHub Pages:
1) Vytvorte repozitár na GitHub a nahrajte tento projekt.
2) Pushnite do vetvy `main`.
3) GitHub Actions workflow automaticky nasadí obsah `my-html-game` na GitHub Pages.

Poznámka: Automatická konverzia `.fbx` v CI by vyžadovala stiahnutie binárky do workflow — je to možné, ale môže byť zložitejšie kvôli veľkým binárkam a licenčným požiadavkám. Tento repozitár poskytuje lokálne skripty a jasné inštrukcie.

