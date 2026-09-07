# Replacing procedural geometry with GLB assets

No final GLB model is bundled in this MVP. Place licensed `.glb` or `.gltf` assets here (for example `desktop.glb`). Do not place source CAD files or unnecessary high-resolution textures in the public folder.

1. Keep separate named objects or groups for every logical part. Match `modelObjectName` in `lib/atlas/systems.ts` (case, motherboard, cpu, cooler, gpu, ram, psu, ssd, fans, rear-fan for desktop).
2. Use a consistent coordinate system: Y up; the current boards lie in the XY plane facing positive Z. Center each part's local geometry on its interaction origin. Preserve authored offsets in the part data rather than applying them twice.
3. Load the asset with Drei `useGLTF` under the existing Suspense/error boundary. Provide its named geometry through the `PartGeometry` adapter. Keep the outer `InteractivePart` group responsible for movement and hit testing.
4. Clone cached materials per interactive part so opacity/emissive selection does not leak into unrelated components. The current appearance controller expects `MeshStandardMaterial` (or extend it explicitly for other material types).
5. Update `size`, `position`, `cameraTarget`, `rotation`, and the absolute `explodedPosition` to match the asset. Keep IDs, lessons, and related-component references stable.
6. Reduce draw calls, bake static detail, compress geometry/textures, and use sensible texture sizes. Configure the decoder explicitly if using Draco or KTX2. Verify selection, isolation, X-Ray, focus, and every explosion endpoint after replacement.

`AtlasSystem.modelAsset` reserves the asset URL in the data contract; it is intentionally unused until a real licensed asset and its mapping are supplied. No missing model URL is fetched by the current app.
