# Workspace Context

## Why This Skill Pack Exists
AI agents lose effectiveness when rules, ownership, and validation are implicit. This skill pack keeps them effective by making operating context explicit:
- **Small Working Scope**: Agents should load only the files and rules they need.
- **Portable Structure**: Guidance should survive across repositories, languages, and architectures.
- **Instruction-Native Context**: `.instructions.md` files teach agents how to work inside a workspace, not just what to edit.

## Core Philosophy
1. **Read Before Write**: NEVER guess. Inspect the relevant source, docs, or configuration first.
2. **Reuse Before Invent**: Prefer existing patterns, utilities, and workflows over new abstractions.
3. **Respect Local Conventions**: Match the repository's naming, layout, and tooling instead of imposing a house style.
4. **Keep Scope Explicit**: Work on the smallest slice that achieves the goal safely.
5. **Validate Deliberately**: Run the cheapest reliable check that can disconfirm your current assumption.

## Workspace Landmarks
- `agents/`: Agent definitions and handoff boundaries.
- `instructions/`: Reusable rules, presets, and authoring guidance.
- `prompts/`: Reusable task templates.
- `tests/`: Formal validation assets.
- `playground/`: Exploratory scripts, demos, and prototypes.
- `.temp_agent_work/`: Scratch space for disposable artifacts. Never commit it.
- `.agent_plan/`: Planning, discussion, and red-team artifacts.
- `apps/`, `packages/`, `services/`, `libs/`, `docs/`: Common workspace shapes. Observe the real layout before assuming any of them exist.

## Artifact Categories

| Category | Typical Contents | Guidance |
|----------|------------------|----------|
| Code | Apps, services, packages, libraries | Follow local implementation patterns |
| Docs | READMEs, prompts, instructions, design notes | Keep intent and usage explicit |
| Assets | Templates, diagrams, mockups | Prefer lightweight, editable formats |
| Automation | Scripts, tasks, pipelines, configs | Use project-native entry points |

## Environment Awareness
- Do not assume a programming language, package manager, or test runner.
- Prefer repository-local commands, wrappers, and tasks over global tools.
- Keep destructive operations explicit and reversible where possible.
- Use `.temp_agent_work/` for temporary files and clean it after use.

## Context Distribution
- Core agent behavior lives in `agents/`, `instructions/`, and `prompts/`.
- Export or sync destinations are workspace-specific; adapt to the target repository rather than hardcoding one layout.
- Planning artifacts belong in `.agent_plan/`, not in product source trees unless the repository explicitly wants that.
