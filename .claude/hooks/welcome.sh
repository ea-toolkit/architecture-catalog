#!/bin/bash
# SessionStart hook - shows available skills to new users

cat << 'EOF'
Architecture Catalog - Available Skills:

  /enterprise-platform-archi [question]  - Enterprise Platform domain Q&A
  /validate                              - Check model health
  /dashboard                             - Generate visual report
  /new-entry [type] [name]               - Create registry entry
  /scaffold-component [Name]             - Scaffold React component + test
  /deploy [--dry-run] [--target ...]     - Build & deploy to Firebase
  /crawl-apis <path> [--domain ...]      - Discover APIs → registry entries

Examples:
  /enterprise-platform-archi What data does Tenant Management own?
  /enterprise-platform-archi Create entry for Payment Gateway
  /validate
  /new-entry data-object "Payment Record"
  /scaffold-component CapabilityHeatmap

Type /skills to see all available skills.
EOF
exit 0
