#!/bin/bash
set -euo pipefail

# ==============================================================================
# AUTO_RUN.SH - Safe Command Runner with Allowlist
# ==============================================================================
# A non-interactive command executor with safety guards for development tasks.
# Only runs pre-approved commands from an explicit allowlist.
#
# Usage:
#   ./scripts/auto_run.sh                    # Run default task sequence
#   ./scripts/auto_run.sh custom             # Run custom command file
#   DRY_RUN=1 ./scripts/auto_run.sh          # Show commands without executing
#   VERBOSE=1 ./scripts/auto_run.sh          # Show detailed output
# ==============================================================================

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/auto_run.log"
DRY_RUN="${DRY_RUN:-0}"
VERBOSE="${VERBOSE:-0}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# ==============================================================================
# ALLOWLIST: Only these command patterns are permitted
# ==============================================================================
ALLOWLIST=(
  # Git commands (safe read operations + basic commits)
  "git status"
  "git diff"
  "git log"
  "git branch"
  "git add ."
  "git add *"
  "git commit -m *"
  "git push"
  "git pull"

  # Node/npm/bun package management
  "npm install"
  "npm ci"
  "npm update"
  "npm run *"
  "bun install"
  "bun update"
  "bun run *"
  "pnpm install"
  "pnpm update"
  "pnpm run *"

  # Common dev tasks
  "npm test"
  "npm run test"
  "npm run lint"
  "npm run build"
  "npm run dev"
  "bun test"
  "bun run test"
  "bun run lint"
  "bun run build"
  "bun run dev"

  # Supabase CLI (safe operations)
  "supabase status"
  "supabase functions list"
  "supabase db diff"
  "supabase secrets list"

  # Supabase deployment (with proper auth)
  "export SUPABASE_ACCESS_TOKEN=* && yes | supabase db push"
  "export SUPABASE_ACCESS_TOKEN=* && supabase functions deploy *"
  "export SUPABASE_ACCESS_TOKEN=* && supabase secrets set *"
  "supabase db push"
  "supabase functions deploy *"
  "supabase secrets set *"

  # Python testing (if needed)
  "python -m pytest"
  "python -m unittest"
  "pytest"

  # TypeScript/ESLint
  "tsc --noEmit"
  "eslint ."
  "eslint --fix ."

  # File inspection (safe read-only)
  "ls *"
  "cat *"
  "head *"
  "tail *"
  "grep *"

  # Echo statements (always safe)
  "echo *"
)

# ==============================================================================
# DANGEROUS PATTERNS: Commands containing these are BLOCKED
# ==============================================================================
DANGEROUS_PATTERNS=(
  "rm -rf"
  "rm -f"
  "sudo"
  "chmod 777"
  "chmod -R 777"
  "> /etc"
  "curl * | bash"
  "wget * | sh"
  "curl * | sh"
  "eval"
  "exec"
  "/dev/null"
  "mkfs"
  "dd if="
  "> /dev"
  "fork()"
  ":(){ :|:& };:"
  "shutdown"
  "reboot"
  "init 0"
  "init 6"
)

# ==============================================================================
# FUNCTIONS
# ==============================================================================

log() {
  local level="$1"
  shift
  local message="$*"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

print_header() {
  echo -e "${BLUE}===================================================${NC}"
  echo -e "${BLUE}  AUTO_RUN - Safe Command Executor${NC}"
  echo -e "${BLUE}===================================================${NC}"
  if [[ "$DRY_RUN" == "1" ]]; then
    echo -e "${YELLOW}  MODE: DRY RUN (no commands will execute)${NC}"
  fi
  echo -e "${BLUE}  Log: $LOG_FILE${NC}"
  echo -e "${BLUE}===================================================${NC}"
  echo ""
}

# Check if command matches allowlist pattern
is_allowed() {
  local cmd="$1"
  local allowed=0

  for pattern in "${ALLOWLIST[@]}"; do
    # Convert shell glob pattern to regex
    local regex_pattern="${pattern//\*/.*}"
    if [[ "$cmd" =~ ^${regex_pattern}$ ]]; then
      allowed=1
      break
    fi
  done

  echo "$allowed"
}

# Check if command contains dangerous patterns
is_dangerous() {
  local cmd="$1"

  for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if [[ "$cmd" == *"$pattern"* ]]; then
      return 0  # Is dangerous
    fi
  done

  return 1  # Not dangerous
}

# Validate and execute a single command
run_command() {
  local cmd="$1"

  # Skip empty lines and comments
  if [[ -z "$cmd" ]] || [[ "$cmd" =~ ^[[:space:]]*# ]]; then
    return 0
  fi

  echo -e "${BLUE}→ Command: ${NC}$cmd"

  # Check for dangerous patterns first
  if is_dangerous "$cmd"; then
    echo -e "${RED}✗ BLOCKED: Command contains dangerous pattern${NC}"
    log "ERROR" "BLOCKED dangerous command: $cmd"
    return 1
  fi

  # Check allowlist
  local allowed=$(is_allowed "$cmd")
  if [[ "$allowed" == "0" ]]; then
    echo -e "${RED}✗ BLOCKED: Command not in allowlist${NC}"
    echo -e "${YELLOW}  To allow this command, add it to ALLOWLIST in auto_run.sh${NC}"
    log "ERROR" "BLOCKED non-allowlisted command: $cmd"
    return 1
  fi

  # Execute or dry-run
  if [[ "$DRY_RUN" == "1" ]]; then
    echo -e "${YELLOW}  [DRY RUN] Would execute: $cmd${NC}"
    log "INFO" "[DRY RUN] $cmd"
  else
    echo -e "${GREEN}  ✓ Executing...${NC}"
    log "INFO" "Executing: $cmd"

    if [[ "$VERBOSE" == "1" ]]; then
      # Show full output
      eval "$cmd" 2>&1 | tee -a "$LOG_FILE"
      local exit_code=${PIPESTATUS[0]}
    else
      # Suppress output unless there's an error
      if ! eval "$cmd" >> "$LOG_FILE" 2>&1; then
        local exit_code=$?
        echo -e "${RED}  ✗ Command failed with exit code $exit_code${NC}"
        echo -e "${YELLOW}  Check logs: tail -n 50 $LOG_FILE${NC}"
        log "ERROR" "Command failed: $cmd (exit code: $exit_code)"
        return $exit_code
      fi
      local exit_code=0
      echo -e "${GREEN}  ✓ Success${NC}"
    fi

    log "INFO" "Completed: $cmd (exit code: $exit_code)"
  fi

  echo ""
  return 0
}

# ==============================================================================
# DEFAULT TASK SEQUENCE
# ==============================================================================
default_tasks() {
  cat <<'EOF'
# Default Development Task Sequence
# This runs a typical dev workflow: install -> lint -> test -> build

echo "=== Step 1: Installing Dependencies ==="
bun install

echo "=== Step 2: Running Linter ==="
npm run lint

echo "=== Step 3: Building Project ==="
npm run build

echo "=== Step 4: Git Status ==="
git status

echo "=== All tasks completed! ==="
EOF
}

# Example: Pre-deployment checks
predeploy_tasks() {
  cat <<'EOF'
# Pre-Deployment Checklist
echo "=== Pre-Deployment Checks ==="

echo "→ Checking dependencies..."
bun install

echo "→ Running linter..."
npm run lint

echo "→ Building production bundle..."
npm run build

echo "→ Checking Supabase status..."
supabase status

echo "→ Git status..."
git status

echo "=== Pre-deployment checks complete ==="
EOF
}

# Phase 1: Critical Security & Functionality Deployment
deploy_phase1_tasks() {
  cat <<'EOF'
# Phase 1 Deployment: Critical Security & Functionality
echo "=== Phase 1 Deployment Starting ==="
echo "→ Step 1: Deploying database migrations..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && yes | supabase db push
echo "→ Step 2: Deploying ai-analyze function..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy ai-analyze
echo "→ Step 3: Deploying ai-chatbot function..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy ai-chatbot
echo "→ Step 4: Deploying generate-reading function..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy generate-reading
echo "→ Step 5: Checking deployment status..."
supabase functions list
echo "=== Phase 1 Deployment Complete ==="
EOF
}

# Phase 2: Data Integrity & Stability Deployment
deploy_phase2_tasks() {
  cat <<'EOF'
# Phase 2 Deployment: Data Integrity & Stability
echo "=== Phase 2 Deployment Starting ==="
echo "→ Step 1: Deploying database migrations..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && yes | supabase db push
echo "→ Step 2: Deploying cron-expire-subscriptions function..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy cron-expire-subscriptions
echo "→ Step 3: Setting CRON_SECRET..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase secrets set CRON_SECRET=cron_secret_phase2_$(date +%s)
echo "→ Step 4: Redeploying ai-analyze with JSON fixes..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy ai-analyze
echo "→ Step 5: Checking deployment status..."
supabase functions list
echo "=== Phase 2 Deployment Complete ==="
EOF
}

# Phase 3: Security Hardening Deployment
deploy_phase3_tasks() {
  cat <<'EOF'
# Phase 3 Deployment: Security Hardening
echo "=== Phase 3 Deployment Starting ==="
echo "→ Step 1: Deploying rate limiting migration..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && yes | supabase db push
echo "→ Step 2: Redeploying all functions with security updates..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy ai-analyze
echo "→ Step 3: Redeploying ai-chatbot..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy ai-chatbot
echo "→ Step 4: Redeploying generate-reading..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy generate-reading
echo "→ Step 5: Checking deployment status..."
supabase functions list
echo "=== Phase 3 Deployment Complete ==="
EOF
}

# Phase 4: Optimization & Monitoring Deployment
deploy_phase4_tasks() {
  cat <<'EOF'
# Phase 4 Deployment: Optimization & Monitoring
echo "=== Phase 4 Deployment Starting ==="
echo "→ Step 1: Deploying optimization migrations..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && yes | supabase db push
echo "→ Step 2: Deploying health check endpoint..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy health
echo "→ Step 3: Deploying renewal reminders cron..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy cron-renewal-reminders
echo "→ Step 4: Redeploying ai-analyze with optimizations..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy ai-analyze
echo "→ Step 5: Redeploying generate-reading with caching..."
export SUPABASE_ACCESS_TOKEN="sbp_bf76774438892c6adbc74418da7a171dc7550cea" && supabase functions deploy generate-reading
echo "→ Step 6: Checking deployment status..."
supabase functions list
echo "=== Phase 4 Deployment Complete ==="
EOF
}

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================
main() {
  print_header

  # Determine which task sequence to run
  local task_file="${1:-default}"
  local commands=""

  case "$task_file" in
    default)
      log "INFO" "Running DEFAULT task sequence"
      commands=$(default_tasks)
      ;;
    predeploy)
      log "INFO" "Running PRE-DEPLOY task sequence"
      commands=$(predeploy_tasks)
      ;;
    deploy-phase1)
      log "INFO" "Running PHASE 1 DEPLOYMENT sequence"
      commands=$(deploy_phase1_tasks)
      ;;
    deploy-phase2)
      log "INFO" "Running PHASE 2 DEPLOYMENT sequence"
      commands=$(deploy_phase2_tasks)
      ;;
    deploy-phase3)
      log "INFO" "Running PHASE 3 DEPLOYMENT sequence"
      commands=$(deploy_phase3_tasks)
      ;;
    deploy-phase4)
      log "INFO" "Running PHASE 4 DEPLOYMENT sequence"
      commands=$(deploy_phase4_tasks)
      ;;
    *)
      if [[ -f "$task_file" ]]; then
        log "INFO" "Running custom task file: $task_file"
        commands=$(cat "$task_file")
      else
        echo -e "${RED}Error: Task file not found: $task_file${NC}"
        echo ""
        echo "Usage:"
        echo "  ./scripts/auto_run.sh              # Run default tasks"
        echo "  ./scripts/auto_run.sh predeploy    # Run pre-deployment checks"
        echo "  ./scripts/auto_run.sh <file>       # Run custom command file"
        echo ""
        echo "Environment variables:"
        echo "  DRY_RUN=1    # Show commands without executing"
        echo "  VERBOSE=1    # Show detailed output"
        exit 1
      fi
      ;;
  esac

  # Execute commands line by line
  local line_num=0
  local failed=0

  while IFS= read -r cmd; do
    ((line_num++))

    if ! run_command "$cmd"; then
      failed=1
      echo -e "${RED}✗ Task sequence failed at line $line_num${NC}"
      log "ERROR" "Task sequence failed at line $line_num"
      exit 1
    fi
  done <<< "$commands"

  # Summary
  if [[ "$failed" == "0" ]]; then
    echo -e "${GREEN}===================================================${NC}"
    echo -e "${GREEN}  ✓ All tasks completed successfully!${NC}"
    echo -e "${GREEN}===================================================${NC}"
    log "INFO" "Task sequence completed successfully"
  fi
}

# Run main function with all arguments
main "$@"
