#!/bin/bash
# SessionStart hook - shows available skills to new users

cat << 'EOF'
Architecture Catalog - Available Skills:

  /example-archi [question]    - Example domain questions & actions
  /validate                    - Check model health
  /dashboard                   - Generate visual report
  /new-entry [type] [name]     - Create registry entry

Examples:
  /example-archi What data does Tenant Management own?
  /example-archi Create entry for Payment Gateway
  /validate
  /new-entry data-object "Payment Record"

Type /skills to see all available skills.
EOF
exit 0