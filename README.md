# CpE Atlas

An interactive Computer Engineering field guide built with React, TypeScript, Three.js, React Three Fiber, and Drei. The repository was initially empty. The Sites scaffold supplies Vinext routing, Vite, Tailwind, a shadcn Button primitive, and a Cloudflare-compatible production build.

## Run locally

Use Node 22.13+ (an active LTS release is recommended) and npm 10.9.4 or later. The machine's older npm 10.8 crashed while resolving optional peer dependencies; npm 10.9.4 completed installation.

```sh
npm install --include=optional
npm run dev
```

Open the URL printed by the server. `/` is the landing page; `/atlas` is the workspace. Module links use `/atlas?system=desktop`, `motherboard`, `arduino`, or `rectifier`. Browser Back/Forward restores the chosen module. On Windows, the build tools may require permission to launch native processes.

```sh
npm run typecheck
npm test
npm run lint
npm run build
```

## Implemented

- Short landing page with a real, slowly orbiting 3D computer, four system entry points, and learning flow.
- Four systems: desktop (13 selectable groups), Crosshair Edition 20 motherboard (23), Arduino Uno Rev3 reference (16), and bridge rectifier (8).
- Pointer selection, small hover labels, persistent selection labels, faded unrelated parts, related-part navigation, search, and isolation.
- Eased focus camera, bounded orbit and zoom, automatic framing for the viewport aspect ratio, reset, and fullscreen when available.
- Reversible eased assembly separation with a continuous slider. Desktop enclosure opacity animates in X-Ray mode.
- Data-driven descriptions, specifications, related concepts, and expandable field notes.
- Mobile navigation drawer and independently scrollable, expandable inspector sheet.
- Keyboard access to every component through the list; R resets, Escape clears selection. Reduced-motion settings disable camera/geometry easing and hero autorotation. Loading, unsupported WebGL, and scene error states preserve access to the educational interface.

## Architecture

| Location                                   | Responsibility                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `app/page.tsx`                             | Landing page                                                                |
| `app/atlas/page.tsx`                       | Atlas route                                                                 |
| `components/atlas/`                        | Workspace, sidebar, inspector, viewing toolbar                              |
| `components/three/AtlasScene.tsx`          | Lazy-loaded Canvas, lights, composition, fallbacks                          |
| `components/three/InteractivePart.tsx`     | Hit testing, highlighting, opacity, labels, exploded-position interpolation |
| `components/three/PartGeometry.tsx`        | Replaceable original procedural geometry                                    |
| `components/three/CameraController.tsx`    | Orbit controls and eased focus/reset                                        |
| `components/three/ElectronicsGeometry.tsx` | Physical board components, copper tracks, and polarity markings             |
| `lib/atlas/types.ts`                       | Typed model/educational contract                                            |
| `lib/atlas/systems.ts`                     | System registry, parts, future connection graph                             |
| `lib/atlas/store.ts`                       | Shared interaction state and transitions                                    |
| `tests/atlas-data.test.mjs`                | Graph/data integrity and cross-mode regression checks                       |

Animations run inside the render loop without React state updates per frame. Pixel ratio is capped at 1.5; shadow resolution at 1024. No remote texture/environment assets are required. The large Three.js bundle is loaded asynchronously. Zustand provides one shared state store; no duplicate animation or state library was added.

## Model assets and expansion

All geometry is original and simplified. Desktop and motherboard use **one scene unit = 100 mm**, now anchored to 305 × 277 mm E-ATX boards. Arduino uses 20 mm per unit and the bridge circuit uses 10 mm per unit, keeping all component sizes consistent within each system. Each module is framed independently. The social image is generated artwork and is not a screenshot of the viewer. No commercial model is copied or bundled.

Place licensed, optimized model files under `public/models/`. Keep geometry behind `PartGeometry`/`InteractivePart` so replacement does not change selection, educational data, or UI. See `public/models/README.md` for the asset contract.

Add modules through `AtlasSystem` and the registry. Component IDs are scoped to a system. Each part carries `modelObjectName`, assembled `position`, absolute `explodedPosition`, `cameraTarget`, size, and optional rotation. Connection records identify endpoints and their signal/data/power purpose. Feature flags mark future capabilities, not completed simulations.

## Deliberate MVP boundaries

- Signal flow, electrical waveforms, and individual Arduino pin interaction are upcoming. Pin _groups_ are selectable; the interface does not pretend to simulate a circuit.
- The bridge uses a conventional diamond: AC enters the left/right nodes; positive DC is the top node, negative DC is the bottom. Capacitor and load are parallel across the output. D1/D4 and D2/D3 are the alternate conducting pairs. Copper tracks and output polarity markings stay attached to the PCB during explosion; separated parts no longer represent a connected circuit.
- All systems use representative physical dimensions and mounting positions. They are not manufacturer-specific manufacturing CAD models. No engineering tolerances, benchmark specifications, or electrical simulation accuracy are claimed.
- No accounts, persistent learning progress, or backend database were requested.

## Reference interpretation

The supplied 57-second video was inspected at six timestamps before implementation. It contains a human anatomy atlas and a vehicle component explorer. Transferable principles: dominant object, compact category navigation, small contextual inspector, orderly exploded layouts, isolation, and continuous assembly separation. CpE Atlas applies those principles to engineering systems with a distinct graphite interface and restrained blue emphasis.

Arduino terminology was checked against the [official Uno R3 overview](https://docs.arduino.cc/hardware/uno-rev3/) and [official datasheet](https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf). The main ATmega328P clock is described as a ceramic resonator rather than confusing it with the USB controller clock. The application is an independent educational project, not affiliated with Arduino.

## Verification limits

Automated checks cover type correctness, production compilation, data integrity, state transitions, and HTTP route responses. The in-app browser was unavailable in the development session, so visual WebGL rendering, touch gestures, and browser interaction should receive a device QA pass before classroom use.

## Desktop model revision

The desktop uses a single coordinate convention: X rear-to-front, Y up, Z from the motherboard tray toward the open side. `desktopDimensions` in the system registry controls physical envelopes, mounting origins, extraction waypoints, and presentation rotations. The ATX reference dimensions are checked against [ASUS specifications](https://www.asus.com/motherboards-components/motherboards/prime/prime-b760-plus-d4/techspec/); the CPU, GPU, cooler, case, and storage are representative compatible sizes, not replicas of a particular product.

`DesktopGeometry` supplies the detailed chassis, socket, DIMM connectors, GPU PCB/heatsink/fans, CPU contact pads, cooler fins, PSU sockets, SSD, and correctly oriented intake/exhaust assemblies. `GeometryPrimitives` is shared with the other modules.

`explosion.ts` packs rotated component bounds into responsive rows, reserving caption space. Full-size relationships are preserved: small parts are intentionally small and can be selected to focus. A shared render-loop progress value first extracts parts to clearance positions (0–28%), then moves and rotates them into the catalogue (28–100%). Toggle and slider actions use the same reversible path. The camera follows this progress into a front-facing view and fits the complete layout. Camera gestures still allow manual inspection.

The exploded canvas reserves space for the heading and separation controls. On mobile the overview inspector collapses to give the model more room, then expands when a part is selected. Captions scale with the viewport to avoid covering adjacent components.

Regression checks evaluate the actual React geometry tree, including nested transforms. They verify that hardware fits inside the case, that exploded mesh bounds do not overlap in the default perspective projection across six viewport aspect ratios, and that the staged trajectory has continuous endpoints. These are geometry checks, not a claim of browser visual QA or manufacturing tolerances.

## All-system component revision

`component-dimensions.ts` describes physical envelopes, assembly positions, and extraction waypoints for the standalone motherboard, Uno, and bridge circuit. `visualSize` includes small attached details in presentation bounds without altering the underlying component dimensions. All modules now use the shared staged explosion, responsive rows, automatic captions, focus, and camera fitting. Small chips retain their actual relative size; selecting one zooms in for inspection.

The motherboard includes four DIMM sockets, socket contacts and retention lever, PCIe connectors, regulator bank, finned chipset heatsink, coin-cell holder, M.2 connector/standoff, and rear I/O. The Uno includes a socketed 28-pin controller, USB Type-B shell, female headers, ICSP pins, power jack and capacitors. Its board outline uses the [official Uno Rev3 dimensions](https://store.arduino.cc/products/arduino-uno-rev3). The bridge uses axial diode bodies with cathode bands, formed leads, an electrolytic capacitor with vent and polarity stripe, a banded resistor, and an input screw terminal. The diode envelope follows the [Vishay DO-41 reference](https://www.vishay.com/docs/88503/1n4001.pdf); remaining envelopes are representative examples.

Tests cover the actual geometry envelopes and perspective projection for all four systems, plus PCB mounting clearances and continuous assembly/explosion endpoints. PCB copper routing is illustrative, and the models remain educational rather than circuit fabrication files.

## Supplied hardware references

`reference-hardware.ts` applies the current product selection after the original generic registry. `ReferenceDesktopGeometry` and `CrosshairGeometry` implement the reference-specific geometry. The prior desktop geometry remains available as a fallback, but the current desktop dispatch uses the reference implementation. Printed silkscreen and component names use locally generated canvas textures; no remote fonts or images are required at runtime.

- Standalone motherboard: [ASUS ROG Crosshair X870E Edition 20](https://rog.asus.com/motherboards/rog-crosshair/rog-crosshair-x870e-edition-20/spec/), with placement and copper/black/gold styling interpreted from the user's exploded image. Removable thermal covers and backplate are individually selectable. Hidden circuitry and the fine artwork are approximations, not an exact product CAD reproduction.
- Arduino: the user's Uno Rev3 top-view reference controls connector placement, overhang, controller location, power capacitors and silkscreen. The USB clock crystal and second ICSP header are separate parts.
- Desktop motherboard: [ASUS ROG Maximus Z890 Extreme](https://rog.asus.com/us/motherboards/rog-maximus/rog-maximus-z890-extreme/spec/), 305 × 277 mm, Intel LGA1851.
- CPU: [Intel Core Ultra 9 285K](https://www.intel.com/content/www/us/en/products/sku/241060/intel-core-ultra-9-processor-285k-36m-cache-up-to-5-70-ghz/specifications.html). The user explicitly chose to keep the Z890 board and substitute a compatible Intel processor for the initially requested AM5 Ryzen.
- GPU: [NVIDIA RTX 5090 Founders Edition](https://www.nvidia.com/en-in/geforce/graphics-cards/50-series/rtx-5090/), 304 × 137 mm, dual-slot, 32GB. Founders Edition was chosen because no board partner variant was specified.
- Memory: Corsair Dominator Titanium visual design, using the [manufacturer's module dimensions](https://help.corsair.com/hc/en-us/articles/4412253644045-RAM-DDR5-memory-module-dimensions). The requested 64GB/7200 combination is retained as the requested configuration; a matching retail SKU and achievable XMP speed are not verified.
- Storage: [Crucial T705](https://eu.crucial.com/content/dam/crucial/ssd-products/t705/flyers/b2c/crucial-t705-b2c-product-flyer-en.pdf), 4TB, M.2 2280. Shown as the bare drive, without its optional retail heatsink.
- PSU: Seasonic PRIME TX-1600, 210 × 150 × 86 mm, following the [PRIME dimensions](https://seasonic.com/atx3-prime-tx/). The requested ATX 3.0 naming is retained; the current manufacturer page also covers the later 3.1 revision.
- Case: [MSI MEG Maestro 700L PZ](https://www.msi.com/PC-Case/MEG-MAESTRO-700L-PZ/Specification), 470 × 300 × 474 mm. A dual-chamber arrangement and tinted panoramic glass with a curved corner replace the previous generic tower.
- Cooler: [ASUS ROG Ryujin III 360 ARGB](https://rog.asus.com/us/cooling/cpu-liquid-coolers/rog-ryujin/rog-ryujin-iii-360-argb/spec/), 89 × 91 × 101 mm pump and 399.5 × 120 × 30 mm radiator plus 25 mm fans. Pump, radiator and hoses separate into independent inspection groups. Additional case fans are illustrative accessories.

Glass retains its base transparency during selection and X-Ray animation. Catalogue spacing now also reserves depth-dependent gaps to prevent the large case and glass panel from overlapping in perspective. Bounds tests include curved surfaces, tubes, silkscreen planes, and the actual E-ATX board dimensions. PCB mounting tests treat thermal covers/backplates as separate layers and allow the photographed USB connector's deliberate edge overhang. No browser visual review has been performed for this revision.
