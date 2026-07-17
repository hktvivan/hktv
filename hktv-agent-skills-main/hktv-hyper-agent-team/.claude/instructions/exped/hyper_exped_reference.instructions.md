---
applyTo: "**/hyper_expedition.agent.md"
---

# HyperExped Reference Guide

## Purpose
HyperExped adapts this skill pack to **external projects**. This file provides runtime reference for edge cases, structure mapping, and export safety.

## Pipeline Context

HyperExped operates within the adaptation pipeline orchestrated by HyperOrch:

```
Scout → Readiness → Planning → 🛑 → Execution → Verify
```

**HyperExped Responsibilities:**
| Phase | Role | Output |
|-------|------|--------|
| Scout | **Owner** | `scout_report.md` |
| Planning | **Contributor** (with Dream) | `adaptation_scope.yaml`, `adaptation_notes.md` |
| Execution | **Coordinator** | Delegates to Smith |

## Delivery Model

**Key Principle:** Target projects remain focused on their own code. Planning artifacts stay in the source pack or staging area.

| Location | Assets |
|----------|--------|
| **Source pack / staging** | `.claude/` source artifacts, `.agent_plan/`, scout reports, manifests, adaptation notes |
| **Target** | User-approved agent, instruction, prompt, and documentation locations discovered during scouting |

**CRITICAL:** NO `.agent_plan/` in target by default. All planning artifacts stay in the source pack or staging area.

## Execution Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Chunk size | ≤5 files/batch | Enables granular review and rollback |
| Max artifacts | ≤25 per expedition | Prevents overwhelming scope |
| Mode | PAUSE (default) | Human confirmation per chunk |

## Special Files by Ecosystem

HyperExped must **dynamically discover** what special files the target uses. Do NOT assume one house layout.

| Ecosystem | Config Files | Other Special Files & Conventions |
|-----------|--------------|-----------------------------------|
| JavaScript/Node | `package.json`, `tsconfig.json`, `vite.config.ts`, `next.config.js` | `package-lock.json`, `.nvmrc`, `src/index.ts` (entry), `app/` or `pages/` (routes) |
| Rust | `Cargo.toml` | `Cargo.lock`, `src/lib.rs` or `src/main.rs`, `build.rs` |
| Go | `go.mod` | `go.sum`, `main.go`, `internal/`, `cmd/` |
| C#/.NET | `*.csproj`, `*.sln` | `Directory.Build.props`, `Program.cs`, `appsettings.json` |
| Java/Kotlin | `build.gradle`, `pom.xml` | `settings.gradle`, `src/main/java/`, `Application.kt` |
| Unity | `ProjectSettings/ProjectSettings.asset` | `Packages/manifest.json`, `Assets/`, `Editor/`, `*.asmdef` |
| Docs-first | `README.md`, `docs/` | Existing guidance folders, onboarding notes |

## Skill-Pack Concept → Target Mapping

| Pack Concept | Common Target Locations |
|--------------|-------------------------|
| Claude agents | Existing target agent directory, `docs/ai-agents/`, or another approved location |
| Harness instructions | Existing target instruction directory, `docs/instructions/`, or another approved location |
| Harness prompts | Existing target prompt directory, `docs/prompts/`, or another approved location |
| `.agent_plan/` notes | Keep in source pack or staging area |

> ⚠️ **These are GUIDANCE, not prescription.** Observe actual target structure first. If the project already has an AI docs area, adapt into that.

## Export Locations

| Artifact Type | Primary Location | Fallback |
|---------------|------------------|----------|
| Agents | Detected target agent directory | `docs/ai-agents/` |
| Instructions | Detected target instruction directory | `docs/instructions/` |
| Prompts | Detected target prompt directory | `docs/prompts/` |
| If inaccessible | N/A | `.agent_plan/expedition/<project>/` |

## Edge Cases

### Case: Pack-to-Pack Export
If target already has an equivalent agent pack or exported AI guidance:
```
🤨 HOLD UP — TARGET ALREADY HAS AN AGENT PACK

Did you perhaps mean to:
1. 📋 Merge selected files? → Plan a targeted adaptation
2. 🔄 Sync existing guidance? → Compare before overwriting
3. 🆕 Create NEW agents? → Use HyperAgentSmith directly
4. 🚀 Proceed anyway (I know what I'm doing)
```

### Case: Empty Project
Suggest minimal structure, propose a lightweight bootstrap export.

### Case: Poorly Structured Project
Present options: Restructure First / Proceed Anyway (fallback location) / Minimal Export / Abort.

### Case: Non-VS Code Environment
HALT and warn: `.agent.md` format is VS Code-specific. Offer to export as generic markdown guides.

### Case: Monorepo
Ask user to specify target package. Export to a package-specific approved guidance location or the repository root guidance area.

## Improvisation Protocol

1. **Observe**: `list_dir` and `read_file` to understand existing structure
2. **Identify Patterns**: Look for existing `utils/`, `helpers/`, `lib/`, `docs/` folders
3. **Propose Mapping**: Present to user with Accept/Modify options
4. **Get Approval**: NEVER auto-place without confirmation
5. **Document**: Record mapping in export plan
