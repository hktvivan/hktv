---
applyTo: "**/hyper_expedition.agent.md,**/hyper_san_checker.agent.md"
---

# Expedition Pipeline Schema Reference

## Goals
- Define canonical schemas for all adaptation artifacts
- Provide validation rules for adaptation phases
- Ensure consistent data formats across pipeline

## Pipeline Overview
5-phase adaptation workflow with one mandatory user stop point.

```
Scout → Readiness → Planning → 🛑 → Execution → Verification
```

## Artifact Locations

| Artifact | Location | Notes |
|----------|----------|-------|
| Scout Report | `.agent_plan/expedition/{target}/scout_report.md` | YAML frontmatter + markdown |
| Adaptation Scope | `.agent_plan/expedition/{target}/adaptation_scope.yaml` | Full YAML |
| Adaptation Notes | `.agent_plan/expedition/{target}/adaptation_notes.md` | Markdown |
| Manifest | `.agent_plan/expedition/{target}/manifest.yaml` | Generated post-verify |

**Target receives:** exported agents, instructions, prompts, and any explicitly approved support files.

---

## Scout Report Schema

```yaml
---
expedition_id: "exp_YYYYMMDD_project_name"
target_path: "/absolute/path/to/target"
scout_timestamp: "ISO8601"

detected_project:
  type: known_framework | custom_framework | multi_framework | bare_project | monorepo
  primary_language: "string"
  languages_present: ["list"]
  frameworks:
    - name: "Vue3"
      version: "3.x"
      config_file: "vite.config.ts"
      confidence: high | medium | low
  observed_patterns:
    config_files: [{path, type}]
    build_system:
      detected: "npm | pnpm | yarn | cargo | go"
      lock_file: "string"
    directory_style: "feature-based | layer-based | hybrid"
    existing_agent_config: [{path, type}]

structure_health: healthy | degraded | incompatible

blockers:
  - code: "ERROR_CODE"
    message: "Human-readable message"
    severity: critical

warnings:
  - code: "WARN_CODE"
    message: "Human-readable message"
    suggestion: "How to fix"

recommendation: PROCEED | PROCEED_WITH_CAUTION | ABORT
abort_reason: "Only if recommendation is ABORT"

adaptation_hints:
  suggested_agent_location: ".github/agents/"
  suggested_instruction_location: ".github/instructions/"
  test_command: "npm test"
  build_command: "npm build"
---

# Scout Report: {project_name}

## 📁 Project Structure Analysis
{prose description}

## 🎯 Export Compatibility
{analysis}

## ⚠️ Concerns
{list of concerns}
```

---

## Readiness Gate Checks

### Tier 1: Hard Blockers (ALL must pass)
| Code | Check | Description |
|------|-------|-------------|
| `target_exists` | Target accessible | Path exists and readable |
| `no_conflicting_pack` | No conflicting agent pack | Cannot overwrite another pack blindly |
| `scope_bounded` | ≤25 artifacts | Max artifacts per expedition |
| `no_active_lock` | No lock file | Previous expedition complete |
| `not_detached_head` | On branch | Not in detached HEAD state |

### Tier 2: Git State
| Code | Behavior | Description |
|------|----------|-------------|
| `clean_working_directory` | BLOCKER | No uncommitted changes |
| `submodule_clean` | BLOCKER | No dirty submodules |
| `shallow_clone_detected` | WARNING | Incomplete git history |
| `untracked_in_target` | BLOCKER | Untracked files at destinations |
| `on_feature_branch` | WARNING | Not on main/master |
| `ahead_of_remote` | WARNING | Unpushed commits |

### Tier 3: Source Readiness
| Code | Check | Description |
|------|-------|-------------|
| `agents_exist` | Source agents present | `data/agents/` |
| `instructions_exist` | Source instructions present | `data/instructions/` |

---

## Adaptation Scope Schema

```yaml
adaptation:
  id: "exp_YYYYMMDD_project_name"
  created: "ISO8601"
  target:
    path: "/absolute/path"
    type: "known_framework | custom_workspace | monorepo | other"
  
  artifacts:
    agents:
      - source: "data/agents/xxx.agent.md"
        target: ".github/agents/xxx.agent.md"
        adaptation: transform | copy
        transformations:
          - update_cross_refs
          - inject_header_if_needed
    
    instructions:
      - source: "path/to/source.instructions.md"
        target: ".github/instructions/target.instructions.md"
        adaptation: transform | copy
    
    prompts:
      - source: "path/to/source.prompt.md"
        target: ".github/prompts/target.prompt.md"
        adaptation: copy
  
  support_structures:
    - type: directory | editor_config | breadcrumb
      owner: "smith"
      output_path: "path"
  
  execution:
    chunk_size: 5
    total_chunks: N
    mode: PAUSE | CONTINUOUS
```

---

## Adaptation Notes Schema

```markdown
# Adaptation Notes: {Framework} Export

**Expedition ID:** exp_YYYYMMDD_project_name  
**Target Framework:** {framework}  
**Generated:** ISO8601

---

## 📂 Path Conventions

| Artifact Type | Source Pattern | Target Pattern |
|---------------|----------------|----------------|
| Agents | `*.agent.md` | `.github/agents/*.agent.md` |
| Instructions | `*.instructions.md` | `.github/instructions/*.instructions.md` |
| Prompts | `*.prompt.md` | `.github/prompts/*.prompt.md` |
| Editor Config | (generated) | `.vscode/mcp.json` or equivalent |
| Breadcrumb | (generated) | `CONTRIBUTING.md` |

---

## 🔄 Transformations

| Original | Target Framework | Transformed |
|----------|------------------|-------------|
| `hyper_architect.agent.md` | target workspace | `hyper_architect.agent.md` |
| `hyper_san_checker.agent.md` | target workspace | `hyper_san_checker.agent.md` |
| `hyper_orchestrator.agent.md` | target workspace | `hyper_orchestrator.agent.md` |

---

## 🛑 Stopping Rules Adaptation

| Category | Example | Action |
|----------|---------|--------|
| Semantic | "NEVER edit source files" | VERBATIM |
| Stack-specific | "Use pnpm" | ADAPT |
| Source-pack-specific | "Check local export manifest" | ADAPT or REMOVE |
```

---

## Pack-Managed Header Format

All exported files MUST include this header:

```markdown
<!-- ═══════════════════════════════════════════════════════════════════
  PACK-MANAGED FILE
     
    Source: {source_pack_path}
     Expedition: {expedition_id}
     Created: {timestamp}
     Hash: sha256:{hash}
     
     ⚠️ MODIFICATION RULES:
     - Lines between USER CUSTOMIZATION markers are YOURS to edit
     - All other lines will be overwritten on sync
     - To prevent sync: delete this header (file becomes unmanaged)
═══════════════════════════════════════════════════════════════════ -->
```

**User Customization Zone:**
```markdown
<!-- USER CUSTOMIZATION START -->
{user's custom content preserved during sync}
<!-- USER CUSTOMIZATION END -->
```

---

## Manifest Schema

```yaml
adaptation:
  id: "exp_YYYYMMDD_project_name"
  completed: "ISO8601"
  target:
    path: "/absolute/path"
    name: "project_name"
  
  artifacts:
    - source: "original/path"
      target: "deployed/path"
      hash: "sha256:xxx"
      header_injected: true
  
  verification:
    all_created: true
    headers_present: true
    cross_refs_valid: true
    no_target_pollution: true
```

---

## Error Codes

| Code | Phase | Severity | Description |
|------|-------|----------|-------------|
| `NO_GIT` | Scout | critical | Target not a git repo |
| `CONFLICTING_PACK` | Readiness | critical | Cannot overwrite another pack blindly |
| `DIRTY_WORKING_DIR` | Readiness | blocker | Uncommitted changes |
| `SCOPE_EXCEEDED` | Readiness | critical | Too many artifacts |
| `COLLISION_DETECTED` | Feasibility | critical | File would overwrite |
| `HEADER_MISSING` | Verify | error | Exported file lacks header |
| `TARGET_POLLUTED` | Verify | critical | `.agent_plan/` found in target |
| `MCP_CONFIG_INVALID` | Verify | error | `.vscode/mcp.json` missing or invalid |
| `BREADCRUMB_MISSING` | Verify | warning | `CONTRIBUTING.md` lacks source-pack pointer |

---

## Stopping Rules Classification

When adapting agents for target:

| Category | Example | Action |
|----------|---------|--------|
| **Semantic** | "NEVER edit source files directly" | VERBATIM copy |
| **Behavioral** | "STOP if user says 'no edit'" | VERBATIM copy |
| **Stack-specific** | "Use `pnpm test`" | ADAPT to target ecosystem |
| **Source-pack-specific** | "Check export manifest before..." | ADAPT or REMOVE |
| **Tool-specific** | References to source-only tools | ADAPT or REMOVE |
