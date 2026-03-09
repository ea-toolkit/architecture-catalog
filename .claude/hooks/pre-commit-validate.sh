#!/bin/bash
# PreToolUse hook — runs model validation before git commits only
# Matches on all Bash calls, but only acts on git commit commands

INPUT=$(cat /dev/stdin 2>/dev/null)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Only run for git commit commands
if [[ "$COMMAND" == *"git commit"* ]]; then
  RESULT=$(python scripts/validate.py 2>&1 | tail -5)
  if echo "$RESULT" | grep -q "FAILED"; then
    echo "VALIDATION FAILED — review errors before committing:"
    echo "$RESULT"
    exit 2  # Block the commit
  fi
fi

exit 0
