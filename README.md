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
- Four conceptual systems: desktop (10 selectable groups), motherboard (16), Arduino Uno R3-inspired board (12), and bridge rectifier (7).
- Pointer selection, small hover labels, persistent selection labels, faded unrelated parts, related-part navigation, search, and isolation.
- Eased focus camera, bounded orbit and zoom, automatic framing for the viewport aspect ratio, reset, and fullscreen when available.
- Reversible eased assembly separation with a continuous slider. Desktop enclosure opacity animates in X-Ray mode.
- Data-driven descriptions, specifications, related concepts, and expandable field notes.
- Mobile navigation drawer and independently scrollable, expandable inspector sheet.
- Keyboard access to every component through the list; R resets, Escape clears selection. Reduced-motion settings disable camera/geometry easing and hero autorotation. Loading, unsupported WebGL, and scene error states preserve access to the educational interface.

## Architecture

| Location                                    | Responsibility                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| `app/page.tsx`                              | Landing page                                                                |
| `app/atlas/page.tsx`                        | Atlas route                                                                 |
| `components/atlas/`                         | Workspace, sidebar, inspector, viewing toolbar                              |
| `components/three/AtlasScene.tsx`           | Lazy-loaded Canvas, lights, composition, fallbacks                          |
| `components/three/InteractivePart.tsx`      | Hit testing, highlighting, opacity, labels, exploded-position interpolation |
| `components/three/PartGeometry.tsx`         | Replaceable original procedural geometry                                    |
| `components/three/CameraController.tsx`     | Orbit controls and eased focus/reset                                        |
| `components/three/RectifierConnections.tsx` | Static bridge wiring and polarity labels                                    |
| `lib/atlas/types.ts`                        | Typed model/educational contract                                            |
| `lib/atlas/systems.ts`                      | System registry, parts, future connection graph                             |
| `lib/atlas/store.ts`                        | Shared interaction state and transitions                                    |
| `tests/atlas-data.test.mjs`                 | Graph/data integrity and cross-mode regression checks                       |

Animations run inside the render loop without React state updates per frame. Pixel ratio is capped at 1.5; shadow resolution at 1024. No remote texture/environment assets are required. The large Three.js bundle is loaded asynchronously. Zustand provides one shared state store; no duplicate animation or state library was added.

## Model assets and expansion

All geometry is original and simplified. The desktop uses a consistent scale of **one scene unit = 100 mm**, anchored to a 305 × 244 mm ATX board. Other modules remain conceptual and not to scale. The social image is generated artwork and is not a screenshot of the viewer. No commercial model is copied or bundled.

Place licensed, optimized model files under `public/models/`. Keep geometry behind `PartGeometry`/`InteractivePart` so replacement does not change selection, educational data, or UI. See `public/models/README.md` for the asset contract.

Add modules through `AtlasSystem` and the registry. Component IDs are scoped to a system. Each part carries `modelObjectName`, assembled `position`, absolute `explodedPosition`, `cameraTarget`, size, and optional rotation. Connection records identify endpoints and their signal/data/power purpose. Feature flags mark future capabilities, not completed simulations.

## Deliberate MVP boundaries

- Signal flow, electrical waveforms, and individual Arduino pin interaction are upcoming. Pin _groups_ are selectable; the interface does not pretend to simulate a circuit.
- The bridge uses a conventional diamond: AC enters the left/right nodes; positive DC is the top node, negative DC is the bottom. Capacitor and load are parallel across the output. D1/D4 and D2/D3 are the alternate conducting pairs. Explode hides the wiring because separated positions no longer represent a connected circuit.
- The desktop uses representative physical dimensions and compatible mounting positions; it is not a manufacturer-specific product or manufacturing CAD model. The standalone motherboard retains conceptual proportions. No engineering tolerances, benchmark specifications, or electrical simulation accuracy are claimed.
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
