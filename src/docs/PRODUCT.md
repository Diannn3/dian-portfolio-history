# PRODUCT — DIAN / VECTOR ATLAS

## Who this is

Dian. Applied Mathematics student in Los Baños, building software, spatial, data and
AI-backed systems around real local problems. The portfolio's job is to show how a
structure — a field, a graph, a schema — becomes something a person can use, and to be
unusually precise about which parts are built, designed, or still unproven.

## Goal

One document, not a marketing site: an atlas of systems with an index, plates,
coordinates and annotations. A reader should be able to answer three questions on any
page without guessing:

1. What is this system?
2. What actually exists right now?
3. What has not been validated?

## Audience

- **Reviewers and collaborators** who need evidence, not adjectives: source links,
  architecture, decisions and named limitations.
- **Peers** in maths / spatial / creative computation who care how the thing is built.
- **Future me**, using it as a record of decisions and their trade-offs.

## Content honesty rules

These are hard constraints, not preferences.

- Never invent users, revenue, downloads, awards, partnerships, clients, accuracy
  figures, deployment status, government adoption, ETAs or validation results.
- Statuses are load-bearing and may only change with repository evidence:
  `IN DEVELOPMENT`, `PROTOTYPE`, `CONCEPT`, `EXPERIMENT`.
- "The test exists" is not "the test passes". "Public source" is not "released".
- Procedural diagrams are **editorial visuals**, and must be labelled
  `SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT`. Only genuine captures may sit inside a
  `CaseFigure` interface-evidence frame.
- No AI-generated interface may be presented as implementation evidence.
- No `href="#"`. Only verified contact channels appear — currently GitHub alone.
- Where a claim cannot be supported, state the absence instead of softening it.

## Project hierarchy

Selected Work, in ledger order:

| Index | Project | Status | Evidence |
| --- | --- | --- | --- |
| 01 | **UPPETITE Elbi** — route-aware food discovery for UPLB / Los Baños | IN DEVELOPMENT | Public implementation repo + docs |
| 02 | **IMS Academic Hub** — indoor wayfinding + academic tooling + local grade tools | PROTOTYPE | Public implementation repo; map geometry schematic and site-unverified |
| 03 | **Pasada** — jeepney route/demand system concept | CONCEPT | System hypothesis; no operator partnership or fleet data |
| 04 | **Disaster Response Platform** — connectivity-resilient reporting concept | CONCEPT | No public implementation evidence found |

Each case study is a sequence of chapters rather than one template: context, evidence,
architecture, decisions, flow, validation, open questions, reflection. Decisions carry
their trade-off. Validation carries its state (`VERIFIED`, `DEFINED`, `LIMITATION`,
`NOT CLAIMED`).

## Lab

A notebook, not a showcase. Entries stay collapsed until opened so nothing runs in the
background.

- **L01 Vector Field Playground** — the site's own field F(x,y,z), integrated with RK4
  in a chosen z-slice. Deterministic: identical parameters redraw identically.
- **L02 AedriAIn** — a *diagram* of a separate hand-tracking prototype. This page never
  opens a camera and claims no tracking accuracy. Source is linked.
- **L03 Spline Spatial Study** — loading infrastructure only. `SPLINE_SCENE_URL` in
  `data/site.ts` is intentionally empty and shows `NO SCENE CONFIGURED`; no borrowed or
  example scene is ever substituted.
- **L04 Motion Studies** — the seven motion verbs, demonstrated in isolation.

## Sections of the index route

`01 SELECTED WORK · 02 ABOUT · 03 CURRENT VECTOR · 04 DIGITAL ARTIFACT · 05 LAB ·
06 TOOLS · 07 CONTACT`

CURRENT VECTOR lists what is in progress as factual entries — never percentages.
TOOLS shows relationships between fields, never proficiency ratings.
