---
title: "AedriAIn — Prototype 01"
order: 2
status: "prototype"
year: "Needs Aedrian confirmation"
role: "Needs Aedrian confirmation"
summary: "Webcam hand-tracked spatial student desktop interface shell with holographic window management and isolated worker execution."
stack:
  - "React 19"
  - "React Three Fiber"
  - "MediaPipe Hand Landmarker"
  - "Web Worker"
  - "Zustand"
  - "Electron"
repository: "https://github.com/Diannn3/AedriAIn"
visual:
  kind: "system-study"
  asset: "/studies/aedriain-gesture-field.svg"
  alt: "Conceptual system study of AedriAIn spatial hand-tracking worker topology"
  caption: "Conceptual system study: non-blocking MediaPipe spatial vector projection"
  evidenceState: "conceptual"
---

## 1. Artifact & Honest Evidence State
- **Artifact**: Public GitHub Repository [`github.com/Diannn3/AedriAIn`](https://github.com/Diannn3/AedriAIn) (`prototype-01` branch)
- **Evidence State**: `conceptual` (Explicitly labeled Prototype 01; not presented as a production OS or commercial hardware system).

## 2. Status, Year, and Exact Role
- **Status**: Early technical prototype (`prototype`).
- **Year**: `Needs Aedrian confirmation`.
- **Role**: `Needs Aedrian confirmation` (Candidate evidence framing: interaction-state engineering, hand-tracking worker separation, spatial canvas math).

## 3. Problem & User Context
Spatial computing interfaces traditionally demand dedicated AR/VR headsets or depth cameras. AedriAIn explores whether commodity monocular laptop webcams can drive high-frame-rate gesture-driven desktop manipulation for students without hardware overhead.

## 4. Constraints
- Zero Main-Thread Blocking: Machine learning vision inference must not degrade UI rendering framerate.
- High Latency Sensitivity: Pinch-to-grab and cursor translation must execute within $\le 35\text{ms}$ total input latency.
- Privacy Guarantee: Zero video frame data sent over network; all tensor operations remain strictly in-browser / in-process.

## 5. Architecture
- **Vision Pipeline**: Google MediaPipe Hand Landmarker compiled to WebAssembly running inside a dedicated Web Worker.
- **Render Engine**: React 19 + React Three Fiber spatial scene managing 3D holographic windows with depth sorting.
- **State Management**: Zustand store receiving throttled landmark vectors via transferable `ArrayBuffer` objects.
- **Desktop Shell**: Electron bridge interfacing with OS-level window handles and file system pickers.

## 6. Key Decisions
1. **Dedicated Worker Pipeline**: Moving video stream parsing and landmark inference entirely off the main event loop to prevent UI stutter.
2. **Transferable Data Buffers**: Using typed arrays for inter-thread messaging to eliminate JSON serialization latency.
3. **Graceful Degradation**: Seamless pointer and keyboard fallback when lighting conditions drop below confidence thresholds.

## 7. Known Rejected Alternatives
- *Single-Threaded Computer Vision*: Inline webcam processing on the main thread was rejected due to catastrophic render stalls during complex gesture recognition.
- *Cloud-Assisted Vision*: Remote model inference was strictly rejected due to student privacy requirements and transmission latency.

## 8. Implementation Details
The gesture worker computes landmark confidence scores, extracting wrist, index tip, and thumb tip Euclidean vectors. Distance thresholds trigger continuous pinch events that map into Three.js object transforms.

## 9. Validation & Testing
- Landmark stability validation across varied ambient lighting conditions and skin tones.
- Framerate profiling ensuring 60 FPS spatial canvas rendering during active hand tracking.

## 10. Honest Current State
- Functional single-camera prototype shell with spatial Notes, Tasks, and Calendar widgets.
- `Needs Aedrian confirmation` for long-duration ergonomic validation, production packaging, and formal user studies.

## 11. Lessons
Robust computer vision interfaces require deep mechanical sympathy with browser worker threading and memory buffer lifecycle management.

## 12. Repository & Links
- **Repository**: [github.com/Diannn3/AedriAIn](https://github.com/Diannn3/AedriAIn)
- **Live Deployment**: `Needs Aedrian confirmation`
