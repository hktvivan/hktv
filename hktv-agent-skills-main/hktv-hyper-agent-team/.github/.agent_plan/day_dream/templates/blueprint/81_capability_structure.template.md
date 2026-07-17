# 81 - Capability Structure

> Part of [{Project Name} Blueprint](./00_index.md)

---

## 📖 The Story

<!--
REQUIRED: Visual, scannable narrative — NOT a text wall.
Use ASCII boxes, tables, and emoji anchors. A PM should grasp the problem/solution in 10 seconds.
If you can't draw the pain and vision, you don't understand the feature.
-->

### 😤 The Pain

<!-- What's broken? Who hurts? Show it visually! -->

```
Current Reality:
┌─────────────────────────────────────────┐
│  User wants {X}  ──────►  💥 BLOCKED 💥│
│                                         │
│  Because: {root cause}                  │
└─────────────────────────────────────────┘
```

| Who Hurts | Pain Level | Frequency |
|-----------|------------|-----------|
| {persona} | 🔥🔥🔥 High | Daily |
| {persona} | 🔥🔥 Medium | Weekly |

### ✨ The Vision

<!-- What does success look like? Show the transformation! -->

```
After This Feature:
┌─────────────────────────────────────────┐
│  User wants {X}  ──────►  ✅ SUCCESS    │
│                                         │
│  Flow: {step} → {step} → {result}       │
└─────────────────────────────────────────┘
```

### 🎯 One-Liner

> {The elevator pitch in ONE sentence — what we're building and why it matters}

---

## 🔧 The Spec

<!-- Technical specification begins here -->

---

## 🧱 Capability Organization

<!-- 
CONSTRAINT: This document is required when the blueprint spans multiple reusable or project-specific capabilities.
It defines the physical organization of the codebase.
-->

### 📦 Reusable Capabilities

<!-- 
MANDATORY SKELETON: List all reusable capabilities OR state "N/A — No reusable capabilities planned."
Capabilities that are generic and could be used in other projects.
-->

| Capability | Path | Purpose | Reuse Potential |
|------------|------|---------|------------------|
| [{Capability Name}](./capabilities/{capability_name}.md) | `{path}/` | {Brief description of its reusable purpose} | {Other projects that could use this} |

<!-- If no reusable capabilities: -->
<!-- N/A — All capabilities are project-specific. No reuse planned. -->

### 🎯 Project-Specific Capabilities

<!-- 
MANDATORY SKELETON: Always include.
Capabilities that contain logic unique to this project.
-->

| Capability | Path | Purpose |
|------------|------|---------|
| [{Capability Name}](./capabilities/{capability_name}.md) | `{path}/` | {Brief description of its project-specific role} |

---

## 📂 File Tree (Proposed)

<!-- 
Show only the parts of the tree that matter for this blueprint.
Adapt the folders to the real workspace shape instead of forcing a house layout.
-->

```text
{project_root}/
├── apps/
│   └── {app_or_entrypoint}/
├── services/
│   └── {service_or_process}/
├── packages/
│   └── {shared_capability}/
├── docs/
│   └── {supporting_artifacts}
└── tests/
	└── integration/
```

---

## 🔗 Capability Dependencies

<!-- 
Mermaid diagram showing dependencies between capabilities.
-->

## 📊 Data Flow Diagram
<!-- 
Mermaid diagram showing data flow.
-->

---

## ✅ Capability Structure Validation Checklist

<!-- MANDATORY: Complete before implementation phase. -->

### Completeness
- [ ] **Reusable Capabilities** table filled OR marked "N/A — No reusable capabilities"
- [ ] **Project-Specific Capabilities** table lists all implementation capabilities
- [ ] **Proposed File Tree** reflects current phase target

### Traceability  
- [ ] Each listed capability has a corresponding spec in `capabilities/`
- [ ] Capability dependencies diagram is present and accurate

---

**Next**: [Implementation](./80_implementation.md)
