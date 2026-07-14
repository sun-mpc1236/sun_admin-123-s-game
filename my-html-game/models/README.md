Modely pre hru

Vlozte sem modely, napríklad `LUMA.glb` alebo `LUMA.fbx`, `NOKI.glb` alebo `NOKI.fbx`, `PIXIE.glb` alebo `PIXIE.fbx`.

Ak máte `.fbx` súbory v koreňovom priečinku repozitára, presuňte alebo skopírujte ich sem takto (PowerShell):

```powershell
Move-Item "..\*.fbx" -Destination .\ -Force
```

Po presunutí načíta hra najprv `.glb` súbory a potom `.fbx` ak `.glb` nie je dostupný.
