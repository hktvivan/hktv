# 01 - Executive Summary

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

<!-- Everything below is specification detail. -->

---

## 🌟 TL;DR

<!-- 
CONSTRAINT: Maximum 3 sentences. If you can't summarize it, you don't understand it.
-->

{One to three sentences describing what this project is and why it matters.}

---

## 🎯 Problem Statement

<!-- What pain exists? Who feels it? Why now? -->

{Describe the problem this project solves. Be specific about who experiences this pain and what the current workarounds are.}

---

## 🔍 Prior Art & Existing Solutions

<!-- 
REQUIRED: Document what exists before building.
Before reinventing wheels, explicitly research and document:
(a) Existing libraries/tools considered
(b) Why they were rejected, adopted, or wrapped
(c) License compatibility with this project
-->

| Library/Tool | What It Does | Decision | License | Rationale |
|--------------|--------------|----------|---------|-----------|
| {library} | {capability} | BUY / BUILD / WRAP | {MIT/Apache/etc} | {Why this decision} |
| {library} | {capability} | BUY / BUILD / WRAP | {MIT/Apache/etc} | {Why this decision} |

**Summary:** {Why we're building custom OR which library we're adopting and how}

---

## ❌ Non-Goals (Explicit Exclusions)

<!-- 
CONSTRAINT: Minimum 3 items. Be explicit about what this project will NEVER do.
This prevents scope creep and sets clear boundaries.
-->

| Non-Goal | Rationale |
|----------|-----------|
| {Thing we won't do} | {Why it's out of scope} |
| {Thing we won't do} | {Why it's out of scope} |
| {Thing we won't do} | {Why it's out of scope} |

---

## ✅ Features Overview

<!-- 
CONSTRAINTS:
- Maximum 5 P0 features
- Each feature ≤5 lines here (details in separate feature docs)
- Difficulty labels required

DIFFICULTY LABELS:
- [KNOWN] — Standard patterns, proven libraries
- [EXPERIMENTAL] — Approach exists but needs validation
- [RESEARCH] — Active problem, no proven solution. NEVER in P0.
-->

| Priority | Feature | Difficulty | Description |
|----------|---------|------------|-------------|
| P0 | {Feature Name} | `[KNOWN]` | {One sentence} |
| P0 | {Feature Name} | `[KNOWN]` | {One sentence} |
| P1 | {Feature Name} | `[EXPERIMENTAL]` | {One sentence} |
| P2 | {Feature Name} | `[RESEARCH]` | {One sentence} |

→ See individual [Feature Docs](./03_feature_{name}.md) for details.

---

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- FREE ZONE START - Add custom sections below using "## [Custom] 🎨 Title"-->
<!--                                                                         -->
<!-- Maximum 5 custom sections. This is YOUR space for thinking that doesn't -->
<!-- fit standard templates. Be creative. Be honest. Be useful.              -->
<!--                                                                         -->
<!-- 📐 STRUCTURAL EXAMPLES:                                                 -->
<!--   ## [Custom] 📊 Performance Benchmarks                                 -->
<!--   ## [Custom] 🔄 Migration Strategy                                     -->
<!--   ## [Custom] 🧪 A/B Testing Plan                                       -->
<!--   ## [Custom] 📈 Success Metrics                                        -->
<!--   ## [Custom] 🔐 Security Considerations                                -->
<!--                                                                         -->
<!-- 🧠 THINKING TOOLS (for complex decisions):                              -->
<!--   ## [Custom] ⚖️ Philosophical Tensions — Contradictions you're         -->
<!--        navigating (speed vs accuracy, simplicity vs power)              -->
<!--   ## [Custom] ⚰️ Assumption Graveyard — Risky bets that could kill      -->
<!--        the feature if wrong (with early validation strategy)            -->
<!--   ## [Custom] 🎭 Metaphor Map — Analogies that explain the system       -->
<!--        to different audiences (devs, users, stakeholders)               -->
<!--   ## [Custom] 🔮 Future Regret Analysis — "What will we wish we had     -->
<!--        done differently in 6 months?"                                   -->
<!--   ## [Custom] 🐘 Uncomfortable Questions — Things nobody wants to       -->
<!--        ask but everyone should (scaling, maintenance burden, etc.)      -->
<!--   ## [Custom] 📜 Decision Log — Key choices made and WHY (not just what)-->
<!--                                                                         -->
<!-- 🎯 SCOPE & BOUNDARIES:                                                  -->
<!--   ## [Custom] 🚧 Scope Fences — Hard lines that prevent scope creep     -->
<!--   ## [Custom] 🎰 Feature Lottery — Ideas we're NOT doing (but could)    -->
<!--   ## [Custom] ⏰ Time Bombs — Technical debt we're knowingly creating   -->
<!--                                                                         -->
<!-- Use any local sample files if the workspace includes them                -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->


<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- FREE ZONE END                                                           -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

---

## 📊 Success Metrics

<!-- How do we know we won? Quantifiable where possible. -->

| Metric | Target | How to Measure |
|--------|--------|----------------|
| {Metric name} | {Target value} | {Measurement method} |
| {Metric name} | {Target value} | {Measurement method} |

---

## 📅 Scope Budget

<!-- 
MANDATORY. No budget = no approval.
This prevents visions that promise more than P0 can deliver.
-->

| Phase | Duration | Hard Limit |
|-------|----------|------------|
| P0 (Walking Skeleton) | {3-5 days} | Max 5 features, [KNOWN] only |
| P1 (Foundation) | {1-2 weeks} | May include [EXPERIMENTAL] |
| P2+ | {estimate} | May include [RESEARCH] |

---

## 🛠️ Tech Preferences

<!-- 
State preferences or explicitly say "no preference."
HyperArch makes final decisions, but vision can express preferences.
-->

| Category | Preference | Rationale |
|----------|------------|-----------|
| Language | {e.g., TypeScript, Go, Rust, or "No preference"} | {Why} |
| Framework | {e.g., FastAPI} | {Why} |
| Storage | {e.g., SQLite} | {Why} |
| {Other} | {Preference or "No preference"} | |

---

## ❓ Open Questions

<!-- 
Unresolved decisions that block nothing yet.
These become decisions during implementation.
-->

- {Question 1}
- {Question 2}

---

<!-- OPTIONAL SECTION: Include if project has end-users -->
## 👥 User Model

<!-- 
Who uses this? What's their workflow? 
Remove this section for libraries/utilities with no end-user.
-->

| User | Interface | Capabilities |
|------|-----------|--------------|
| {User type} | {CLI/Web/API/etc} | {What they can do} |

---

<!-- OPTIONAL SECTION: Include for multi-agent handoffs -->
## 📋 Handoff Checklist

<!-- 
HyperDream: Complete before handoff to HyperArch.
Remove this section if not using agent handoffs.
-->

- [ ] TL;DR exists and is ≤3 sentences
- [ ] Prior Art section documents existing solutions considered
- [ ] Non-Goals has ≥3 explicit exclusions
- [ ] All P0 features have difficulty labels
- [ ] No `[RESEARCH]` items in P0
- [ ] Scope Budget is defined
- [ ] Success Metrics are quantifiable

**HANDOFF STATUS:** ⬜ Pending | ✅ Complete

---

## ✅ Executive Summary Validation Checklist

<!-- MANDATORY: Must pass before blueprint is considered "ready for review". -->

### Narrative (The Story)
- [ ] **Problem** is specific (names who hurts and how)
- [ ] **Value** is quantifiable or emotionally resonant
- [ ] **Consequence** of not solving is clear

### Scope Boundaries
- [ ] **Non-Goals** has ≥3 explicit exclusions
- [ ] **Features Overview** has ≤5 P0 features
- [ ] No `[RESEARCH]` items in P0

### Technical Grounding
- [ ] **Prior Art** section documents ≥2 alternatives considered
- [ ] **Tech Preferences** are stated (or "no preference")
- [ ] **Scope Budget** has time estimates per phase

---

**Next:** [Architecture](./02_architecture.md)

---

**← Back to:** [Index](./00_index.md)
