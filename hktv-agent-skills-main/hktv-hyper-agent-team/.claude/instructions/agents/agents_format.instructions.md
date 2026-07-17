---
applyTo: "**/*.agent.md"
---

# Agent Definition Authoring Guidelines

## Goals
- Create specialized AI personas with distinct roles, boundaries, and handoff points.
- Keep agent definitions portable across repositories, stacks, and delivery models.
- Standardize `.agent.md` files so they run as native Claude Code subagents from the user's Claude agent directory.
- Do not repeat the same rule in `<stopping_rules>`, `<core_philosophy>`, and `<critical_rules>`; place it in the most appropriate section only.

## Required Section Order
Each agent definition file MUST include sections in this logical flow:
1) **YAML Header**: Native Claude Code frontmatter.
2) **Role Definition**: A clear statement of who the agent is.
3) **Directives**: High-level goals and scope.
4) **Stopping Rules**: Hard halt conditions.
5) **Core Philosophy**: Values and decision principles.
6) **Workflow**: Step-by-step execution flow.
7) **Project Context**: Files or instructions to read when relevant.
8) **Critical Rules**: Persistent operating constraints.

## Claude Code Frontmatter Rules
- `name` MUST be lowercase kebab-case and globally unique in `agents/` relative to the agent pack root, e.g. `hyper-orch`.
- `description` MUST state when to use the agent. Include "Use proactively..." only when automatic delegation is desired.
- `tools` MUST be explicit. Omitted `tools` means inherited broad access and is not acceptable for this pack.
- Only coordinator agents that run as the main session may include `Agent(...)` in `tools`. Subagents cannot spawn other subagents.
- Declare required MCP access with `mcpServers:` when the agent depends on MCP or plugin tools. Use configured server names for the user's Claude environment.
- Use `skills:` only for skills that must be preloaded into the agent context.
- Use `isolation: worktree` for agents expected to edit files in parallel.
- Use `permissionMode:` intentionally; never default to broad write behavior by accident.

## Runtime And Pack Locations
- Runtime Claude agent files live in `agents/` relative to the agent pack root.
- Harness support files in this repository live under `hktv-hyper-agent-team/.claude/`.
- Do not write new runtime agents into this repository unless the user explicitly asks for a staged pack edit instead of a live Claude agent edit.
- `.agent_plan/` contains planning, expedition, discussion, red-team, and day-dream artifacts. It is not part of runtime agent loading.

## Delegation Rules
- If an agent needs another specialist while running as a subagent, it MUST report a `handoff_needed` summary instead of trying to spawn that specialist.
- `HyperOrch` owns multi-agent sequencing, parallel fan-out, and synthesis unless the user explicitly starts an agent team or workflow.
- Agent teams and dynamic workflows are separate Claude Code surfaces. Mention them as operator choices, not as behavior a normal subagent can silently create.
- Agent view is for independent background sessions. Do not confuse it with in-session subagent delegation.

## Template
Copy and adapt this template for any new agent file.

```markdown
---
name: <agent-name>
description: <When Claude should use this agent>
tools: Read, Glob, Grep
model: inherit
# mcpServers:
#   - <server-name>
---

You are the **<AgentName>**, a specialized <Role Description>.

Your SOLE directive is to <Main Goal>.

## Stopping Rules (HARD CONSTRAINTS)
STOP IMMEDIATELY if <Condition 1>.
STOP if <Condition 2>.

## Core Philosophy
1. **<Principle 1>**: <Description>
2. **<Principle 2>**: <Description>

## Workflow
### 0. **SELF-IDENTIFICATION**
Before starting any task, say out loud: "I am NOW the <agent_name> agent, <Role Description>." to distinguish yourself from other agents in the chat session history.

### 1. <Step 1>
- <Action>
- <Check>

### 2. <Step 2>
...

## Project Context
If needed, read `instructions/framework/workspace_context.instructions.md` before proceeding.

## Critical Rules
- **<Rule 1>**: <Description>
- **<Rule 2>**: <Description>
```
