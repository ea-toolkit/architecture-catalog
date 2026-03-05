---
globs: registry-v2/**
---

# Registry Entry Format

- **File naming:** kebab-case (payment-gateway.md). One element per file.
- **_template.md** files define the frontmatter schema for each type. Read them before creating entries.
- **Frontmatter:** YAML between `---` delimiters. All fields from the template must be present. Use TBD for unknown values.
- **Relationships:** Lists of element IDs (kebab-case). Bidirectional: if A references B, B should reference A.
- **Optional alignment fields** (archimate_type, ddd_type, togaf_type, etc.) are documentation only — the UI never reads them.
- **Markdown body:** Brief description. Optional sections: responsibilities, dependencies, notes. Keep concise.
- **Layer/folder discovery:** Read `models/registry-mapping.yaml` for valid types and their folders. Never hardcode paths.
