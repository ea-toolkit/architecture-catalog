# Skill Framework for Architecture Catalog

A comprehensive design for skills, sub-agents, and hooks in the architecture catalog repo.

## Design Principles

1. **Explicit > Implicit** - Users invoke `/<domain>-archi` rather than hoping Claude auto-delegates
2. **Skills + Sub-agents** - Skills for explicit invocation, sub-agents for obvious cases
3. **Hooks for automation** - Quality gates and onboarding, not decision-making
4. **Domain-first naming** - `/<domain>-archi` pattern is learnable across teams
5. **Scoped search** - Each domain skill searches its own files first to minimize token usage

---

## Implemented Structure

```
.claude/
  skills/
    example-archi/
      SKILL.md              # /example-archi - explicit domain invocation
    validate/
      SKILL.md              # /validate - run validation
    dashboard/
      SKILL.md              # /dashboard - generate dashboard
    new-entry/
      SKILL.md              # /new-entry - create registry entry

  agents/
    example-domain.md       # Auto-delegation for obvious domain questions

  hooks/
    welcome.sh              # SessionStart - show available skills

  settings.json             # Hook configuration
```

---

## 1. Skills (User-Facing Entry Points)

### Domain Architect Skill

| Skill | Invocation | Purpose |
|-------|------------|---------|
| Example Archi | `/example-archi [question]` | Q&A, create entries, proposals for example domain |

**Usage Examples:**
```
/example-archi What data does Tenant Management own?
/example-archi Create a registry entry for Payment Gateway
/example-archi Which components are make vs buy?
/example-archi Validate the model
```

**Key Features:**
- Runs in isolated forked context (`context: fork`)
- Searches domain files first (primary scope)
- Only expands to other domains if needed (secondary scope)
- Intent classification: Q&A, CREATE, UPDATE, VALIDATE, DASHBOARD, SOLUTION PROPOSAL
- Always cites sources with file paths
- Admits gaps honestly when info not in repo

### Utility Skills

| Skill | Invocation | Purpose |
|-------|------------|---------|
| Validate | `/validate` | Run validation, explain errors |
| Dashboard | `/dashboard` | Generate HTML dashboard |
| New Entry | `/new-entry [type] [name]` | Guided registry entry creation |

**Usage Examples:**
```
/validate
/dashboard
/new-entry data-entity "Payment Record"
/new-entry logical-component "Notification Management"
```

---

## 2. Sub-Agent (Auto-Delegation)

| Agent | Auto-Triggers On |
|-------|------------------|
| example-domain | Tenant, Subscription, Billing, Analytics, CRM, NovaCRM, Contact, Invoice |

**When Sub-Agent Kicks In:**
```
User: "What is the Billing Engine used for?"
Claude: [Detects "Billing" → auto-delegates to example-domain agent]
```

**When Skill is Better:**
```
User: "What is Tenant Management?"
Claude: [Ambiguous - might not auto-delegate]
User: "/example-archi What is Tenant Management?"
Claude: [Explicitly uses domain skill - guaranteed]
```

---

## 3. Hook (Onboarding)

| Hook Event | Action | Purpose |
|------------|--------|---------|
| SessionStart | welcome.sh | Show available skills to new users |

**Output on session start:**
```
Architecture Catalog - Available Skills:

  /example-archi [question]    - Example domain questions & actions
  /validate                    - Check model health
  /dashboard                   - Generate visual report
  /new-entry [type] [name]     - Create registry entry
```

---

## 4. Search Scope Strategy

Each domain skill searches in priority order to minimize token usage:

### Primary Scope (Search FIRST)
```
views/<domain>/**                           # Domain diagrams
registry-v2/3-applications-and-data/**/*.md # Registry entries
```

### Secondary Scope (Search ONLY if not found)
```
models/registry-mapping.yaml         # Schema mapping
registry-v2/**/*.md (other layers)   # Cross-layer elements
```

This prevents the AI from searching the entire repo unnecessarily.

---

## 5. Adding New Domains

To add a new domain (e.g., payments):

1. **Create domain skill:**
   ```
   .claude/skills/payments-archi/SKILL.md
   ```
   Copy from example-archi, update:
   - name: payments-archi
   - description: mention Payments keywords
   - Primary scope paths
   - Domain knowledge section

2. **Create domain sub-agent:**
   ```
   .claude/agents/payments.md
   ```
   Copy from example-domain.md, update:
   - name: payments
   - description: mention Payments keywords
   - Key files reference

3. **Create views folder:**
   ```
   views/payments/
   ```

4. **Create registry entries** in `registry-v2/3-applications-and-data/`

5. **Update welcome hook** to show new skill

---

## 6. Success Criteria

| Scenario | Expected Behavior |
|----------|-------------------|
| `/example-archi What is Tenant Management?` | Returns answer with citations from registry files |
| `/example-archi Create entry for X` | Creates file, shows frontmatter, runs validation |
| `/validate` | Runs script, interprets output, shows errors/orphans |
| `/dashboard` | Generates HTML, summarizes metrics |
| `/new-entry data-entity "Payment Record"` | Creates file in correct folder with template |
| User mentions "Billing" without skill | example-domain agent auto-delegates |
| New user starts session | Sees welcome message with available skills |
| Question not in repo | Admits: "This information is not in the architecture model" |

---

## 7. Future Enhancements

### Phase 2: Quality Hooks
- PreToolUse hook to validate YAML frontmatter before writing registry files
- PostToolUse hook to suggest extraction after diagram changes

### Phase 3: Additional Domains
- `/<your-domain>-archi` skill + sub-agent for each domain you model

### Phase 4: Advanced Skills
- `/refresh` - Sync registry metadata to diagrams
- `/extract [file]` - Extract YAML from diagram
- `/help` - List all available skills with descriptions
