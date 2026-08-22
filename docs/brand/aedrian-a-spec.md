# Aedrian Ponce — Procedural 3D "A" Monolith Specification

## Identity & Brand Mark Overview

The A-mark is a procedural, architectural 3D monolith composed of three interlocking chamfered structural beams forming the letter "A" through faceted silhouette, negative space aperture, and dual physical materials.

- **Primary Motif**: Interlocking Impossible Monolith
- **Optical Architecture**: At the default front 3/4 hero camera angle, the geometry reads as a continuous impossible monolith; orbiting reveals a physically coherent manifold interlock.
- **Aperture & Seam**: Precision triangular negative-space aperture with a narrow central crossbar seam.

---

## Deliverables & Asset Audit

| Asset | Path | Format | Size | Purpose | Status |
|---|---|---|---|---|---|
| Master Scene | `brand/aedrian-a.blend` | Blender 5.0 | ~250 KB | Authoritative procedural source | Verified |
| Web Model | `public/brand/aedrian-a.glb` | glTF 2.0 Binary | 12.9 KB (Target $\le 150$ KB) | R3F 3D Hero Island | Verified |
| Presentation Render | `public/brand/aedrian-a-transparent.png` | 2048x2048 RGBA PNG | 2711.7 KB | High-res showcase & press | Verified |
| Hero Poster Fallback | `src/assets/brand/aedrian-a-poster.webp` | 1920x1440 WebP | 33.0 KB (Target $\le 180$ KB) | Reduced-motion & WebGL fallback | Verified |
| Vector Silhouette | `public/brand/aedrian-a.svg` | SVG Vector | ~2.5 KB | Header icon, favicon, metadata | Verified |

---

## Material & Lighting Parameters

### 1. Obsidian Ceramic (`Obsidian_Ceramic`)
- **Base Color**: `#070809` (Linear `[0.003, 0.004, 0.005, 1.0]`)
- **Metallic**: `0.08`
- **Roughness**: `0.18`
- **Clearcoat Weight**: `0.72`
- **Clearcoat Roughness**: `0.08`
- **Index of Refraction (IOR)**: `1.55`

### 2. Palladium Inlay (`Palladium_Inlay`)
- **Base Color**: `#C8CDD0` (Linear `[0.577, 0.608, 0.627, 1.0]`)
- **Metallic**: `0.94`
- **Roughness**: `0.14`
- **Specular**: `1.0`
- **Index of Refraction (IOR)**: `2.50`

### 3. Lighting & Cold-Arc Reflection
- **Key Light**: Area Light, 600W, Position `(-3.2, -4.5, 3.8)`, Color `#F5F5F7`
- **Cold-Arc Rim Light**: Area Light, 850W, Position `(3.5, 3.2, 3.0)`, Color `#8EBBC8` (Signature cold reflection)
- **Fill Light**: Area Light, 220W, Position `(0.0, -3.8, -1.5)`, Color `#D4D8DC`
- **Camera Pose**: Lens 65mm, Position `(2.4, -4.6, 2.0)`, Target `(0.0, 0.0, 0.1)`

---

## Deterministic Generation Command

To regenerate the entire asset pack from an empty scene:

```bash
blender --background --python scripts/generate-aedrian-mark.py
```

## Ownership & Clean-Room License
All geometry, math, shaders, and procedural definitions in this specification are custom-authored for Aedrian Ponce (`businesses/aedrian-portfolio`). No third-party meshes, proprietary font extrusions, or legacy Aescent geometry are used.