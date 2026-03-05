#!/bin/bash
# PostToolUse hook — warns if a catalog-ui component lacks a test file
# Non-blocking (exit 0) — just a reminder, not a gate

FILE_PATH=$(echo "$TOOL_INPUT" | jq -r '.file_path // empty' 2>/dev/null)

# Only check catalog-ui source files (not test files themselves)
if [[ "$FILE_PATH" == *"catalog-ui/src/"* ]] && \
   [[ "$FILE_PATH" == *.tsx ]] && \
   [[ "$FILE_PATH" != *.test.tsx ]] && \
   [[ "$FILE_PATH" != *.spec.tsx ]]; then

  TEST_FILE="${FILE_PATH%.tsx}.test.tsx"

  if [ ! -f "$TEST_FILE" ]; then
    echo "WARNING: No test file found for $(basename "$FILE_PATH")"
    echo "Expected: $(basename "$TEST_FILE")"
  fi
fi

exit 0
