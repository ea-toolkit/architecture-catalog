# Agent Templates for Architecture Catalog Users

These agent templates help you work with your architecture catalog using Claude Code. Copy them to your project's `.claude/agents/` directory and customize.

## Available Templates

| Template | Purpose | Model |
|----------|---------|-------|
| `domain-expert.md` | Q&A about a specific domain | sonnet |
| `registry-crawler.md` | Import architecture from existing docs | sonnet |
| `integration-mapper.md` | Discover missing connections between systems | sonnet |
| `health-advisor.md` | Find gaps and suggest what to document next | haiku |
| `domain-onboarding.md` | Guide full domain setup from scratch | sonnet |

## Quick Setup

1. Copy desired template(s) to your project's `.claude/agents/`
2. Replace placeholder markers (`[YOUR DOMAIN NAME]`, `[DOMAIN KEYWORDS]`, etc.)
3. Customize the search scope to match your registry structure
4. Start a Claude Code session — agents are auto-discovered

## Important Notes

- These templates dynamically read `models/registry-mapping.yaml` to discover layers and types — they don't hardcode paths
- Customize the domain keywords in the agent description for accurate auto-delegation
- Agent descriptions must be detailed enough for Claude to delegate correctly
- Read-only agents (domain-expert, integration-mapper) have minimal tools for safety
