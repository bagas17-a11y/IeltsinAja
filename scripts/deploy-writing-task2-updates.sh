#!/usr/bin/env bash
# One-time (or repeat): apply ielts_library metadata migration + deploy ai-analyze.
#
# Prerequisites:
# 1) Create a personal access token: Supabase Dashboard → Account → Access Tokens
# 2) export SUPABASE_ACCESS_TOKEN="sbp_..."
# 3) Run this script from repo root: ./scripts/deploy-writing-task2-updates.sh
#
# Edge functions on Supabase Cloud automatically receive SUPABASE_URL and
# SUPABASE_SERVICE_ROLE_KEY — you do not need to set them as secrets unless
# you use a custom/self-hosted setup.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Error: set SUPABASE_ACCESS_TOKEN first (Supabase Dashboard → Account → Access Tokens)."
  exit 1
fi

PROJECT_REF="${SUPABASE_PROJECT_REF:-jryjpjkutwrieneuaoxv}"

echo "==> Linking project ${PROJECT_REF}..."
npx supabase@latest link --project-ref "$PROJECT_REF"

echo "==> Pushing pending migrations (--yes)..."
npx supabase@latest db push --yes

echo "==> Deploying ai-analyze (includes task2-rubric.json)..."
npx supabase@latest functions deploy ai-analyze --project-ref "$PROJECT_REF"

echo "==> Edge function secrets (names only; values are never printed)..."
npx supabase@latest secrets list --project-ref "$PROJECT_REF" 2>/dev/null || npx supabase@latest secrets list

echo ""
echo "Done. If db push reported nothing new, the migration was already applied."
echo "Optional: rotate any old tokens that were committed to scripts/ in the past."
