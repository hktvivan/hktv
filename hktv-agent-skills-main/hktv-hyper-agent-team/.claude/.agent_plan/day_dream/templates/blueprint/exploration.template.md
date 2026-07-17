---
topic: "{Topic Name}"
status: ACTIVE
created: "{YYYY-MM-DD}"
expires: "{YYYY-MM-DD}"
synthesized_to: null
---

# 🔬 {Topic} Exploration

> Part of [{Project Name} Blueprint](./00_index.md)  
> **Expires:** {YYYY-MM-DD} *(created + 14 days)*

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

<!-- Analysis and recommendation below -->

---

## 🎯 Decision Context

**Question:** {What specific decision does this exploration answer?}

<!-- 
Be precise. Not "how should we build X" but "should we use approach A or B for X".
If you can't phrase it as a choice between options, this may not need an exploration.
-->

**Constraints:**
- {Hard constraint 1}
- {Hard constraint 2}

**Timeline:** {When must this decision be made?}

---

## 📋 Options Considered

### Option A: {Name}

**Description:** {1-2 sentences explaining this approach.}

| Pros | Cons |
|------|------|
| {Pro 1} | {Con 1} |
| {Pro 2} | {Con 2} |

**Difficulty:** `[KNOWN]` | `[EXPERIMENTAL]` | `[RESEARCH]`  
**Effort Estimate:** {Rough estimate if chosen}

---

### Option B: {Name}

**Description:** {1-2 sentences.}

| Pros | Cons |
|------|------|
| {Pro 1} | {Con 1} |
| {Pro 2} | {Con 2} |

**Difficulty:** `[KNOWN]` | `[EXPERIMENTAL]` | `[RESEARCH]`  
**Effort Estimate:** {Rough estimate}

---

## ⚖️ Evaluation Criteria

<!-- 
Weight: High (must have), Medium (important), Low (nice to have)
Score: ⭐ (poor), ⭐⭐ (adequate), ⭐⭐⭐ (good)
-->

| Criterion | Weight | Option A | Option B |
|-----------|--------|----------|----------|
| {e.g., Complexity} | High | ⭐⭐⭐ | ⭐⭐ |
| {e.g., Maintainability} | Medium | ⭐⭐ | ⭐⭐⭐ |
| {e.g., Performance} | Low | ⭐⭐ | ⭐⭐ |

---

## ✅ Recommendation

**Chosen Option:** {A | B | None — needs more research}

**Rationale:** {2-3 sentences explaining why.}

**Unresolved Risks:**
- {Risk 1}
- {Risk 2}

---

## 🔄 Synthesis Notes

<!-- 
Fill when integrating insights into vision/architecture.
Then change status to SYNTHESIZED.
-->

- **Integrated to:** `{document}#{section-anchor}`
- **Key points carried over:**
  - {Point 1}
  - {Point 2}
- **Deferred to implementation:**
  - {Detail 1}

---

## 📎 Appendix: Research Notes

### Links
- {URL 1}: {Why relevant}

### Code Snippets
```text
# Example if testing something
```

### Rejected Alternatives
- {Alternative X}: {Why rejected}

---

**← Back to:** [Index](./00_index.md)

<!--
EXPLORATION DOCUMENT RULES:

WHEN TO CREATE:
- Choosing between 2+ architectural approaches
- Evaluating external API/library options  
- Complex algorithm design

WHEN NOT TO CREATE:
- Standard CRUD features → just write in vision
- Implementation details → HyperArch's domain
- "Understanding X" → that's learning, not planning

STATUS LIFECYCLE:
ACTIVE → SYNTHESIZED → archive to _archive/
       → ABANDONED → keep with status marked
       → EXPIRED → needs decision after 14 days
-->
