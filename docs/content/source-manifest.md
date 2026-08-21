---
title: Aedrian Portfolio Public Source Manifest
status: evidence-gated
updated: 2026-08-22
---

# Aedrian Portfolio — Public Source Manifest

This manifest separates facts that can be supported by public project repositories from copy that still requires Aedrian’s approval. It is for the new recruiter portfolio only. It does not authorize publication of screenshots, personal details, client names, outcomes, or claims beyond the evidence listed here.

## Evidence rules

- Repository visibility, default branch, repository activity, README statements, and language summaries below were checked against the public GitHub repository pages/API on 2026-08-22.
- A public repository is evidence that a repository is publicly accessible; it is not proof of ownership role, team role, production use, user count, revenue, impact, or general reuse rights.
- No repository-wide license was confirmed for any of the four repositories. Do not describe any project as generally open-source or reusable without a license and Aedrian confirmation.
- Unknowns are written exactly as `Needs Aedrian confirmation`.
- Do not copy code, layout, visual identity, screenshots, or component implementations from any existing portfolio into the new site.

## Project manifest

### 1. UPPETITE

| Field | Verified public record / publication boundary |
|---|---|
| Project | UPPETITE; repository name is `kain-elbi` for historical reasons. |
| Repository URL | [github.com/Diannn3/kain-elbi](https://github.com/Diannn3/kain-elbi) |
| Public status | Public; not archived; default branch `main`; repository-wide license not present. Do not call it generally open-source. |
| Public repository facts | README describes a route-aware food discovery web app for students around UPLB, organized around fitting food into a student’s available break. It documents Find/Smart Picks, Explore, Freshie, My UPPETITE, and a private staff operations area. |
| Verified stack | README: Astro 7, Svelte 5 islands, TypeScript, vanilla CSS design tokens/components, MapLibre GL JS, `opening_hours`, Supabase Auth/Postgres/RLS/RPCs/Edge Functions, Vercel. GitHub language summary: TypeScript, Svelte, Astro, Python, PLpgSQL, JavaScript, CSS. |
| Candidate role | Needs Aedrian confirmation. Candidate evidence-led framing: product/system design, route-aware data modeling, frontend integration, privacy/authorization, and validation work. Do not state “sole developer,” “founder,” or team scope without approval. |
| Candidate status | Active development / case study; exact status and public launch state need Aedrian confirmation. |
| Outcomes / metrics | Needs Aedrian confirmation. No user counts, revenue, performance, adoption, accuracy, or business outcome claims are verified here. |
| Screenshots / media | Needs Aedrian confirmation. Use only approved public or owner-provided assets; review every image for secrets, private staff data, local paths, and personal data. |
| Approvals still needed | Exact role and collaborators; timeframe; approved screenshots/diagrams; real outcomes/metrics; whether a live URL may be linked; license/reuse wording. |
| Forbidden claims | Do not claim production scale, commercial traction, route accuracy, accessibility compliance, institutional endorsement, user numbers, revenue, or generally reusable/open-source code. Do not expose staff-only architecture, credentials, environment values, or private operational data. |
| Evidence links | [README](https://github.com/Diannn3/kain-elbi#readme) · [repository metadata](https://api.github.com/repos/Diannn3/kain-elbi) · [language summary](https://github.com/Diannn3/kain-elbi)

### 2. AedriAIn

| Field | Verified public record / publication boundary |
|---|---|
| Project | AedriAIn — README title: “Spatial Student Desktop — Prototype 01.” |
| Repository URL | [github.com/Diannn3/AedriAIn](https://github.com/Diannn3/AedriAIn) |
| Public status | Public; not archived; default branch `prototype-01`; repository has one public commit at the time checked; repository-wide license not present. |
| Public repository facts | README describes a webcam hand-tracked spatial desktop shell with holographic windows, Notes/Tasks state, a calendar shell, UPLB map placeholder, file-picker bridge, command bar, optional browser speech input, mouse fallback, and a MediaPipe worker. It explicitly labels the work as a prototype. |
| Verified stack | README: React 19, React Three Fiber, MediaPipe Hand Landmarker in a Web Worker, localStorage/Zustand, Electron shell, browser speech-recognition hook. GitHub language summary: TypeScript, Shell, JavaScript, HTML. |
| Candidate role | Needs Aedrian confirmation. Candidate evidence-led framing: interaction-state engineering, hand-tracking integration, worker separation, and spatial-window behavior. Do not state team scope or sole authorship without approval. |
| Candidate status | Prototype 01 / early prototype, supported by the public README. Do not promote it to a production desktop, operating system, or mature AI product. |
| Outcomes / metrics | Needs Aedrian confirmation. The README lists implemented prototype behaviors, but no validated user outcome or performance metric. |
| Screenshots / media | Needs Aedrian confirmation. Camera, personal workspace, file names, local paths, and any unreleased UI must be screened before publication. |
| Approvals still needed | Exact role and collaborators; timeframe; approved screenshots/video; intended public naming; real outcomes/metrics; license/reuse wording. |
| Forbidden claims | Do not call it a production OS, production AI product, reliable accessibility interface, shipping desktop app, or validated spatial-computing product. Do not imply camera/privacy guarantees beyond the public README. |
| Evidence links | [README](https://github.com/Diannn3/AedriAIn#readme) · [repository metadata](https://api.github.com/repos/Diannn3/AedriAIn) · [prototype-01 branch](https://github.com/Diannn3/AedriAIn/tree/prototype-01)

### 3. IMS Academic Hub

| Field | Verified public record / publication boundary |
|---|---|
| Project | IMS Academic Hub — a mobile-first application for the UPLB Institute of Mathematical Sciences Math Building. |
| Repository URL | [github.com/Diannn3/ims-app](https://github.com/Diannn3/ims-app) |
| Public status | Public; not archived; default branch `master`; public homepage listed in repository metadata: [ims-app-lime.vercel.app](https://ims-app-lime.vercel.app); repository-wide license not present. Live deployment status and approval need confirmation. |
| Public repository facts | README describes three domains: indoor navigation, verified academic information, and private student tools. It documents semantic SVG maps, client-side A* routing, permanent room/space IDs, publication boundaries, local-only IndexedDB gradebooks, Supabase/PostgreSQL-backed academic data, review workflows, tests, and CI. It warns that the map geometry is schematic and site-unverified. |
| Verified stack | README: SvelteKit, TypeScript, Supabase/PostgreSQL, IndexedDB, semantic SVG maps, client-side A* routing, SvelteKit/Supabase SSR, Vitest, Playwright, pgTAP, and CI. GitHub language summary: TypeScript, Svelte, PLpgSQL, JavaScript, CSS, Shell, HTML. |
| Candidate role | Needs Aedrian confirmation. Candidate evidence-led framing: information architecture, indoor-wayfinding model, verified-public/private data boundary, and testing/validation work. Do not state institutional ownership or sole authorship without approval. |
| Candidate status | Active development / prototype implementation; exact status and whether the listed deployment remains current need Aedrian confirmation. |
| Outcomes / metrics | Needs Aedrian confirmation. No verified institutional adoption, accessibility outcome, navigation accuracy, user count, or academic-data coverage claim. |
| Screenshots / media | Needs Aedrian confirmation. Do not publish unverified floor plans, personal student data, synthetic seed data as if real, or images implying institutional endorsement. |
| Approvals still needed | Exact role and collaborators; timeframe; permission to name UPLB/IMS in portfolio copy; approved screenshots/diagrams; live-link approval; real outcomes/metrics; license/reuse wording. |
| Forbidden claims | Do not call the maps architectural drawings, production-grade accessibility or emergency routing, institutionally endorsed software, or a source of current official schedules unless separately verified. Do not present synthetic/demo records as real UPLB data. |
| Evidence links | [README](https://github.com/Diannn3/ims-app#readme) · [repository metadata](https://api.github.com/repos/Diannn3/ims-app) · [listed homepage](https://ims-app-lime.vercel.app)

### 4. Aescent Web Studio

| Field | Verified public record / publication boundary |
|---|---|
| Project | Aescent Web Studio — public agency portfolio repository and local-business web-design practice. |
| Repository URL | [github.com/Diannn3/aescent-website](https://github.com/Diannn3/aescent-website) |
| Public status | Public; not archived; default branch `main`; repository metadata lists homepage [aescentwebstudios.vercel.app](https://aescentwebstudios.vercel.app); repository-wide license not present. Canonical/live status needs confirmation before linking. |
| Public repository facts | GitHub metadata describes the repository as “Aescent Web Studio agency portfolio and interactive website.” The public README is still the Astro starter README, so it does not substantiate specific client outcomes, service claims, or implementation details. |
| Verified stack | GitHub metadata/language summary: Astro, TypeScript, JavaScript. Do not infer additional stack or operating processes from the repository README. |
| Candidate role | Needs Aedrian confirmation. Candidate evidence-led framing: local-business web design and delivery practice, only to the extent supported by approved public work and owner confirmation. |
| Candidate status | Public repository / agency portfolio; exact shipped state, client-delivery status, and canonical deployment need Aedrian confirmation. |
| Outcomes / metrics | Needs Aedrian confirmation. No client results, revenue, lead volume, conversion rate, or performance claims are verified by the public README. |
| Screenshots / media | Needs Aedrian confirmation. Do not reuse the existing Aescent portfolio’s visual identity, layout, code, or screenshots in the new personal portfolio. |
| Nested client example | BPO Network & Data Solutions may appear only if Aedrian confirms client permission and provides public evidence. Until then, treat it as `Needs Aedrian confirmation`; do not name it, publish its materials, or imply endorsement. |
| Approvals still needed | Exact founder/operator role; timeframe; approved service and process language; canonical URL; approved screenshots; client and BPO naming permission; real outcomes/metrics; license/reuse wording. |
| Forbidden claims | Do not claim client success, commercial traction, revenue, measurable growth, exclusive niche expertise, or delivery outcomes from this repository alone. Do not portray BPO Network & Data Solutions as a public case study without explicit approval. Do not copy the existing Aescent portfolio into the new portfolio. |
| Evidence links | [repository](https://github.com/Diannn3/aescent-website) · [README](https://github.com/Diannn3/aescent-website#readme) · [repository metadata](https://api.github.com/repos/Diannn3/aescent-website) · [listed homepage](https://aescentwebstudios.vercel.app)

## Cross-project approval checklist

Before any case study is published, obtain explicit confirmation for:

- Aedrian’s exact role, collaborators, and timeframe for each project.
- Which repositories, deployments, project names, and screenshots may be linked or shown.
- Whether UPLB, IMS, Aescent clients, or BPO Network & Data Solutions may be named.
- Any measurable outcome, user count, performance figure, adoption statement, testimonial, or client result.
- Any public location, degree/program, email address, résumé, or headshot.
- License and reuse wording for each repository.
- Final status labels: live, active, prototype, or case study.

Until confirmed, retain `Needs Aedrian confirmation` and prefer architecture, constraints, tests, and documented prototype behavior over outcome language.

## Portfolio safety boundary

The new portfolio must not contain private vault names, paths, indexes, logs, raw notes, memory details, agent prompts/configuration, environment values, API keys, local ports, private repositories, or copied implementation from an existing portfolio. This manifest intentionally records only public repository evidence and publication gates; it is not a source for exposing private project internals.

