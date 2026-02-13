---
name: validate
description: Run architecture model validation and interpret results. Checks registry entries against diagrams, reports orphans and errors.
allowed-tools: Bash, Read, Glob
model: haiku
---

# Validate Architecture Model

Run the validation script and interpret results for the user.

## Workflow

1. Run: `python scripts/validate.py`
2. Parse the output
3. Summarize for the user:
   - Total elements in registry
   - Validation errors (elements in diagrams but not registered)
   - Orphan elements (registered but not in any diagram)
   - Domain maturity scores

## Response Format

```
**Validation Results**

| Metric | Count |
|--------|-------|
| Registry entries | X |
| Validation errors | X |
| Orphan elements | X |

**Errors (if any):**
[List each error with file location]

**Orphans by layer:**
[Group orphans by ArchiMate layer]

**Recommendations:**
[Suggest fixes for errors, note that orphans are expected for incomplete models]
```

## Notes

- Orphan elements are normal for incomplete models - don't alarm the user
- Validation errors are more serious - these indicate diagrams reference unregistered elements
- If user asks for JSON output, run: `python scripts/validate.py --format json`