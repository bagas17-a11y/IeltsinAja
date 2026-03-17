#!/bin/bash
# ==============================================================================
# test-loop.sh — Auto-run test loop
# Runs TypeScript check → ESLint → Vitest in a loop until ALL pass.
# Usage:
#   bash scripts/test-loop.sh             # loop indefinitely
#   MAX_ATTEMPTS=10 bash scripts/test-loop.sh  # stop after N attempts
# ==============================================================================
set -uo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

MAX_ATTEMPTS="${MAX_ATTEMPTS:-0}"  # 0 = unlimited
ATTEMPT=0
PASS=0

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          IeltsinAja — Test Loop Runner           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

run_step() {
  local name="$1"
  local cmd="$2"
  echo -e "${CYAN}  → ${name}${NC}"
  if eval "$cmd" 2>&1; then
    echo -e "${GREEN}    ✓ ${name} passed${NC}"
    return 0
  else
    echo -e "${RED}    ✗ ${name} FAILED${NC}"
    return 1
  fi
}

while true; do
  ATTEMPT=$((ATTEMPT + 1))
  PASS=0

  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}  Attempt #${ATTEMPT}$([ "$MAX_ATTEMPTS" -gt 0 ] && echo " / ${MAX_ATTEMPTS}")${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""

  STEP_FAIL=0

  # Step 1: TypeScript type check
  run_step "TypeScript (tsc --noEmit)" "npx tsc --noEmit" || STEP_FAIL=1

  # Step 2: ESLint — only fail on errors (exit code 1), not warnings (exit code 0)
  run_step "ESLint (no errors)" "npm run lint -- --max-warnings=9999" || STEP_FAIL=1

  # Step 3: Vitest unit tests
  run_step "Unit Tests (vitest)" "npx vitest run --reporter=verbose" || STEP_FAIL=1

  echo ""

  if [ "$STEP_FAIL" -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       ✓ ALL CHECKS PASSED (attempt #${ATTEMPT})        ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
    exit 0
  fi

  # Check max attempts
  if [ "$MAX_ATTEMPTS" -gt 0 ] && [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
    echo -e "${RED}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ✗ Max attempts (${MAX_ATTEMPTS}) reached — some checks FAILED  ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════╝${NC}"
    exit 1
  fi

  echo -e "${YELLOW}  Some checks failed. Fix the errors above and re-run, or${NC}"
  echo -e "${YELLOW}  press Ctrl+C to stop. Retrying in 3s...${NC}"
  echo ""
  sleep 3
done
