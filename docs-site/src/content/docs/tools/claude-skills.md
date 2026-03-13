---
title: Claude Skills
description: AI-assisted architecture management with Claude Code.
---

The project includes [Claude Code](https://claude.com/claude-code) skills (slash commands) for AI-assisted architecture work.

## Available skills

| Skill | Usage | Purpose |
|-------|-------|---------|
| `/enterprise-platform-archi` | `/enterprise-platform-archi [question]` | Enterprise Platform domain Q&A, create entries, proposals |
| `/validate` | `/validate` | Run model validation, show errors and orphans |
| `/dashboard` | `/dashboard` | Generate HTML health dashboard |
| `/new-entry` | `/new-entry [type] [name]` | Create registry entry (guided wizard) |
| `/scaffold-component` | `/scaffold-component [Name]` | Scaffold React component + test file |

## Examples

```
/enterprise-platform-archi What data does Tenant Management own?
/enterprise-platform-archi Create a registry entry for Payment Gateway
/validate
/dashboard
/new-entry data-object "Payment Record"
/scaffold-component CapabilityHeatmap
```

## Specialized agents

The project also includes auto-delegating agents that Claude Code uses when appropriate:

| Agent | Scope | Purpose |
|-------|-------|---------|
| `domain-expert` | Read-only | Domain Q&A — answers questions about specific domains |
| `fe-developer` | Read/Write `catalog-ui/` | Frontend development tasks |
| `registry-agent` | Read/Write `registry-v2/`, `views/` | Registry data creation and validation |
| `test-writer` | Read/Write test files | Test creation (Vitest + pytest) |

## How skills work

Each skill is defined in `.claude/skills/<name>/SKILL.md`. When invoked, the skill:

1. Loads its prompt template
2. Searches the relevant registry files for context
3. Provides domain-scoped answers or performs actions

## Adding skills for your domains

The pattern is `/<domain>-archi`. To add a new domain skill:

1. Create `.claude/skills/<domain>-archi/SKILL.md`
2. Follow the template from the existing `enterprise-platform-archi` skill
3. Scope the search to your domain's registry files

This gives each domain team a dedicated AI assistant that knows their architecture.
