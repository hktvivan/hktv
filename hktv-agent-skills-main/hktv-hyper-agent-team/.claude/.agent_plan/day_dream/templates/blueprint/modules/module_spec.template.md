# Capability Specification: {Capability Name}

> Part of [{Project Name} Blueprint](../00_index.md)

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
│  User wants {X}  ──────►  💥 BLOCKED 💥 │
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

## 📝 Overview
<!-- MANDATED: High-level purpose of the capability. Why does it exist? -->
{Describe the core mission of this capability in 1-2 sentences.}

### 🎯 Responsibilities
<!-- MANDATED: What this capability is responsible for and, crucially, what it is NOT responsible for. -->
- **✅ DO**: {Responsibility 1}
- **✅ DO**: {Responsibility 2}
- **❌ DON'T**: {What should be handled by other capabilities}

### 📚 External Dependence

<!-- MANDATED: Any external systems, APIs, or services this capability relies on. -->
| Dependency | Type | Purpose |
|------------|------|---------|
| `{ExternalService}` | API/Service | {What functionality is borrowed?} |
| `{ExternalLibrary}` | Library/Framework | {Why is this library needed?} |

---
## 🔗 Implements Features

<!-- 
MANDATORY: Bidirectional traceability. This capability exists to serve these features.
If a capability doesn't implement any features, question whether it should exist.
-->

| Feature | Blueprint | What This Capability Provides |
|---------|-----------|-------------------------------|
| {Feature Name} | [NN_{feature}.md](../NN_{feature}.md) | {Specific responsibility within feature} |
| {Feature Name} | [NN_{feature}.md](../NN_{feature}.md) | {Specific responsibility within feature} |

<!-- If truly utility-only: -->
<!-- N/A — Utility capability providing cross-cutting {capability} to multiple features. -->

---
## 📂 Folder Structure
<!-- MANDATED: Full details of the capability's internal organization. -->

```text
{capability_name}/
├── src/                    # Primary implementation
├── contracts/              # Schemas, interfaces, or shared types (Optional)
├── adapters/               # Boundary integrations (Optional)
├── data/                   # Static assets or templates (Optional)
└── tests/                  # Capability-specific tests
```

---

## ⚙️ Implementation Details
<!-- MANDATED: Specific technical details on how the capability achieves its goals. -->

### Key Components
| Component | Type | Description |
|-----------|------|-------------|
| `{ComponentName}` | Service / Class / Function | {Role in the capability} |
| `{function_name}` | Function | {Primary utility} |

### Public API / Interfaces
<!-- How other capabilities interact with this one. -->
{Provide examples of public methods, endpoints, or interfaces. Use the language-appropriate syntax for the project.}

Example (Generic):
```
{public_interface}(input) -> output
```

---

## 🔌 Architecture & Dependencies
<!-- MANDATED: How this capability fits into the larger system. -->

### 📊 Dependency Diagram
<!-- MANDATED: Mermaid diagram showing relationships. -->
```mermaid
graph TD
    %% Internal Dependencies
    Capability -->|Uses| InternalDep1
    
    %% External Dependencies
    Capability -->|Uses| ExternalLib
    
    %% Consumers
    Consumer -->|Uses| Capability
```

### 🔗 Dependency Details
<!-- MANDATED: Table describing each dependency in detail. -->
| Dependency | Type | Purpose |
|------------|------|---------|
| `{InternalDep}` | Internal | {What functionality is borrowed?} |
| `{ExternalLib}` | External | {Why is this library needed?} |

### 📊 Dataflow Diagram
<!-- MANDATED: Mermaid diagram showing data flow within and between internal and external components. -->

```mermaid
graph LR
    %% Data Sources
    DataSource1[Data Source 1]
    DataSource2[Data Source 2]
    %% Internal Components
    ComponentA[Component A]
    ComponentB[Component B]
    ComponentC[Component C]
    %% Data Sinks
    DataSink1[Data Sink 1]
    DataSink2[Data Sink 2] 
    %% Data Flows
    DataSource1 -->|Input Data| ComponentA
    DataSource2 -->|Input Data| ComponentB
    ComponentA -->|Processed Data| ComponentC
    ComponentB -->|Processed Data| ComponentC
    ComponentC -->|Output Data| DataSink1
    ComponentC -->|Output Data| DataSink2
```

### 📝 Data Information
<!-- MANDATED: Data description, formats, schemas, and storage mechanisms used by this capability. -->

| Data Sources | Description | Format/Schema | Storage Mechanism |
|-----------|-------------|---------------|-------------------|
| `{DataSource1}` | {What this data represents} | {e.g., JSON, XML, dataclass, Custom Model} | {e.g., Database, In-Memory, File} |
| `{DataSource2}` | {What this data represents} | {e.g., JSON, XML, dataclass, Custom Model} | {e.g., Database, In-Memory, File} |

## ⌨️ Entry Points (Optional)
<!-- If the capability exposes commands, endpoints, or UI actions, describe them here. -->
- **Entry**: `{entry_name}`
- **Invocation**: `{how users or other systems invoke it}`

---

## 🧪 Quality Assurance (Optional)
<!-- How to verify this capability works correctly. -->
- **Unit Tests**: {Focus areas}
- **Integration Tests**: {Interaction points}

---

## ✅ Capability Validation Checklist

<!-- MANDATORY: Complete before implementation. -->

### Traceability
- [ ] **Implements Features** section links to ≥1 feature OR explicitly marked as utility
- [ ] All linked features have backlinks to this capability spec

### Completeness
- [ ] **Responsibilities** clearly state DO and DON'T
- [ ] **Dependency Diagram** shows all internal/external dependencies
- [ ] **Public API** section defines interface contract
- [ ] **Folder Structure** matches the actual workspace conventions

---

**Back to:** [Capability Structure](../81_capability_structure.md) | [Implementation Plan](../80_implementation.md)
