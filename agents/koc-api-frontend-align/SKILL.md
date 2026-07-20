---
name: koc-api-frontend-align
description: >-
  Reads hktv_koc backend API contracts (OpenAPI/Swagger, route definitions, DTOs)
  and aligns real usage in hktv_koc_frontend_v2 or hktv_koc_cms with those
  contracts. Produces drift reports (wrong path, method, query/body shape, headers)
  and implements fixes when paired with the dev skill. Use when syncing frontend or
  CMS clients to backend API changes, auditing API usage, or after backend contract
  updates for KOC stack.
---

# KOC API ↔ frontend/CMS alignment

Sub-workflow for **contract-first** changes across **hktv_koc** (backend) and **hktv_koc_frontend_v2** or **hktv_koc_cms** (consumers). Pair with **dev** when the outcome includes code changes: this skill supplies the contract + usage map; **dev** implements patches against the PM summary and existing patterns.

## When to run

- User names `hktv_koc` plus `hktv_koc_frontend_v2` or `hktv_koc_cms` and API alignment, propagation, or “match backend”.
- After backend adds/changes/removes endpoints or request/response shapes.
- Before a large frontend/CMS feature that depends on new backend APIs.

## Repos and scope

| Role | Typical repo |
|------|----------------|
| Source of truth | `hktv_koc` (backend) |
| Consumers (pick one or both per task) | `hktv_koc_frontend_v2`, `hktv_koc_cms` |

If the workspace only has one repo checked out, state that limitation and still analyze what is available; note what requires the other clone.

## Phase 1 — Load backend contract

Discover and read **authoritative** API description. Search in order:

1. **OpenAPI / Swagger**: `openapi.yaml`, `openapi.json`, `swagger.json`, `**/api-docs/**`, Spring `springdoc` / `springfox` config paths.
2. **Framework routes**: Spring `@RequestMapping` / `@GetMapping` etc., Nest/Express routers, gRPC proto files if applicable.
3. **Shared DTOs / validation**: request/response types, validation annotations, serializers — when no single OpenAPI file exists, treat these as the contract.

Build an internal map: `method + path pattern → query/body/header expectations → response shape notes`.

## Phase 2 — Inventory consumer usage

In the target frontend/CMS repo, find **actual** calls:

- API client modules, `fetch`/`axios`/generated SDKs, React Query keys, service layers.
- Env-based base URLs (`VITE_*`, `NEXT_PUBLIC_*`, etc.) — note which base URL maps to which backend.

For each call site, record: URL (resolved or template), HTTP method, payload shape, and how responses are typed/parsed.

## Phase 3 — Align (diff)

Compare contract map to usage:

- **Path/method**: wrong verb, missing path segments, renamed routes.
- **Query/body**: missing required fields, wrong names, wrong nesting, obsolete fields still sent.
- **Headers/auth**: missing `Authorization`, wrong content-type, API keys.
- **Response**: fields removed/renamed on backend but still read on client; unsafe assumptions on optional fields.

Classify each issue: **breaking** (runtime failure / wrong data) vs **latent** (works until edge case).

## Deliverables

1. **Alignment summary** — table or short list: endpoint, consumer location(s), issue, fix direction (consumer change vs backend bug if contract and impl disagree).
2. **If implementing (with dev)** — minimal patches: update client calls, types, and mocks/fixtures to match contract; no drive-by refactors.

## Rules

- **Contract wins** unless the user explicitly says production backend behavior differs from spec — then document the real behavior and recommend spec or code fix.
- Prefer **one** client abstraction per API surface (existing service module) over scattering raw URLs.
- After edits, if the repo has API/type checks or tests touching these calls, run them or list what the user should run.

## Handoff to dev

Pass to **dev**:

- PM-style bullet list: scope = align consumer X to contract Y, files/call sites touched, definition of done = no drift on listed endpoints + tests green.
- This skill does **not** replace PM for product requirements; it **narrows** technical API alignment work.
