# Rooftop workshop

Built with Blender **5.2.3 LTS** (Windows Steam installation). Editable source: `workshop.blend`. Runtime: `public/models/workshop.glb`. Posters are rendered from the same source with Cycles, 32 samples and AgX, then written directly as WebP (quality 88).

From the repository root, run:

```powershell
& 'C:\Program Files (x86)\Steam\steamapps\common\Blender\blender.exe' --background --factory-startup --python scripts/build-workshop.py
```

This rebuilds the source, GLB and both posters. Change the executable path for other installations. No Python packages, asset downloads or external textures are required. The script intentionally replaces only the generated assets at these paths. It never touches an open Blender document.

The fixed orthographic view looks toward `(0, 1, 1.1)` from `(12, -17, 12)` in Blender coordinates. glTF converts Z-up to Y-up. Interactive empty parents: `drone`, `camera`, `edge`, `bench`, `monitor`, `notebook`, `debug_switch`. The drone owns four independent rotor pivots. `Drone_Inspect` and the rotor clips run together once, returning to their bind pose. Nonanimated meshes are batched by parent/material; lettering and cables are converted to meshes for export.

Three.js recreates cool fill and warm task lighting; Cycles shadows are not baked into the runtime asset. The composition matches the poster, while lighting differs between renderers. Materials use exportable metallic/roughness and emissive surfaces. No procedural shader or compositor dependency.

Measured assets: GLB approximately 3.83 MB, desktop poster 86 KB, mobile poster 51 KB, source blend 746 KB. No LFS or decoder needed. These are file sizes, not a claim about phone performance. See `docs/REDESIGN-IMPLEMENTATION.md` for verification and limits.
