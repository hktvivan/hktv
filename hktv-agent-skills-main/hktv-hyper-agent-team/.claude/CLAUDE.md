# Hyper Agent Chain — Mandatory Workflow

## Rule: Always Use Agent Chain

When handling complex tasks, **MUST** use the Hyper Agent Chain workflow. Do NOT attempt to solve complex problems directly — delegate to specialized agents.

---

## Agent Chain Flow

### Entry Points

| Task Type | Entry Agent |
|-----------|-------------|
| Complex multi-step tasks | **HyperOrch** |
| Long-term planning / vision | **HyperDream** |
| Implementation work | **HyperArch** |
| Code quality checks | **HyperIQGuard** |
| Adversarial testing | **HyperRed** |
| Code review / QA | **HyperSan** |
| Create new agents/instructions | **HyperAgentSmith** |
| Export / adapt to external projects | **HyperExped** |

---

## Agent Handoff Rules

### HyperOrch (Orchestrator)
- **Can hand off to:** HyperArch, HyperSan
- **Role:** Coordinate multi-agent workflows
- **Use when:** Task requires orchestration across multiple agents

### HyperDream (Visionary)
- **Can hand off to:** HyperSan
- **Role:** Long-term planning and conceptualization
- **Use when:** Need to explore future possibilities, document visions

### HyperArch (Implementer)
- **Can hand off to:** HyperSan, HyperIQGuard
- **Role:** Implement features, fix bugs, modify code
- **Use when:** Need actual code implementation

### HyperIQGuard (Quality Guardian)
- **Can hand off to:** HyperArch
- **Role:** Pragmatic fixes, anti-patterns, code quality
- **Use when:** Need to identify/fix objectively poor coding practices

### HyperRed (Adversarial Tester)
- **Can hand off to:** HyperArch, HyperSan
- **Role:** Find edge cases, break assumptions, adversarial testing
- **Use when:** Need to attack code to make it stronger

### HyperSan (Reviewer/QA)
- **Can hand off to:** HyperArch, HyperSan (self-loop for iterative review)
- **Role:** Validate logic, feasibility, alignment
- **Use when:** Need code review, QA validation

### HyperAgentSmith (Instruction Architect)
- **No handoffs** — standalone
- **Role:** Create agents, prompts, instructions, templates
- **Use when:** Need to create new skill packs or agent definitions

### HyperExped (Adaptation Specialist)
- **Can hand off to:** HyperSan, HyperDream, HyperAgentSmith
- **Role:** Export and adapt agent packs to external projects
- **Use when:** Need to port skills to other repos/projects

---

## Mandatory Flow Patterns

### Feature Implementation
```
HyperOrch → HyperArch → HyperSan → HyperIQGuard → HyperArch (fix) → HyperSan (verify)
```

### Bug Investigation
```
HyperOrch → HyperRed (find) → HyperArch (fix) → HyperSan (verify)
```

### Code Review
```
HyperSan → HyperIQGuard → HyperArch (fix) → HyperSan (verify)
```

### Long-term Planning
```
HyperDream → HyperSan
```

### Create New Agent
```
HyperAgentSmith → HyperSan (validate)
```

### Export to External Project
```
HyperExped → HyperDream (vision) → HyperAgentSmith (create) → HyperSan (validate)
```

---

## Enforcement

1. **Always start with the appropriate entry agent** based on task type
2. **Follow handoff chains** — do not skip agents in the chain
3. **HyperSan is the final validator** — most flows end with HyperSan verification
4. **Document handoffs** — when handing off, explain what was done and what's needed next
5. **Self-loops allowed** — HyperSan can review its own findings iteratively

---

## Agent Invocation Format

Use the Agent tool with subagent_type parameter:

```
Agent({
  description: "Short task description",
  prompt: "Detailed instructions...",
  subagent_type: "HyperArch"  // or HyperSan, HyperRed, etc.
})
```

---

## Quick Reference

| Need | Use |
|------|-----|
| Coordinate complex task | HyperOrch |
| Implement code | HyperArch |
| Review code | HyperSan |
| Find bugs/edge cases | HyperRed |
| Fix quality issues | HyperIQGuard |
| Plan long-term | HyperDream |
| Create agents/instructions | HyperAgentSmith |
| Export to other projects | HyperExped |
