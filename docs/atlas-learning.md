# Atlas learning workspace - phases 1-4

## Architecture audit

The existing registry (`systems.ts` and `robot.ts`), metadata, Zustand store, shared `InteractivePart`, `CameraController`, continuous explosion packing/interpolation, labels, inspector, scene boundary and lazy Canvas remain in place. Local sidebar search still filters the current system. Related-component selection, explicit isolation, robot signal/line modes and desktop cables are preserved.

The previous `learn` boolean only displayed an overview hint. It is replaced by a lesson ID and step index. `learning.ts` owns typed Desktop (7 steps) and Robot (6 steps) lessons; store actions run steps atomically. New scene-wide relationships extend the pre-existing registry through `connections.ts`, with stable endpoint/type IDs. The previous motherboard CPU VRM input was corrected from ATX to CPU power.

`commands.ts` provides capability-aware actions used by both keyboard handling and the palette. `search.ts` normalizes registry names, aliases, specifications, educational descriptions and related topics; lessons and active-system commands join the same search results. No network search, accounts or dependency changes.

## Interaction

- Ctrl/Cmd+K opens a native modal dialog with input focus, arrow-key result navigation, Enter activation and Escape dismissal. The native dialog contains focus and restores the opener.
- Search results change system and selection together. System/component query parameters support refresh and browser history. Invalid component IDs are ignored.
- R resets camera framing, E toggles explode, X toggles supported X-Ray, L cycles labels, F focuses selection and C toggles supported relationships. Reset Workspace remains a separate action. Shortcuts are ignored in editable fields and other open dialogs.
- Connections are conceptual, not wire installation or simulation paths. Only incident links render: solid power and dashed other links, with typed labels in the inspector. Connection framing uses the system view so endpoints stay in context. Isolation and explosion exit connections.
- Lessons have Previous/Next/Finish, progress, Restart and Exit. Selection outside the lesson exits the lesson. Robot steps activate existing Line and Signal modes; these are not new simulations.

## Performance and responsive behavior

One existing Canvas remains active. Connection curves are memoized, only incident paths are mounted, and there is no new continuous animation or React state update in the frame loop. Connections wait for assembly interpolation to finish. The normalized search index is built once. No packages were added or upgraded.

Search is constrained to the viewport; the existing inspector becomes the lesson sheet on mobile. The toolbar scrolls within its viewport. Focus outlines and native dialog semantics remain available. Existing reduced-motion camera behavior is reused and new connection lines are static.

## Deferred scope

Per the request's quality-first scope, phases 5-7 remain future work: individual Arduino pin mode, rectifier half-cycle visualization, additional system lessons, comparison, bookmarks, recently viewed, presentation mode and graphics/settings controls. None have placeholder buttons. Relationships are a curated educational subset, not an exhaustive bus or terminal map. Existing dense All-label overlaps and material realism need a separate visual pass.

## Validation

Automated coverage includes all existing geometry/state tests plus relationship endpoint validity, capability filtering, search aliases/topics, complete lesson sequences, invalid-step bounds, restart/exit and connection isolation. Browser review covers both full lessons, cross-system search, keyboard selection, selection/isolation/explode/labels across all five systems, mobile and tablet layout. Production build is required before release.

Next recommended enhancement: Arduino Pin Mode with individual pin metadata and a short input/output lesson, using the same command, connection and lesson infrastructure.
