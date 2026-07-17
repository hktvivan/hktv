---
applyTo: "**/*.agent.md,**/*.prompt.md,**/*.instructions.md"
---

# Terminal Commands Execution Guidelines

## Goals
- Keep terminal execution reproducible across different stacks and operating systems.
- Ensure agents use repository-local tooling instead of relying on ambient global installs.
- Standardize how agents discover and run workspace commands.

## Rules

### 1. **Discover the Local Toolchain First**
Before running commands, inspect the workspace for the project's native entry points: task files, package manifests, lock files, wrappers, local binaries, and documented commands.

Preferred order:
1. Repository task runner or documented script
2. Workspace-local executable or wrapper
3. Ecosystem-native command runner
4. Global executable only as a last resort

### 2. **Prefer Repository-Local Commands**
Examples of acceptable local command patterns:

```bash
npm run test
pnpm exec vitest
cargo test
dotnet test
uv run pytest
./scripts/check.sh
```

### 3. **Honor Declared Environments**
If the repository declares an environment manager or wrapper, use it instead of improvising. Examples include local virtual environments, version managers, package-runner prefixes, or checked-in scripts.

### 4. **Use Workspace-Appropriate Shell Syntax**
- Match the active shell and operating system.
- Prefer PowerShell-friendly syntax on Windows.
- Avoid assuming POSIX-only activation commands unless the workspace clearly targets that environment.

### 5. **Examples**

**CORRECT**
```bash
npm run build
pnpm exec eslint src
uv run pytest tests/
.\tools\sync
./scripts/verify.sh
```

**INCORRECT**
```bash
direct-runtime some_script  # when the repo documents a wrapper instead
pytest                 # when dependencies are only available through a managed environment
global-tool build      # when a checked-in task or local binary exists
```

## Critical Notes
- NEVER assume one language or toolchain is the default for every workspace.
- If setup is missing or ambiguous, inspect documentation before installing or creating anything.
- Prefer commands that are reproducible for another developer on the same repository.
