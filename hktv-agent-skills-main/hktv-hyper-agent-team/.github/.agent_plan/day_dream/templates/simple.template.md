# 🎯 {Project Name}

> *{One emotional hook sentence — why this matters}*

**Version:** 1.0 | **Status:** 📐 Draft | ✅ Ready | 🔒 Frozen

---

## 📍 What's Here

| Section | Purpose |
|---------|---------|
| [Quick Start](#-quick-start) | Get running in 5 minutes |
| [API Reference](#-api-reference) | Core functions and usage |
| [Edge Cases](#-edge-cases) | Gotchas and known limitations |
| [Upgrade Criteria](#-when-to-upgrade) | When this doc isn't enough |

---

## 🚀 Quick Start

### The 30-Second Version

```text
{entry_point}({input})
→ {expected_result}
```

### Step-by-Step Setup

1. **Install dependencies:**
   ```bash
   {project-native install command}
   ```

2. **Configure (if needed):**
   ```text
   {configuration step or "N/A"}
   ```

3. **Run:**
   ```bash
   {command to run}
   ```

### Verify It Works

| Action | Expected Result |
|--------|-----------------|
| `{test command}` | `{expected output}` |

---

## 📚 API Reference

### `{main_function}()`

**Purpose:** {One sentence description}

**Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `{param1}` | `{type}` | `{default}` | {description} |
| `{param2}` | `{type}` | Required | {description} |

**Returns:** `{return_type}` — {description}

**Example:**
```text
{main_function}({param1}, {param2})
→ {result}
```

---

### `{helper_function}()`

**Purpose:** {One sentence}

**Parameters:** See pattern above

**Returns:** `{type}`

---

## ⚠️ Edge Cases

<!-- OPTIONAL: Remove this section if no edge cases exist -->

| Scenario | Behavior | Workaround |
|----------|----------|------------|
| Empty input | Returns `None` | Check before calling |
| {edge case 2} | {what happens} | {how to handle} |

---

## 📈 When to Upgrade

**This simple doc works when:**
- ✅ Single responsibility (one clear purpose)
- ✅ ≤3 public functions
- ✅ No complex state management
- ✅ No multi-capability coordination

**Upgrade to Blueprint when:**
- ❌ You're adding 4+ features
- ❌ Cross-capability data flows emerge
- ❌ External API integrations multiply
- ❌ Multiple user types with different interfaces
- ❌ Async/background processing needed

### Auto-Detection Rules (Machine-Readable)

```yaml
upgrade_triggers:
  features_count: ">= 4"
   custom_capabilities: ">= 3"
  external_apis: ">= 2"
  has_async: true
  multi_user_types: true
```

---

## 🔧 Config Options

<!-- OPTIONAL: Remove if no configuration -->

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `{option}` | `{type}` | `{default}` | {what it does} |

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | {YYYY-MM-DD} | Initial release |

---

<!--
SIMPLE TEMPLATE RULES:

PURPOSE: For small utilities, single-purpose capabilities, quick documentation

STRUCTURE: Hook → Map → Staged Reveal
- Hook: Emotional one-liner in blockquote
- Map: "What's Here" table for navigation
- Staged Reveal: Quick Start (fast) → API (deeper) → Edge Cases (complete)

CONSTRAINTS:
- Max 150 lines (excluding comments)
- Max 3 main functions documented
- No architecture diagrams (that's blueprint territory)

WHEN TO USE:
- Small focused workspace areas
- Simple single-purpose capabilities
- Quick documentation for existing code
-->
