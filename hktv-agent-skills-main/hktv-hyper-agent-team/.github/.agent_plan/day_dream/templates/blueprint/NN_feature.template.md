<!--
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         FIXED SECTION NAMES                                   ║
║  Do NOT rename these sections - they are used for cross-referencing:          ║
║                                                                               ║
║  REQUIRED:        🎯 Overview, � Prior Art, 👥 User Stories,                 ║
║                   ✅ Acceptance Criteria                                      ║
║  STANDARD:        🗺️ System Context, 📊 Data Flow, 🔗 Integration Points,     ║
║                   🛠️ Technical Notes, ⚠️ Edge Cases, ❌ Out of Scope,         ║
║                   🔗 Dependencies, ❓ Open Questions, 🖼️ Related Assets       ║
║                                                                               ║
║  CUSTOM SECTIONS: Use "## [Custom] Your Title" prefix for project-specific    ║
║                   sections (max 5, min 1 custom sections per document)        ║
║                                                                               ║
║  FREE ZONES:      Look for FREE ZONE markers where you can add                ║
║                   content without following strict templates                  ║
╚═══════════════════════════════════════════════════════════════════════════════╝
-->

<!-- 
🚦 TEMPLATE SELECTION GUIDE
Use this full template for COMPLEX features:
  - ≥3 capabilities involved
  - External API integration
  - P0 priority (critical path)
  - Requires Deep Dive (algorithms, state machines, API contracts)

For SIMPLER features, use: NN_feature_simple.template.md
-->

# NN - Feature: {Feature Name}

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

### 📊 Impact

| Metric | Before | After |
|--------|--------|-------|
| {metric} | ❌ {bad state} | ✅ {good state} |
| {metric} | ❌ {bad state} | ✅ {good state} |

---

## 🔧 The Spec

<!-- Everything below this line is technical specification. -->

---

## 🎯 Overview

<!-- 
Expanded description of the feature.
This is the "appendix" for features that exceeded the 5-line limit in executive summary.
-->

{2-3 paragraphs describing the feature in detail.}

**Priority:** P0 | P1 | P2  
**Difficulty:** `[KNOWN]` | `[EXPERIMENTAL]` | `[RESEARCH]`

---

## 📚 Prior Art

<!-- 
MANDATORY SECTION: Research existing solutions before building.
This prevents reinventing wheels and documents our informed decisions.
-->

### Existing Solutions

| Solution | Type | Relevance | Status |
|----------|------|-----------|--------|
| {Library/Tool/API name} | Library / Tool / Service / Pattern | High / Medium / Low | ✅ Adopt / 🔧 Adapt / ❌ Reject |
| {Another solution} | {type} | {relevance} | {status} |

### Usage Decision

<!-- For each solution marked ✅ Adopt or 🔧 Adapt -->

**Using:** {Solution name}  
**How:** {Specific integration approach - which parts, how wrapped, etc.}  
**Why this over alternatives:** {1-2 sentences}

### Build-vs-Adopt Justification

<!-- For any custom implementation (when existing solutions were rejected) -->

| Rejected Solution | Reason for Building Custom |
|-------------------|---------------------------|
| {Library name} | {Specific limitation: too heavy, missing feature X, licensing, etc.} |

<!-- 
GUIDELINES:
- "Not invented here" is NOT a valid reason
- "We want to learn" is valid for EXPERIMENTAL features only
- Performance claims MUST have benchmarks or be marked [UNVERIFIED]
- If no prior art exists, state "No established solutions found" with search terms used
-->

---

## 🗺️ System Context

<!-- 
MANDATORY SKELETON: Always include. Write "N/A — [reason]" if not applicable.
Use when: Feature touches ≥3 capabilities or has external integrations.
Show where this feature lives in the overall system. Mermaid preferred.
-->

<!-- If not applicable: -->
<!-- N/A — Single capability, no external integrations. -->

```mermaid
flowchart LR
    subgraph "This Feature"
        F[{Feature}]
    end
    
    A[Upstream Capability] --> F
    F --> B[Downstream Capability]
    F <--> C[External API]
```

---

## 📊 Data Flow

<!-- 
MANDATORY SKELETON: Always include. Write "N/A — [reason]" if not applicable.
Use when: Data transformation is non-trivial.
Input → Processing → Output for this feature.
-->

<!-- If not applicable: -->
<!-- N/A — Straightforward pass-through, no transformation. -->

```mermaid
flowchart LR
    I["{Input type}"] --> P["{Processing step}"]
    P --> O["{Output type}"]
```

| Stage | Format | Example |
|-------|--------|---------|
| Input | {format} | `{example}` |
| Output | {format} | `{example}` |

---

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- FREE ZONE START - Add custom sections below using "## [Custom] 🎨 Title"-->
<!--                                                                         -->
<!-- Maximum 5, minimum 1 custom sections. This is YOUR space for thinking   -->
<!-- that doesn't fit standard templates. Be creative. Be honest. Be useful. -->
<!--                                                                         -->
<!-- 📐 STRUCTURAL EXAMPLES:                                                 -->
<!--   ## [Custom] 📊 Performance Benchmarks                                 -->
<!--   ## [Custom] 🔄 Migration Strategy                                     -->
<!--   ## [Custom] 🧪 A/B Testing Plan                                       -->
<!--   ## [Custom] 📈 Success Metrics                                        -->
<!--   ## [Custom] 🔐 Security Considerations                                -->
<!--                                                                         -->
<!-- 🧠 THINKING EXAMPLES (for complex decisions):                           -->
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
<!--   ## [Custom] 🎨 GUI mock-up — Ascii art for the looks and feel         -->
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

## 🔗 Integration Points

| Connects To | Direction | Data | Protocol |
|-------------|-----------|------|----------|
| `{capability/service}` | → OUT | {What is sent} | {REST/gRPC/File/Event} |
| `{capability/service}` | ← IN | {What is received} | {REST/gRPC/File/Event} |
| `{capability/service}` | ↔ BOTH | {Bidirectional data} | {Protocol} |

---

## 👥 User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| {User type} | {Action} | {Benefit} |
| {User type} | {Action} | {Benefit} |

---

## ✅ Acceptance Criteria

<!-- 
Detailed criteria for this feature to be considered complete.
-->

- [ ] {Criterion 1 — specific and testable}
- [ ] {Criterion 2 — specific and testable}
- [ ] {Criterion 3 — specific and testable}

---

## 🛠️ Technical Notes

### Constraints

- {Technical constraint 1}
- {Technical constraint 2}

### Considerations

- {Thing to think about during implementation}

---

## ⚠️ Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| {Edge case description} | {What should happen} |
| {Edge case description} | {What should happen} |

---

## ❌ Out of Scope

<!-- What this feature explicitly does NOT include. -->

- {Thing that's not part of this feature}
- {Thing deferred to a later phase}

---

## 🔗 Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| {Feature/Capability} | {Done/Pending} | {Notes} |

---

## 🖼️ Related Assets

<!-- 
Link to non-code artifacts (mockups, diagrams, storyboards) that support this feature.
Assets are stored in ../assets/ folder.
-->

| Asset | Type | Status | Description |
|-------|------|--------|-------------|
| [{Feature ID}_{description}.asset.md](../assets/{feature_id}_{description}.asset.md) | mockup/diagram/etc | 📐 Draft | {Brief description} |

---

## ❓ Open Questions

- {Question 1}
- {Question 2}

---

<!-- 
═══════════════════════════════════════════════════════════════════════════════
OPTIONAL SECTION: 🔬 Deep Dive

⚠️  DEEP DIVE vs FREE ZONE — KNOW THE DIFFERENCE:

    FREE ZONE is for CONCEPTUAL thinking:
    - Philosophical tensions, metaphors, assumptions
    - Strategic decisions, scope fences, future regrets
    - Things you'd explain in a meeting

    DEEP DIVE is for RIGOROUS TECHNICAL ARTIFACTS:
    - UML diagrams (class, sequence, state machine) in Mermaid
    - Mathematical proofs with complexity analysis (Big-O, LaTeX)
    - Benchmark tables with actual measured numbers
    - Weighted trade-off matrices with scoring formulas
    - Migration timelines (Gantt charts)
    - Data schema evolution (v1 → v2 → v3 with column maps)
    - Folder structure diagrams with file responsibilities
    - Dependency graphs showing capability relationships
    - Circuit breaker configurations, rollback strategies
    - Error propagation analysis with failure modes
    - Things you'd draw on a WHITEBOARD with precision

WHEN TO USE DEEP DIVE:
- Algorithm choices need Big-O analysis, benchmarks, or correctness proofs
- Architecture requires class diagrams showing ≥5 classes with relationships
- Migration needs phased timeline with rollback triggers
- Performance requires actual measured numbers, not estimates
- Multiple implementations compared with weighted scoring matrix
- State machines have ≥4 states with complex transitions
- API evolution spans ≥2 versions with schema changes

WHEN TO DELETE (use FREE ZONE or Technical Notes instead):
- Feature is straightforward with no algorithmic complexity
- A simple table or bullet list captures the tradeoffs
- No need for diagrams, proofs, or benchmarks
- Implementation path is obvious from Overview + Technical Notes

EXPECTED DEPTH: 60-280 lines per Deep Dive section
If your Deep Dive is <40 lines, it probably belongs in Technical Notes or FREE ZONE.

If you keep this section, remove these comments and fill in relevant subsections.
If you delete this section, also remove it from the FIXED SECTIONS comment at bottom.
═══════════════════════════════════════════════════════════════════════════════
-->

## 🔬 Deep Dive

<!-- 
═══════════════════════════════════════════════════════════════════════════════
This section is for RIGOROUS TECHNICAL ARTIFACTS that require precision.
These are NOT conceptual discussions — they are engineering documentation.

⚠️  CODE EXAMPLES WARNING ⚠️
════════════════════════════════════════════════════════════════════════════════
Code blocks in this section are CONCEPTUAL ILLUSTRATIONS, not implementation specs.

❌ DO NOT take code examples literally
❌ DO NOT copy-paste into production
❌ DO NOT assume exact function signatures, types, or patterns

✅ Use code blocks ONLY for:
   • Logic showcase: "The core idea is roughly: if X then Y"
   • Simple examples: Demonstrating a concept in 5-10 lines
   • API sketches: Showing intended developer experience (DX)

✅ Code should communicate INTENT, not IMPLEMENTATION

If you need precise specs, use:
   • API Contract section (with versioning)
   • OpenAPI/JSON Schema references
   • Link to actual source files
════════════════════════════════════════════════════════════════════════════════

🎯 LITMUS TEST: "Would this require a whiteboard with diagrams and numbers?"
   If yes → Deep Dive is warranted. If just discussion → use FREE ZONE.

⚠️  MINIMUM DEPTH: 60 lines. If you can express it in <40 lines, 
    it belongs in Technical Notes or FREE ZONE.

REFERENCE PATTERNS (no external sample files required):

  API CONTRACT + VALIDATION:
  • Request/response shapes, field rules, error envelope, compatibility notes
  • Useful for backend endpoints, BFF layers, or shared client contracts

  ASYNC STATE + UI FLOW:
  • Loading, success, error, retry, optimistic update, stale data handling
  • Useful for frontend screens, mutation flows, and job progress UX

  SERVICE / COMPONENT BOUNDARIES:
  • Responsibility split, ownership, dependency direction, extension seams
  • Useful for controller-service-repository or page-hook-client designs

  MIGRATION / ROLLOUT SAFETY:
  • Phases, rollback triggers, feature flags, compatibility windows
  • Useful for schema changes, background jobs, and incremental UI rewrites

  RESILIENCE / PERFORMANCE:
  • Retry policy, fallback path, caching, batching, pagination, back-pressure
  • Useful when latency, throughput, or partial failure shapes the design

Choose appropriate subsections below based on your feature's complexity.
═══════════════════════════════════════════════════════════════════════════════
-->

### Algorithm Choices

<!-- Compare approaches with O-notation, memory, accuracy tradeoffs -->

| Approach | Time | Space | Pros | Cons | Verdict |
|----------|------|-------|------|------|---------|
| {Option A} | O(?) | O(?) | {pros} | {cons} | ✅ Selected |
| {Option B} | O(?) | O(?) | {pros} | {cons} | ❌ Rejected |

### API Contract Draft

<!-- Public interface sketches, parameters, outputs, failure modes -->

```text
{operation_name}(
  {input_name}: {InputType},
  {optional_arg}: {OptionType}
) -> {OutputType}
```

### Sequence Diagram

<!-- Flow of control for primary use case -->

```mermaid
sequenceDiagram
    participant U as User
    participant F as This Feature
    participant D as Dependency
    
    U->>F: {action}
    F->>D: {call}
    D-->>F: {response}
    F-->>U: {result}
```

### Performance Tradeoffs

<!-- Conscious tradeoffs with rationale -->

| Tradeoff | We chose... | Because... | Risk |
|----------|-------------|------------|------|
| {Memory vs Speed} | {choice} | {rationale} | {what could go wrong} |

### Error Handling Strategy

<!-- Failure modes, detection, response, user impact -->

| Failure Mode | Detection | Response | User Impact |
|--------------|-----------|----------|-------------|
| {What can fail} | {How we detect it} | {What we do} | {What user sees} |

---

## ✅ Feature Validation Checklist

<!-- 
MANDATORY: Complete before handoff. Cannot proceed with unchecked items.
-->

### Narrative Completeness
- [ ] **The Story** section clearly states user problem and value
- [ ] **Intent** is unambiguous to a non-technical reader
- [ ] **Scope** is explicitly bounded (Out of Scope section filled)

### Technical Completeness  
- [ ] **Integration Points** table has all connections documented
- [ ] **Edge Cases** table covers failure scenarios
- [ ] **Dependencies** are listed with status
- [ ] **Acceptance Criteria** are testable (not vague)

### Linkage
- [ ] **Related capability specs** link back to this feature
- [ ] **Assets** are linked if mockups/diagrams exist

---

**Prev:** [Architecture](./02_architecture.md) | **Next:** [Next Feature](./NN_feature_{next}.md)

---

**← Back to:** [Index](./00_index.md)

<!--
FEATURE DOCUMENT NOTES:

NUMBERING: Use NN_ prefix (03, 04, 05...) to allow reordering.

WHEN TO CREATE:
- Feature description exceeds ~40 lines in executive summary
- Feature needs detailed user stories or edge cases
- Feature has complex acceptance criteria

FIXED SECTIONS (do NOT rename):
- 🎯 Overview, � Prior Art, �👥 User Stories, ✅ Acceptance Criteria (REQUIRED)
- 🗺️ System Context, 📊 Data Flow, 🔗 Integration Points (OPTIONAL)
- 🛠️ Technical Notes, ⚠️ Edge Cases, ❌ Out of Scope (OPTIONAL)
- 🔗 Dependencies, ❓ Open Questions, 🖼️ Related Assets (STANDARD)
- 🔬 Deep Dive (OPTIONAL - for complex features needing detailed design)

OPTIONAL SECTIONS (delete if not needed):
- System Context: Use when ≥3 capabilities or external integrations
- Data Flow: Use when data transformation is non-trivial
- Related Assets: Link to mockups, diagrams in ../assets/ folder
- Deep Dive: Use when algorithm/API/performance decisions need documentation
            (includes: Algorithm Choices, API Contract, Sequence Diagram,
             Performance Tradeoffs, Error Handling Strategy)

CUSTOM SECTIONS:
- Use "## [Custom] Your Title" prefix
- Place in FREE ZONE area
- Maximum 5 custom sections per document
- Examples: [Custom] Performance Benchmarks, [Custom] Migration Strategy

RELATED ASSETS:
- Store in ../assets/{feature_id}_{description}.asset.md
- Use asset.template.md as starting point
- Link from 🖼️ Related Assets section

EXECUTIVE SUMMARY REFERENCE:
| P0 | {Feature Name} | [KNOWN] | {Brief} |
→ [Details](./03_feature_{name}.md)
-->
