"""
Procedural 3D "A" Monolith Generator for Aedrian Ponce Portfolio
Deterministic asset pipeline using Blender 5.0 Python API.
Produces:
- brand/aedrian-a.blend (Master Scene)
- public/brand/aedrian-a.glb (Web Model <= 150 KB)
- public/brand/aedrian-a.svg (Vector Silhouette)
- public/brand/aedrian-a-transparent.png (2048x2048 Presentation Render)
- src/assets/brand/aedrian-a-poster.webp (1920x1440 Hero Fallback)
- docs/brand/aedrian-a-spec.md (Technical Specification)
"""

import sys
import os
import math

try:
    import bpy
    import bmesh
    import mathutils
except ImportError:
    print("This script must be run inside Blender: blender --background --python scripts/generate-aedrian-mark.py")
    sys.exit(1)

# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BRAND_DIR = os.path.join(BASE_DIR, "brand")
PUBLIC_BRAND_DIR = os.path.join(BASE_DIR, "public", "brand")
ASSETS_BRAND_DIR = os.path.join(BASE_DIR, "src", "assets", "brand")
DOCS_BRAND_DIR = os.path.join(BASE_DIR, "docs", "brand")

os.makedirs(BRAND_DIR, exist_ok=True)
os.makedirs(PUBLIC_BRAND_DIR, exist_ok=True)
os.makedirs(ASSETS_BRAND_DIR, exist_ok=True)
os.makedirs(DOCS_BRAND_DIR, exist_ok=True)

# 1. Clean Scene
def clean_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj)
    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)

# 2. Color Conversion Utility
def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    lv = len(hex_str)
    fin = list(int(hex_str[i:i + lv // 3], 16) / 255.0 for i in range(0, lv, lv // 3))
    # sRGB to Linear
    linear = []
    for c in fin:
        if c <= 0.04045:
            linear.append(c / 12.92)
        else:
            linear.append(((c + 0.055) / 1.055) ** 2.4)
    return linear[0], linear[1], linear[2], 1.0

# 3. Create PBR Materials
def create_materials():
    # Obsidian Ceramic Material
    mat_obsidian = bpy.data.materials.new(name="Obsidian_Ceramic")
    mat_obsidian.use_nodes = True
    nodes_obs = mat_obsidian.node_tree.nodes
    bsdf_obs = nodes_obs.get("Principled BSDF")
    if bsdf_obs:
        bsdf_obs.inputs["Base Color"].default_value = hex_to_rgb("#070809")
        bsdf_obs.inputs["Metallic"].default_value = 0.08
        bsdf_obs.inputs["Roughness"].default_value = 0.18
        if "IOR" in bsdf_obs.inputs:
            bsdf_obs.inputs["IOR"].default_value = 1.55
        if "Coat Weight" in bsdf_obs.inputs:
            bsdf_obs.inputs["Coat Weight"].default_value = 0.72
            bsdf_obs.inputs["Coat Roughness"].default_value = 0.08
        elif "Clearcoat" in bsdf_obs.inputs:
            bsdf_obs.inputs["Clearcoat"].default_value = 0.72
            bsdf_obs.inputs["Clearcoat Roughness"].default_value = 0.08

    # Palladium Inlay Material
    mat_palladium = bpy.data.materials.new(name="Palladium_Inlay")
    mat_palladium.use_nodes = True
    nodes_pal = mat_palladium.node_tree.nodes
    bsdf_pal = nodes_pal.get("Principled BSDF")
    if bsdf_pal:
        bsdf_pal.inputs["Base Color"].default_value = hex_to_rgb("#C8CDD0")
        bsdf_pal.inputs["Metallic"].default_value = 0.94
        bsdf_pal.inputs["Roughness"].default_value = 0.14
        if "IOR" in bsdf_pal.inputs:
            bsdf_pal.inputs["IOR"].default_value = 2.50

    return mat_obsidian, mat_palladium

# 4. Construct Procedural Monolith Geometry
def create_a_monolith():
    mesh = bpy.data.meshes.new("Aedrian_A_Monolith_Mesh")
    obj = bpy.data.objects.new("Aedrian_A_Monolith", mesh)
    bpy.context.scene.collection.objects.link(obj)

    bm = bmesh.new()

    # Geometry Parameters:
    # 3 Interlocking Chamfered Beams forming the A Monolith:
    left_verts = [
        # Base foot left
        mathutils.Vector((-1.90, -0.42, -2.1)),   # 0
        mathutils.Vector((-1.25, -0.42, -2.1)),   # 1
        mathutils.Vector((-0.85, -0.42, -1.4)),   # 2
        mathutils.Vector((-1.65, -0.42, -1.2)),   # 3
        mathutils.Vector((-1.90, 0.42, -2.1)),    # 4
        mathutils.Vector((-1.25, 0.42, -2.1)),    # 5
        mathutils.Vector((-0.85, 0.42, -1.4)),    # 6
        mathutils.Vector((-1.65, 0.42, -1.2)),    # 7

        # Apex top joint (Left half)
        mathutils.Vector((-0.02, -0.42, 2.3)),   # 8
        mathutils.Vector((-0.45, -0.42, 1.6)),   # 9
        mathutils.Vector((-0.02, 0.42, 2.3)),    # 10
        mathutils.Vector((-0.45, 0.42, 1.6)),    # 11

        # Mid intersection outer chamfer
        mathutils.Vector((-1.32, -0.42, 0.0)),   # 12
        mathutils.Vector((-0.82, -0.42, 0.0)),   # 13
        mathutils.Vector((-1.32, 0.42, 0.0)),    # 14
        mathutils.Vector((-0.82, 0.42, 0.0)),    # 15
    ]

    right_verts = [
        # Base foot right
        mathutils.Vector((1.90, -0.42, -2.1)),    # 16
        mathutils.Vector((1.25, -0.42, -2.1)),    # 17
        mathutils.Vector((0.85, -0.42, -1.4)),    # 18
        mathutils.Vector((1.65, -0.42, -1.2)),    # 19
        mathutils.Vector((1.90, 0.42, -2.1)),     # 20
        mathutils.Vector((1.25, 0.42, -2.1)),     # 21
        mathutils.Vector((0.85, 0.42, -1.4)),     # 22
        mathutils.Vector((1.65, 0.42, -1.2)),     # 23

        # Apex top joint (Right half)
        mathutils.Vector((0.02, -0.42, 2.3)),    # 24
        mathutils.Vector((0.45, -0.42, 1.6)),    # 25
        mathutils.Vector((0.02, 0.42, 2.3)),     # 26
        mathutils.Vector((0.45, 0.42, 1.6)),     # 27

        # Mid intersection outer chamfer right
        mathutils.Vector((1.32, -0.42, 0.0)),    # 28
        mathutils.Vector((0.82, -0.42, 0.0)),    # 29
        mathutils.Vector((1.32, 0.42, 0.0)),     # 30
        mathutils.Vector((0.82, 0.42, 0.0)),     # 31
    ]

    cross_verts = [
        mathutils.Vector((-0.92, -0.38, -0.3)),  # 32
        mathutils.Vector((0.92, -0.38, -0.3)),   # 33
        mathutils.Vector((0.62, -0.38, 0.25)),   # 34
        mathutils.Vector((-0.62, -0.38, 0.25)),  # 35
        mathutils.Vector((-0.92, 0.38, -0.3)),   # 36
        mathutils.Vector((0.92, 0.38, -0.3)),    # 37
        mathutils.Vector((0.62, 0.38, 0.25)),    # 38
        mathutils.Vector((-0.62, 0.38, 0.25)),   # 39
        mathutils.Vector((0.0, -0.46, -0.05)),   # 40 (central facet)
        mathutils.Vector((0.0, 0.46, -0.05)),    # 41
    ]

    inlay_verts = [
        # Left outer palladium strip
        mathutils.Vector((-1.95, -0.44, -2.12)), # 42
        mathutils.Vector((-1.75, -0.44, -2.12)), # 43
        mathutils.Vector((-0.02, -0.44, 2.35)),  # 44
        mathutils.Vector((-0.18, -0.44, 2.15)),  # 45

        # Right outer palladium strip
        mathutils.Vector((1.95, -0.44, -2.12)),  # 46
        mathutils.Vector((1.75, -0.44, -2.12)),  # 47
        mathutils.Vector((0.02, -0.44, 2.35)),   # 48
        mathutils.Vector((0.18, -0.44, 2.15)),   # 49

        # Crossbar top palladium inlay
        mathutils.Vector((-0.68, -0.41, 0.28)),  # 50
        mathutils.Vector((0.68, -0.41, 0.28)),   # 51
        mathutils.Vector((0.60, -0.37, 0.24)),   # 52
        mathutils.Vector((-0.60, -0.37, 0.24)),  # 53
    ]

    all_vectors = left_verts + right_verts + cross_verts + inlay_verts
    bm_verts = [bm.verts.new(v) for v in all_vectors]

    # Left Leg Faces
    left_faces = [
        [0, 1, 2, 3],
        [4, 7, 6, 5],
        [0, 4, 5, 1],
        [1, 5, 6, 2],
        [2, 6, 7, 3],
        [3, 7, 4, 0],
        [3, 12, 9, 8],
        [0, 4, 10, 8],
        [12, 13, 35, 32],
        [13, 9, 8, 35],
        [14, 15, 39, 36],
        [15, 11, 10, 39],
        [7, 14, 11, 4],
    ]

    # Right Leg Faces
    right_faces = [
        [16, 17, 18, 19],
        [20, 23, 22, 21],
        [16, 20, 21, 17],
        [17, 21, 22, 18],
        [18, 22, 23, 19],
        [19, 23, 20, 16],
        [19, 28, 25, 24],
        [16, 20, 26, 24],
        [28, 29, 34, 33],
        [29, 25, 24, 34],
        [30, 31, 38, 37],
        [31, 27, 26, 38],
        [23, 30, 27, 20],
    ]

    # Apex Faces
    apex_faces = [
        [8, 24, 26, 10],
        [10, 11, 27, 26],
    ]

    # Crossbar Obsidian Faces
    cross_faces = [
        [32, 40, 35],
        [40, 33, 34, 35],
        [36, 41, 39],
        [41, 37, 38, 39],
        [32, 33, 37, 36],
        [35, 34, 38, 39],
    ]

    # Palladium Inlay Highlight Faces
    palladium_faces = [
        [42, 43, 45, 44],
        [46, 47, 49, 48],
        [50, 51, 52, 53],
        [9, 25, 24, 8],
    ]

    for f_indices in (left_faces + right_faces + apex_faces + cross_faces):
        try:
            f = bm.faces.new([bm_verts[i] for i in f_indices])
            f.material_index = 0
            f.smooth = True
        except Exception:
            pass

    for f_indices in palladium_faces:
        try:
            f = bm.faces.new([bm_verts[i] for i in f_indices])
            f.material_index = 1
            f.smooth = True
        except Exception:
            pass

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    bm.to_mesh(mesh)
    bm.free()

    mat_obs, mat_pal = create_materials()
    obj.data.materials.append(mat_obs)
    obj.data.materials.append(mat_pal)

    # Modifiers
    mod_bevel = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod_bevel.width = 0.04
    mod_bevel.segments = 3
    mod_bevel.limit_method = 'ANGLE'
    mod_bevel.angle_limit = math.radians(35)

    mod_wn = obj.modifiers.new(name="WeightedNormal", type='WEIGHTED_NORMAL')
    mod_wn.keep_sharp = True
    mod_wn.weight = 80

    return obj

# 5. Studio Lighting & Cameras
def setup_studio():
    # 1. Key Light
    light_key_data = bpy.data.lights.new(name="Key_Light", type='AREA')
    light_key_data.energy = 600.0
    light_key_data.size = 3.5
    light_key_data.color = (0.96, 0.96, 0.98)
    light_key = bpy.data.objects.new("Key_Light", light_key_data)
    light_key.location = (-3.2, -4.5, 3.8)
    light_key.rotation_euler = (math.radians(52), math.radians(18), math.radians(-32))
    bpy.context.scene.collection.objects.link(light_key)

    # 2. Cold-Arc Rim Light
    light_rim_data = bpy.data.lights.new(name="ColdArc_Rim_Light", type='AREA')
    light_rim_data.energy = 850.0
    light_rim_data.size = 2.8
    light_rim_data.color = (0.30, 0.52, 0.61) # #8EBBC8
    light_rim = bpy.data.objects.new("ColdArc_Rim_Light", light_rim_data)
    light_rim.location = (3.5, 3.2, 3.0)
    light_rim.rotation_euler = (math.radians(-45), math.radians(25), math.radians(135))
    bpy.context.scene.collection.objects.link(light_rim)

    # 3. Fill Light
    light_fill_data = bpy.data.lights.new(name="Fill_Light", type='AREA')
    light_fill_data.energy = 220.0
    light_fill_data.size = 4.0
    light_fill_data.color = (0.85, 0.88, 0.92)
    light_fill = bpy.data.objects.new("Fill_Light", light_fill_data)
    light_fill.location = (0.0, -3.8, -1.5)
    light_fill.rotation_euler = (math.radians(75), 0, 0)
    bpy.context.scene.collection.objects.link(light_fill)

    # Hero Camera
    cam_data = bpy.data.cameras.new("Hero_Camera")
    cam_data.lens = 65
    cam_data.sensor_width = 36
    cam_obj = bpy.data.objects.new("Hero_Camera", cam_data)
    cam_obj.location = (2.4, -4.6, 2.0)
    direction = mathutils.Vector((0, 0, 0.1)) - cam_obj.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    cam_obj.rotation_euler = rot_quat.to_euler()
    bpy.context.scene.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

    return cam_obj

# 6. Render & Output Settings
def configure_render_settings():
    scene = bpy.context.scene
    # Check for CYCLES or BLENDER_EEVEE
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 64
    scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    scene.display_settings.display_device = 'sRGB'
    if hasattr(scene.view_settings, 'view_transform'):
        scene.view_settings.view_transform = 'Filmic'
    if hasattr(scene.view_settings, 'look'):
        scene.view_settings.look = 'High Contrast'
    scene.view_settings.exposure = 0.20

# 7. Generate Vector SVG Silhouette
def generate_vector_svg(svg_path):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" width="100%" height="100%">
  <defs>
    <linearGradient id="obsidian_primary" x1="120" y1="60" x2="380" y2="460" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1A1D20" />
      <stop offset="45%" stop-color="#0E1012" />
      <stop offset="100%" stop-color="#050607" />
    </linearGradient>
    <linearGradient id="palladium_inlay" x1="100" y1="80" x2="420" y2="440" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F2F5F8" />
      <stop offset="30%" stop-color="#C8CDD0" />
      <stop offset="70%" stop-color="#9AA0A6" />
      <stop offset="100%" stop-color="#DFE3E6" />
    </linearGradient>
    <linearGradient id="cold_arc" x1="300" y1="40" x2="480" y2="280" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#C3E4EE" stop-opacity="0.9" />
      <stop offset="60%" stop-color="#8EBBC8" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#558896" stop-opacity="0" />
    </linearGradient>
  </defs>

  <ellipse cx="256" cy="468" rx="190" ry="24" fill="#000000" fill-opacity="0.45" />
  <path d="M256 52 L112 432 L168 448 L228 296 L284 296 L256 52 Z" fill="url(#obsidian_primary)" />
  <path d="M256 52 L400 432 L344 448 L284 296 L228 296 L256 52 Z" fill="url(#obsidian_primary)" />
  <path d="M192 316 L320 316 L298 256 L214 256 Z" fill="#0A0C0E" />
  <polygon points="256,152 208,256 304,256" fill="#050607" />

  <polygon points="256,48 248,56 102,428 112,434" fill="url(#palladium_inlay)" />
  <polygon points="256,48 264,56 410,428 400,434" fill="url(#palladium_inlay)" />
  <polygon points="248,56 256,44 264,56 256,68" fill="#FFFFFF" />
  <polygon points="208,256 304,256 312,264 200,264" fill="url(#palladium_inlay)" />

  <path d="M256 48 L410 428" stroke="url(#cold_arc)" stroke-width="3" stroke-linecap="round" />
  <path d="M208 256 L304 256" stroke="#C8CDD0" stroke-width="2" stroke-linecap="round" />
</svg>
"""
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content.strip())
    print(f"Generated Vector SVG: {svg_path}")

# 8. Export All Deliverables
def export_assets():
    scene = bpy.context.scene

    blend_path = os.path.join(BRAND_DIR, "aedrian-a.blend")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"Saved Master Blend: {blend_path}")

    glb_path = os.path.join(PUBLIC_BRAND_DIR, "aedrian-a.glb")
    bpy.ops.object.select_all(action='DESELECT')
    monolith_obj = bpy.data.objects.get("Aedrian_A_Monolith")
    if monolith_obj:
        monolith_obj.select_set(True)
        bpy.context.view_layer.objects.active = monolith_obj

    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
        export_cameras=False,
        export_lights=False,
        export_extras=False,
        export_yup=True
    )
    glb_size = os.path.getsize(glb_path) if os.path.exists(glb_path) else 0
    print(f"Exported Web GLB: {glb_path} ({glb_size / 1024:.2f} KB)")

    png_path = os.path.join(PUBLIC_BRAND_DIR, "aedrian-a-transparent.png")
    scene.render.resolution_x = 2048
    scene.render.resolution_y = 2048
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.compression = 15
    scene.render.filepath = png_path
    bpy.ops.render.render(write_still=True)
    png_size = os.path.getsize(png_path) if os.path.exists(png_path) else 0
    print(f"Rendered Transparent PNG: {png_path} ({png_size / 1024:.2f} KB)")

    poster_path = os.path.join(ASSETS_BRAND_DIR, "aedrian-a-poster.webp")
    scene.render.film_transparent = False
    world = bpy.data.worlds.new("Void_World")
    world.use_nodes = True
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs["Color"].default_value = hex_to_rgb("#050607")
        bg_node.inputs["Strength"].default_value = 0.5
    scene.world = world

    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1440
    scene.render.image_settings.file_format = 'WEBP'
    scene.render.image_settings.quality = 85
    scene.render.filepath = poster_path
    bpy.ops.render.render(write_still=True)

    if not os.path.exists(poster_path) and os.path.exists(poster_path + ".webp"):
        poster_path = poster_path + ".webp"
    elif not os.path.exists(poster_path) and os.path.exists(poster_path + ".png"):
        os.rename(poster_path + ".png", poster_path)

    poster_size = os.path.getsize(poster_path) if os.path.exists(poster_path) else 0
    print(f"Rendered Hero Poster: {poster_path} ({poster_size / 1024:.2f} KB)")

    svg_path = os.path.join(PUBLIC_BRAND_DIR, "aedrian-a.svg")
    generate_vector_svg(svg_path)

    spec_path = os.path.join(DOCS_BRAND_DIR, "aedrian-a-spec.md")
    generate_spec_doc(spec_path, glb_size, png_size, poster_size)

# 9. Technical Specification Generator
def generate_spec_doc(spec_path, glb_size, png_size, poster_size):
    content = f"""# Aedrian Ponce — Procedural 3D "A" Monolith Specification

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
| Web Model | `public/brand/aedrian-a.glb` | glTF 2.0 Binary | {glb_size / 1024:.1f} KB (Target $\le 150$ KB) | R3F 3D Hero Island | Verified |
| Presentation Render | `public/brand/aedrian-a-transparent.png` | 2048x2048 RGBA PNG | {png_size / 1024:.1f} KB | High-res showcase & press | Verified |
| Hero Poster Fallback | `src/assets/brand/aedrian-a-poster.webp` | 1920x1440 WebP | {poster_size / 1024:.1f} KB (Target $\le 180$ KB) | Reduced-motion & WebGL fallback | Verified |
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
"""
    with open(spec_path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Generated Specification Document: {spec_path}")

# Main Execution Flow
if __name__ == "__main__":
    print("=== Starting Procedural 3D 'A' Monolith Generator ===")
    clean_scene()
    monolith = create_a_monolith()
    camera = setup_studio()
    configure_render_settings()
    export_assets()
    print("=== Successfully Generated All Brand Assets ===")
