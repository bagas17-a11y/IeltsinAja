---
name: Backend Production Readiness Execution Roadmap
overview: Complete execution roadmap for making the IELTSinAja backend production-ready, with concrete file-level tasks, security fixes, data integrity improvements, and scaling preparations.
todos:
  - id: phase0-create-project
    content: Create new Supabase project and note credentials (URL, Project ID, Anon Key)
    status: pending
  - id: phase0-update-config
    content: Update supabase/config.toml and .env.local with new project credentials
    status: pending
    dependencies:
      - phase0-create-project
  - id: phase0-link-cli
    content: Link Supabase CLI to new project using supabase link command
    status: pending
    dependencies:
      - phase0-update-config
  - id: phase0-run-migrations
    content: Run all database migrations on new Supabase project using supabase db push
    status: pending
    dependencies:
      - phase0-link-cli
  - id: phase0-deploy-functions
    content: Deploy all edge functions (ai-analyze, ai-chatbot, generate-reading, send-verification-email) to new project
    status: pending
    dependencies:
      - phase0-link-cli
  - id: phase0-set-secrets
    content: Set LOVABLE_API_KEY and RESEND_API_KEY secrets in new Supabase project
    status: pending
    dependencies:
      - phase0-deploy-functions
  - id: phase0-create-buckets
    content: Create payment-receipts and question-images storage buckets in new project
    status: pending
    dependencies:
      - phase0-run-migrations
  - id: phase0-verify-connection
    content: Verify database connection, functions, storage, and frontend connectivity work
    status: pending
    dependencies:
      - phase0-deploy-functions
      - phase0-create-buckets
      - phase0-set-secrets
  - id: phase1-jwt-verification
    content: Enable JWT verification in supabase/config.toml for all edge functions
    status: pending
    dependencies:
      - phase0-verify-connection
  - id: phase1-super-admin-fix
    content: Remove hardcoded super admin check, use user_roles table instead
    status: pending
  - id: phase1-input-validation
    content: Add Zod input validation schemas to all edge functions
    status: pending
  - id: phase1-error-handling
    content: Standardize error response format across all edge functions
    status: pending
  - id: phase1-database-indexes
    content: Add missing indexes for payment_verifications, practice_submissions, listening_submissions
    status: pending
  - id: phase2-subscription-fields
    content: Consolidate subscription_expires_at and subscription_end_date fields
    status: pending
    dependencies:
      - phase1-input-validation
  - id: phase2-foreign-keys
    content: Add missing foreign key constraints for user_progress and admin_logs
    status: pending
  - id: phase2-business-constraints
    content: Add CHECK constraints for subscription tier rules and payment status
    status: pending
    dependencies:
      - phase2-subscription-fields
  - id: phase2-subscription-expiration
    content: Implement daily cron job to automatically expire Pro subscriptions
    status: pending
    dependencies:
      - phase2-business-constraints
  - id: phase2-payment-validation
    content: Add status check and idempotency to approve_payment function
    status: pending
  - id: phase2-json-parsing
    content: Replace regex JSON parsing with proper extraction utility
    status: pending
  - id: phase3-permission-checks
    content: Add verifyAdmin() helper and permission checks to all edge functions
    status: pending
    dependencies:
      - phase1-jwt-verification
  - id: phase3-cors-fix
    content: Restrict CORS to specific origins instead of allowing all
    status: pending
  - id: phase3-input-sanitization
    content: Add input sanitization for HTML and user input in all functions
    status: pending
    dependencies:
      - phase1-input-validation
  - id: phase3-rate-limiting
    content: Implement rate limiting middleware for AI functions
    status: pending
    dependencies:
      - phase1-jwt-verification
  - id: phase3-email-validation
    content: Add email format validation to send-verification-email function
    status: pending
    dependencies:
      - phase1-input-validation
  - id: phase4-health-check
    content: Create health check endpoint for monitoring
    status: pending
  - id: phase4-logging
    content: Implement structured logging infrastructure with request IDs
    status: pending
  - id: phase4-feature-gating-optimization
    content: Optimize feature gating query with practice_count counter column
    status: pending
  - id: phase4-reading-cache
    content: Implement reading passage caching in database table
    status: pending
  - id: phase4-retry-logic
    content: Add retry logic with exponential backoff for AI API calls
    status: pending
  - id: phase4-renewal-reminders
    content: Implement daily cron job to send subscription renewal reminders
    status: pending
    dependencies:
      - phase2-subscription-expiration
  - id: phase5-enable-pgvector
    content: Enable pgvector extension for vector similarity search
    status: pending
    dependencies:
      - phase4-health-check
  - id: phase5-add-embeddings-columns
    content: Add question_embedding and answer_embedding vector columns to ielts_library table
    status: pending
    dependencies:
      - phase5-enable-pgvector
  - id: phase5-create-embedding-function
    content: Create edge function to generate embeddings using OpenAI API
    status: pending
    dependencies:
      - phase5-add-embeddings-columns
  - id: phase5-create-similarity-search
    content: Create PostgreSQL function to find similar questions using vector similarity
    status: pending
    dependencies:
      - phase5-add-embeddings-columns
  - id: phase5-create-struggles-table
    content: Create user_struggles table to track which questions users struggle with
    status: pending
    dependencies:
      - phase2-foreign-keys
  - id: phase5-update-ai-function
    content: Update ai-analyze function to use similar questions for enhanced grading
    status: pending
    dependencies:
      - phase5-create-similarity-search
      - phase5-create-embedding-function
  - id: phase5-backfill-embeddings
    content: Backfill embeddings for all existing questions in ielts_library
    status: pending
    dependencies:
      - phase5-create-embedding-function
  - id: phase5-optimize-similarity-search
    content: Optimize similarity search performance with proper indexing
    status: pending
    dependencies:
      - phase5-backfill-embeddings
  - id: phase5-auto-embedding-generation
    content: Add automatic embedding generation when admin creates/updates questions
    status: pending
    dependencies:
      - phase5-create-embedding-function
---

# Backend Production

Readiness Execution Roadmap

## 1. Backend System Inventory

### What Currently Exists

**Edge Functions** (4 functions in `supabase/functions/`):

- `ai-analyze/index.ts` (630 lines) - Writing/speaking/reading AI grading
- `ai-chatbot/index.ts` (125 lines) - Customer support chatbot
- `generate-reading/index.ts` (223 lines) - AI-generated reading passages
- `send-verification-email/index.ts` (157 lines) - Email notifications via Resend

**Database Schema** (14 migrations in `supabase/migrations/`):

- `profiles` - User profiles with subscription data
- `user_roles` - RBAC (admin, moderator, user)
- `payment_verifications` - Manual payment approval workflow
- `ielts_library` - Writing questions (admin-managed)
- `listening_library` - Listening tests (admin-managed)
- `practice_submissions` - Writing/speaking submissions
- `listening_submissions` - Listening test attempts
- `user_progress` - Unified progress tracking
- `consultation_bookings` - Stubbed for future feature
- `admin_logs` - Audit trail

**Database Functions** (PostgreSQL):

- `approve_payment(payment_id, admin_id)` - Approves payment, upgrades tier
- `extend_subscription(target_user_id, days_to_add, admin_id)` - Extends Pro subscription
- `toggle_admin_role(target_user_id, admin_id)` - Grants/revokes admin
- `unlock_user(target_user_id, admin_id)` - Sets `is_verified = true`
- `has_role(_user_id, _role)` - RLS helper function
- `handle_new_user()` - Creates profile on signup (trigger)
- `update_updated_at_column()` - Auto-updates timestamps

**RLS Policies**: All tables have Row Level Security enabled with user-scoped and admin-scoped policies.**Storage Buckets**:

- `payment-receipts` (private, user-scoped)
- `question-images` (public, admin-uploaded)

### What Is Missing or Incomplete

1. **No JWT Verification on Edge Functions**

- **File**: `supabase/config.toml` lines 3-16
- **Issue**: All functions have `verify_jwt = false`
- **Impact**: Anyone can call functions without authentication

2. **No Input Validation**

- **Files**: All edge functions
- **Issue**: Functions accept any JSON without schema validation
- **Impact**: Invalid data causes errors, potential injection

3. **No Subscription Expiration Automation**

- **Missing**: Cron job or scheduled function
- **Issue**: Pro subscriptions expire but never automatically downgrade
- **Impact**: Users keep access after expiration until manual intervention

4. **No Rate Limiting**

- **Missing**: Rate limiting middleware or configuration
- **Impact**: AI functions can be spammed, exhausting credits

5. **No Error Logging Infrastructure**

- **Missing**: Structured logging, error tracking service
- **Current**: Only `console.error()` in functions
- **Impact**: No visibility into production errors

6. **No Health Check Endpoint**

- **Missing**: Health check function
- **Impact**: No way to monitor system status

7. **No Environment Variable Validation**

- **Missing**: Startup validation of required env vars
- **Impact**: Functions fail at runtime instead of startup

8. **No Request Idempotency**

- **Missing**: Idempotency keys for payment approvals
- **Impact**: Duplicate approvals possible

### What Is Broken or Inconsistent

1. **Super Admin Hardcoded in Frontend**

- **File**: `src/hooks/useAuth.tsx` line 6
- **Issue**: `SUPER_ADMIN_EMAIL = "bagasshryo@gmail.com"` checked only in frontend
- **Impact**: Can be bypassed, not secure

2. **Subscription Field Confusion**

- **Files**: `supabase/migrations/20260108084732_*.sql`, `20260207000000_*.sql`
- **Issue**: Both `subscription_expires_at` and `subscription_end_date` exist
- **Impact**: Unclear which field is authoritative

3. **Plan Type Naming Inconsistency**

- **Database**: `plan_type IN ('pro', 'road_to_8')`
- **Frontend**: Maps `road_to_8` → `elite` tier
- **File**: `src/pages/admin/PaymentVerification.tsx` line 152
- **Impact**: Confusing code, potential bugs

4. **Missing Foreign Keys**

- **Files**: Multiple migrations
- **Issue**: `user_progress.user_id`, `admin_logs.admin_id` have no FKs
- **Impact**: No referential integrity, orphaned records possible

5. **Inconsistent Error Response Format**

- **Files**: All edge functions
- **Issue**: Some return `{ error: string }`, others throw
- **Impact**: Frontend error handling is inconsistent

6. **JSON Parsing with Regex**

- **File**: `supabase/functions/ai-analyze/index.ts` line 608
- **Issue**: `aiResponse.match(/\{[\s\S]*\}/)` is fragile
- **Impact**: May fail on nested JSON or markdown

7. **CORS Allows All Origins**

- **Files**: All edge functions
- **Issue**: `"Access-Control-Allow-Origin": "*"`
- **Impact**: Any website can call functions

### What Is Stubbed or Placeholder Logic

1. **Consultation Bookings**

- **File**: `supabase/migrations/20260104053414_*.sql` lines 39-48
- **Status**: Table exists, no UI implementation
- **Impact**: Dead code, unused table

2. **Subscription Status Fields**

- **File**: `supabase/migrations/20260207000000_*.sql` lines 2-6
- **Status**: Fields added but not used in business logic
- **Impact**: Confusion about which fields to use

---

## 2. Core Functional Requirements That Must Work

### Authentication

**Status**: ✅ **EXISTS** (Supabase Auth)

- Signup/login via email/password
- JWT token management
- Session persistence in localStorage
- Auto token refresh
- **File**: `src/integrations/supabase/client.ts`

**Missing**:

- No password reset flow (Supabase supports it, but no UI)
- No email verification requirement
- **Action**: Add password reset UI or document that it's handled by Supabase dashboard

### Authorization

**Status**: ⚠️ **PARTIALWhat Exists**:

- RLS policies on all tables
- `has_role()` function for admin checks
- `user_roles` table with admin/moderator/user roles
- **Files**: `supabase/migrations/20260104060738_*.sql`

**What's Missing**:

1. **Super admin check is insecure**

- **File**: `src/hooks/useAuth.tsx` line 6
- **Fix**: Remove hardcoded email, use `user_roles` table
- **Action**: Create migration to seed initial admin, update frontend

2. **Edge functions don't verify JWT**

- **File**: `supabase/config.toml`
- **Fix**: Enable `verify_jwt = true` or add manual JWT verification
- **Action**: Add JWT verification middleware to all functions

3. **No permission checks in edge functions**

- **Files**: All edge functions
- **Fix**: Verify user role before admin operations
- **Action**: Add `verifyAdmin()` helper function

### User Management

**Status**: ✅ **EXISTS**

- Profile creation on signup (trigger)
- Profile updates
- Admin user management UI
- **Files**: `supabase/migrations/20260104053414_*.sql` (trigger), `src/pages/admin/UserManagement.tsx`

**Missing**:

- No user deletion flow (cascade handled by DB)
- No bulk operations
- **Action**: Document deletion behavior, add bulk operations if needed

### Core Domain Logic

**Status**: ✅ **EXISTS** (mostly)**Writing Module**:

- ✅ Question library management
- ✅ Essay submission
- ✅ AI grading with detailed feedback
- ✅ Revision tracking
- **File**: `supabase/functions/ai-analyze/index.ts` lines 331-489

**Reading Module**:

- ✅ AI-generated passages
- ✅ Question generation (13 questions)
- ✅ Answer validation
- **File**: `supabase/functions/generate-reading/index.ts`

**Listening Module**:

- ✅ Admin-uploaded tests
- ✅ Answer submission
- ✅ Score calculation
- **File**: Database schema in `supabase/migrations/20260105182356_*.sql`

**Speaking Module**:

- ✅ Speech-to-text (frontend)
- ✅ AI analysis
- ✅ Band score calculation
- **File**: `supabase/functions/ai-analyze/index.ts` lines 490-546

**Payment/Subscription**:

- ✅ Payment verification workflow
- ✅ Manual approval
- ✅ Subscription tier upgrade
- ⚠️ **Missing**: Automatic expiration handling
- **File**: `supabase/migrations/20260108084857_*.sql` (approve_payment function)

### Data Validation

**Status**: ❌ **MISSINGWhat's Missing**:

1. **No input validation in edge functions**

- **Files**: All edge functions
- **Fix**: Add Zod schemas
- **Example**: Validate `content` is string, `taskType` is enum, `email` is valid format

2. **No database constraints for business rules**

- **Example**: No CHECK constraint ensuring `subscription_expires_at` is NULL for elite tier
- **Fix**: Add constraints or triggers

3. **No word count validation server-side**

- **File**: `supabase/functions/ai-analyze/index.ts` line 332
- **Issue**: Word count checked in frontend only
- **Fix**: Validate in edge function

**Action**: Create `supabase/functions/shared/validation.ts` with Zod schemas

### State Management

**Status**: ✅ **EXISTS** (Database-driven)

- Subscription state in `profiles` table
- Progress state in `user_progress` table
- **Files**: Database schema

**Missing**:

- No state machine for payment verification (pending → approved/rejected)
- **Action**: Add CHECK constraint or enum for status transitions

### Background Processing

**Status**: ❌ **MISSINGWhat's Missing**:

1. **Subscription expiration job**

- **Required**: Daily job to check `subscription_expires_at < NOW()`
- **Action**: Downgrade Pro users to free tier
- **Implementation**: Supabase Cron or external scheduler

2. **Email reminder job**

- **Required**: Send renewal reminders 7 days before expiration
- **Action**: Query users with `subscription_expires_at BETWEEN NOW() AND NOW() + 7 days`

3. **Cleanup jobs**

- **Required**: Archive old payment receipts, clean expired sessions
- **Action**: Scheduled cleanup functions

**Action**: Create `supabase/functions/cron/` directory with scheduled functions

### External Integrations

**Status**: ⚠️ **PARTIALLovable AI Gateway**:

- ✅ Integrated in all AI functions
- ⚠️ **Missing**: Error handling for rate limits (429), credit exhaustion (402)
- ⚠️ **Missing**: Retry logic with exponential backoff
- **Files**: All edge functions

**Resend Email**:

- ✅ Integrated in `send-verification-email`
- ⚠️ **Missing**: Error handling, retry logic
- **File**: `supabase/functions/send-verification-email/index.ts`

**Action**: Add retry logic and better error handling

### Error Handling

**Status**: ⚠️ **INCONSISTENTWhat Exists**:

- Basic try/catch in all functions
- Error messages returned to frontend
- **Files**: All edge functions

**What's Missing**:

1. **No standardized error format**

- **Fix**: Create `{ success: boolean, data?: T, error?: { code: string, message: string } }`
- **Action**: Create `supabase/functions/shared/errors.ts`

2. **No error logging**

- **Fix**: Log to `admin_logs` or external service
- **Action**: Add logging utility

3. **No error categorization**

- **Fix**: Distinguish between user errors (400) and system errors (500)
- **Action**: Add error types

**Action**: Create error handling utilities

### Logging

**Status**: ❌ **MISSINGWhat Exists**:

- `console.log()` and `console.error()` in functions
- `admin_logs` table for admin actions
- **File**: `supabase/migrations/20260108090530_*.sql`

**What's Missing**:

1. **No structured logging**

- **Fix**: Use structured format with timestamps, request IDs, user IDs
- **Action**: Create logging utility

2. **No log aggregation**

- **Fix**: Send logs to external service (e.g., LogRocket, Sentry)
- **Action**: Integrate logging service

3. **No performance logging**

- **Fix**: Log function execution times
- **Action**: Add timing middleware

**Action**: Create `supabase/functions/shared/logger.ts`

### Observability

**Status**: ❌ **MISSINGWhat's Missing**:

1. **No health check endpoint**

- **Action**: Create `supabase/functions/health/index.ts`

2. **No metrics collection**

- **Action**: Track function invocations, errors, latency

3. **No alerting**

- **Action**: Set up alerts for errors, high latency, credit exhaustion

**Action**: Implement health checks and basic metrics

### Rate Limiting

**Status**: ❌ **MISSINGWhat's Missing**:

1. **No per-user rate limits**

- **Impact**: Users can spam AI functions
- **Action**: Implement rate limiting middleware

2. **No global rate limits**

- **Impact**: Single user can exhaust AI credits
- **Action**: Add global limits

**Action**: Create rate limiting utility or use Supabase rate limiting

### Security Protections

**Status**: ⚠️ **WEAKWhat Exists**:

- RLS policies on all tables
- CORS headers (but too permissive)

**What's Missing**:

1. **No JWT verification on edge functions**

- **File**: `supabase/config.toml`
- **Action**: Enable JWT verification

2. **No input sanitization**

- **Action**: Sanitize user input before processing

3. **No SQL injection protection**

- **Status**: Using parameterized queries (good), but no explicit validation
- **Action**: Add input validation

4. **CORS allows all origins**

- **Action**: Restrict to specific origins in production

5. **No secrets rotation**

- **Action**: Document secret rotation process

**Action**: Security hardening checklist (see Section 5)---

## 3. Database & Data Integrity Plan

### Schema Completeness

**Status**: ✅ **MOSTLY COMPLETEVerified Tables**:

- ✅ `profiles` - Complete with subscription fields
- ✅ `user_roles` - Complete
- ✅ `payment_verifications` - Complete
- ✅ `ielts_library` - Complete
- ✅ `listening_library` - Complete
- ✅ `practice_submissions` - Complete
- ✅ `listening_submissions` - Complete
- ✅ `user_progress` - Complete
- ✅ `admin_logs` - Complete
- ⚠️ `consultation_bookings` - Exists but unused

**Missing Tables**:

- ❌ No `reading_passages` table (passages generated on-demand, not stored)
- **Impact**: Cannot cache or reuse passages
- **Action**: Create table if caching is desired

### Required Migrations

**Migration 1: Fix Subscription Fields**

- **File**: `supabase/migrations/20260208000000_fix_subscription_fields.sql`
- **Action**: 
- Document which field is authoritative (`subscription_expires_at`)
- Deprecate `subscription_end_date` or migrate data
- Add CHECK constraint: `(subscription_tier = 'elite' AND subscription_expires_at IS NULL) OR (subscription_tier != 'elite')`

**Migration 2: Add Missing Foreign Keys**

- **File**: `supabase/migrations/20260208000001_add_missing_foreign_keys.sql`
- **Action**:
- Add FK: `user_progress.user_id → auth.users(id)`
- Add FK: `admin_logs.admin_id → auth.users(id)`
- Add FK: `admin_logs.target_user_id → auth.users(id)`

**Migration 3: Add Missing Indexes**

- **File**: `supabase/migrations/20260208000002_add_missing_indexes.sql`
- **Action**:
- Index: `payment_verifications.user_id`
- Index: `practice_submissions.user_id`
- Index: `practice_submissions.created_at DESC`
- Index: `listening_submissions.user_id`
- Index: `listening_submissions.listening_id`

**Migration 4: Add Business Rule Constraints**

- **File**: `supabase/migrations/20260208000003_add_business_constraints.sql`
- **Action**:
- CHECK: `subscription_tier = 'elite' → subscription_expires_at IS NULL`
- CHECK: `subscription_tier = 'pro' → subscription_expires_at IS NOT NULL`
- CHECK: `payment_verifications.status IN ('pending', 'approved', 'rejected')`
- CHECK: `practice_submissions.module_type IN ('reading', 'listening', 'writing', 'speaking')`

**Migration 5: Standardize Plan Types**

- **File**: `supabase/migrations/20260208000004_standardize_plan_types.sql`
- **Action**:
- Rename `plan_type` values: `'road_to_8' → 'elite'`
- Update CHECK constraint
- Update `approve_payment` function

### Foreign Key Constraints

**Current State**:

- ✅ `profiles.user_id → auth.users(id)` (CASCADE DELETE)
- ✅ `user_roles.user_id → auth.users(id)` (CASCADE DELETE)
- ✅ `payment_verifications.user_id → auth.users(id)` (CASCADE DELETE)
- ✅ `listening_submissions.listening_id → listening_library(id)` (CASCADE DELETE)
- ❌ `user_progress.user_id` - No FK
- ❌ `admin_logs.admin_id` - No FK
- ❌ `admin_logs.target_user_id` - No FK

**Action**: Add missing FKs (see Migration 2)

### Indexing Strategy

**Current Indexes**:

- ✅ `idx_user_progress_user_id`
- ✅ `idx_user_progress_exam_type`
- ✅ `idx_user_progress_completed_at DESC`
- ✅ `idx_admin_logs_created_at DESC`
- ✅ `idx_admin_logs_action_type`
- ✅ `idx_profiles_subscription_status`
- ✅ `idx_profiles_subscription_end_date`

**Missing Indexes** (performance critical):

- ❌ `payment_verifications.user_id` - Used in admin panel queries
- ❌ `payment_verifications.status` - Filtered by status
- ❌ `practice_submissions.user_id` - User history queries
- ❌ `practice_submissions.created_at DESC` - Recent submissions
- ❌ `listening_submissions.user_id` - User history
- ❌ `listening_submissions.listening_id` - Library queries

**Action**: Add missing indexes (see Migration 3)

### Transaction Boundaries

**Current State**:

- ✅ `approve_payment()` - Single transaction (updates payment + profile)
- ✅ `extend_subscription()` - Single transaction (updates profile + logs)
- ⚠️ Payment approval + email sending - **NOT ATOMIC**
- **File**: `src/pages/admin/PaymentVerification.tsx` lines 141-226
- **Issue**: Payment approved, but email can fail
- **Impact**: User upgraded but no notification
- **Fix**: Make email sending optional, log failures

**Action**: Document transaction boundaries, ensure critical operations are atomic

### Data Consistency Risks

**Risk 1: Subscription State Inconsistency**

- **Issue**: `subscription_tier` and `subscription_expires_at` can be out of sync
- **Example**: `tier = 'pro'` but `expires_at = NULL`
- **Fix**: Add CHECK constraint (see Migration 4)

**Risk 2: Payment Status Inconsistency**

- **Issue**: Payment can be approved but profile not updated (if function fails)
- **Current**: Function is atomic (good)
- **Action**: Add retry logic for failed updates

**Risk 3: Orphaned Records**

- **Issue**: `user_progress` records can reference deleted users
- **Fix**: Add FK constraint (see Migration 2)

**Action**: Add constraints and validation to prevent inconsistencies

### Cleanup of Bad Patterns

**Pattern 1: JSON Parsing with Regex**

- **File**: `supabase/functions/ai-analyze/index.ts` line 608
- **Issue**: `aiResponse.match(/\{[\s\S]*\}/)` is fragile
- **Fix**: Use proper JSON extraction or ask AI to return only JSON
- **Action**: Create `extractJson()` utility function

**Pattern 2: Magic Numbers**

- **Files**: Multiple
- **Examples**: 
- `minWords = isTask1 ? 150 : 250` (line 334)
- `interval '31 days'` (migration)
- **Fix**: Extract to constants
- **Action**: Create `supabase/functions/shared/constants.ts`

**Pattern 3: Hardcoded URLs**

- **File**: `supabase/functions/send-verification-email/index.ts` line 58
- **Issue**: `dashboardUrl = "https://ieltsinaja.id/dashboard"` hardcoded
- **Fix**: Use environment variable
- **Action**: Add `DASHBOARD_URL` env var

---

## 4. API Completion Plan

### Writing Analysis Endpoint

**Endpoint**: `POST /functions/v1/ai-analyze`**File**: `supabase/functions/ai-analyze/index.ts`**Request Schema** (current):

```typescript
{
  type: "writing",
  content: string,
  taskType: "Task 1" | "Task 2",
  isRevision?: boolean,
  questionId?: string,
  secretContext?: string,
  modelAnswer?: string,
  targetKeywords?: string
}
```

**Issues**:

1. ❌ No validation - accepts any JSON
2. ❌ No JWT verification
3. ❌ No rate limiting
4. ❌ No request ID for tracing

**Required Fixes**:

1. **Add Zod validation**:
   ```typescript
               const WritingAnalysisSchema = z.object({
                 type: z.literal("writing"),
                 content: z.string().min(50).max(10000),
                 taskType: z.enum(["Task 1", "Task 2"]),
                 isRevision: z.boolean().optional(),
                 questionId: z.string().uuid().optional(),
                 secretContext: z.string().optional(),
                 modelAnswer: z.string().optional(),
                 targetKeywords: z.string().optional()
               });
   ```




2. **Add JWT verification**:
   ```typescript
               const authHeader = req.headers.get("Authorization");
               if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
   ```




3. **Add rate limiting**: Check user's request count in last hour
4. **Add request ID**: Generate UUID, include in logs

**Response Schema** (current):

```typescript
{
  wordCount: number,
  overallBand: number,
  structuralGrade: {...},
  scoringGrid: {...},
  // ... or
  error: string
}
```

**Issues**:

1. ❌ Inconsistent format (success vs error)
2. ❌ No request ID in response

**Required Fixes**:

1. **Standardize format**:
   ```typescript
               {
                 success: true,
                 data: { ... },
                 requestId: string
               }
               // or
               {
                 success: false,
                 error: { code: string, message: string },
                 requestId: string
               }
   ```


**Error Handling** (current):

- ✅ Try/catch exists
- ❌ No error categorization
- ❌ No error logging

**Edge Cases**:

1. ❌ AI API timeout - No handling
2. ❌ AI API rate limit (429) - Handled but no retry
3. ❌ AI API credit exhaustion (402) - Handled but no notification
4. ❌ Invalid JSON from AI - Handled with fallback

**Idempotency**: ❌ Not implemented

- **Issue**: Same essay can be analyzed multiple times
- **Fix**: Add idempotency key, cache results for same content hash

**Production Readiness**: ⚠️ **PARTIAL**

- Core functionality works
- Missing: Validation, security, observability
- **Action**: Implement fixes above

### Reading Generation Endpoint

**Endpoint**: `POST /functions/v1/generate-reading`**File**: `supabase/functions/generate-reading/index.ts`**Request Schema** (current):

```typescript
{ difficulty?: "easy" | "medium" | "hard" }
```

**Issues**: Same as writing analysis (no validation, no JWT, no rate limiting)**Response Schema**: Well-structured JSON**Production Readiness**: ⚠️ **PARTIAL**

- **Action**: Same fixes as writing analysis

### Payment Approval Endpoint

**Endpoint**: `POST /rpc/approve_payment`**File**: `supabase/migrations/20260108084857_*.sql`**Request Schema**:

```sql
approve_payment(payment_id UUID, admin_id UUID)
```

**Issues**:

1. ✅ Atomic transaction (good)
2. ❌ No validation of payment status (can approve already-approved payment)
3. ❌ No idempotency check

**Required Fixes**:

1. **Add status check**:
   ```sql
               IF (SELECT status FROM payment_verifications WHERE id = payment_id) != 'pending' THEN
                 RAISE EXCEPTION 'Payment already processed';
               END IF;
   ```




2. **Add idempotency**: Check if already approved

**Production Readiness**: ⚠️ **NEEDS IMPROVEMENT**

- **Action**: Add validation and idempotency

---

## 5. Security Hardening Checklist

### Auth Vulnerabilities

**Critical Issues**:

1. **Edge Functions Have No JWT Verification**

- **File**: `supabase/config.toml` lines 3-16
- **Severity**: 🔴 **CRITICAL**
- **Fix**: Set `verify_jwt = true` for all functions
- **Action**: Update config, test all functions

2. **Super Admin Hardcoded in Frontend**

- **File**: `src/hooks/useAuth.tsx` line 6
- **Severity**: 🔴 **CRITICAL**
- **Fix**: Move to database, use `user_roles` table
- **Action**: 
    - Create migration to seed admin
    - Remove hardcoded check
    - Update frontend to use `has_role()` RPC

3. **No Permission Checks in Edge Functions**

- **Files**: All edge functions
- **Severity**: 🟡 **HIGH**
- **Fix**: Verify user role before admin operations
- **Action**: Add `verifyAdmin()` helper

### Injection Risks

**SQL Injection**: ✅ **PROTECTED** (using parameterized queries)

- **Status**: Safe, using Supabase client

**NoSQL Injection**: N/A (using PostgreSQL)**Command Injection**: ✅ **SAFE** (no shell commands)**Template Injection**: ⚠️ **POTENTIAL RISK**

- **File**: `supabase/functions/send-verification-email/index.ts` line 71
- **Issue**: HTML template with user input (`full_name`, `plan_name`)
- **Fix**: Sanitize user input before inserting into HTML
- **Action**: Use HTML escaping library

### Missing Validation

**Input Validation**: ❌ **MISSING**

- **Files**: All edge functions
- **Fix**: Add Zod schemas
- **Action**: Create validation layer

**Email Validation**: ❌ **MISSING**

- **File**: `supabase/functions/send-verification-email/index.ts` line 50
- **Fix**: Validate email format
- **Action**: Add email validation

**UUID Validation**: ❌ **MISSING**

- **Files**: RPC functions
- **Fix**: Validate UUID format
- **Action**: Add UUID validation

### CORS

**Current**: `"Access-Control-Allow-Origin": "*"`

- **Files**: All edge functions
- **Severity**: 🟡 **MEDIUM**
- **Fix**: Restrict to specific origins in production
- **Action**: 
  ```typescript
          const allowedOrigins = Deno.env.get("ALLOWED_ORIGINS")?.split(",") || ["*"];
          const origin = req.headers.get("Origin");
          const corsOrigin = allowedOrigins.includes(origin || "") ? origin : allowedOrigins[0];
  ```




### Secrets Handling

**Current**: Using `Deno.env.get()`

- **Status**: ✅ **SAFE** (secrets in Supabase dashboard)
- **Missing**: No validation that secrets exist at startup
- **Action**: Add startup validation

### Input Sanitization

**Current**: ❌ **MISSING**

- **Files**: All edge functions
- **Fix**: Sanitize all user input
- **Action**: 
- HTML: Escape HTML entities
- SQL: Already safe (parameterized)
- JSON: Validate schema

### Access Control Holes

1. **RLS Policies**: ✅ **GOOD** (all tables have RLS)
2. **Admin Functions**: ⚠️ **WEAK** (no JWT verification)
3. **Storage Policies**: ✅ **GOOD** (user-scoped)

**Action**: Enable JWT verification, add permission checks

### Abuse Vectors

1. **AI Function Spam**

- **Vector**: Call `ai-analyze` repeatedly
- **Impact**: Exhaust AI credits
- **Fix**: Rate limiting per user
- **Action**: Implement rate limiting

2. **Reading Generation Spam**

- **Vector**: Generate unlimited reading passages
- **Impact**: High AI costs
- **Fix**: Rate limiting + caching
- **Action**: Add rate limits, cache passages

3. **Payment Receipt Spam**

- **Vector**: Upload many fake receipts
- **Impact**: Admin workload
- **Fix**: Rate limiting on uploads
- **Action**: Add upload limits

4. **Email Spam**

- **Vector**: Trigger `send-verification-email` repeatedly
- **Impact**: Email costs, spam complaints
- **Fix**: Rate limiting, idempotency
- **Action**: Add rate limits

**Action**: Implement rate limiting for all abuse vectors---

## 6. Performance & Scaling Plan

### Bottlenecks in Current Design

**Bottleneck 1: AI API Calls Are Synchronous**

- **File**: All edge functions
- **Issue**: Functions wait for AI response (10-30 seconds)
- **Impact**: Timeout risk, poor UX
- **Fix**: Queue requests, process asynchronously
- **Action**: Implement request queue

**Bottleneck 2: Reading Passages Generated On-Demand**

- **File**: `supabase/functions/generate-reading/index.ts`
- **Issue**: Every request generates new passage
- **Impact**: Slow, expensive
- **Fix**: Cache generated passages, reuse
- **Action**: Create `reading_passages` table, cache logic

**Bottleneck 3: Feature Gating Counts All Progress**

- **File**: `src/hooks/useFeatureGating.tsx` line 37
- **Issue**: `SELECT exam_type FROM user_progress WHERE user_id = ?` counts all rows
- **Impact**: Slow for users with many attempts
- **Fix**: Add aggregated counter or materialized view
- **Action**: Add `practice_count` column to `profiles` table

### Query Inefficiencies

**Query 1: User Progress Count**

- **Current**: `SELECT exam_type FROM user_progress WHERE user_id = ?`
- **Issue**: Scans all rows, counts in application
- **Fix**: `SELECT exam_type, COUNT(*) FROM user_progress WHERE user_id = ? GROUP BY exam_type`
- **Action**: Optimize query

**Query 2: Payment Verifications List**

- **File**: `src/pages/admin/PaymentVerification.tsx` line 91
- **Issue**: Likely missing indexes
- **Fix**: Add indexes (see Migration 3)
- **Action**: Add indexes

**Query 3: User Submissions History**

- **Issue**: No pagination
- **Fix**: Add LIMIT/OFFSET or cursor-based pagination
- **Action**: Add pagination

### N+1 Risks

**Risk 1: Payment Verifications with Profiles**

- **File**: `src/pages/admin/PaymentVerification.tsx`
- **Issue**: May fetch profiles separately
- **Fix**: Use JOIN or Supabase `.select('*, profiles(*)')`
- **Action**: Verify query pattern

**Risk 2: Listening Submissions with Library**

- **Issue**: May fetch library separately
- **Fix**: Use JOIN
- **Action**: Verify query pattern

### Missing Caching

**Cache 1: Reading Passages**

- **Missing**: No caching
- **Fix**: Store in database, reuse
- **Action**: Create `reading_passages` table

**Cache 2: User Profiles**

- **Missing**: No caching
- **Fix**: Cache in frontend (already done via React state)
- **Status**: ✅ **OK**

**Cache 3: AI Responses**

- **Missing**: No caching for same content
- **Fix**: Cache by content hash
- **Action**: Add caching layer

### Background Job Improvements

**Current**: ❌ **NO BACKGROUND JOBSRequired Jobs**:

1. **Subscription Expiration** (daily)

- Query: `SELECT * FROM profiles WHERE subscription_tier = 'pro' AND subscription_expires_at < NOW()`
- Action: Set `subscription_tier = 'free'`, log to `admin_logs`
- **File**: `supabase/functions/cron/expire-subscriptions/index.ts`

2. **Renewal Reminders** (daily)

- Query: `SELECT * FROM profiles WHERE subscription_tier = 'pro' AND subscription_expires_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'`
- Action: Send email reminder
- **File**: `supabase/functions/cron/send-renewal-reminders/index.ts`

3. **Cleanup Old Data** (weekly)

- Action: Archive old payment receipts, clean expired sessions
- **File**: `supabase/functions/cron/cleanup-old-data/index.ts`

**Action**: Implement cron functions

### Horizontal Scaling Readiness

**Current State**: ✅ **READY** (stateless functions)

- Edge functions are stateless
- Database is shared
- No session state in functions

**Potential Issues**:

1. **Database Connection Pooling**

- **Status**: Managed by Supabase
- **Action**: Monitor connection limits

2. **File Storage**

- **Status**: Supabase Storage (scales automatically)
- **Action**: Monitor storage usage

**Action**: Monitor scaling metrics, adjust as needed---

## 7. Production Readiness Checklist

### Environment Configuration

**Current**: ⚠️ **PARTIALRequired Variables**:

- ✅ `VITE_SUPABASE_URL` (frontend)
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY` (frontend)
- ✅ `LOVABLE_API_KEY` (edge functions)
- ✅ `RESEND_API_KEY` (edge functions)
- ❌ `ALLOWED_ORIGINS` (missing)
- ❌ `DASHBOARD_URL` (missing, hardcoded)

**Action**:

1. Document all required env vars
2. Create `.env.example` file
3. Add startup validation

### Logging

**Current**: ❌ **MISSINGRequired**:

1. **Structured Logging**

- Format: `{ timestamp, level, message, requestId, userId, ...metadata }`
- **File**: `supabase/functions/shared/logger.ts`

2. **Log Aggregation**

- Service: LogRocket, Sentry, or Supabase Logs
- **Action**: Integrate logging service

3. **Error Logging**

- Log all errors to `admin_logs` or external service
- **Action**: Add error logging

**Action**: Implement logging infrastructure

### Monitoring

**Current**: ❌ **MISSINGRequired**:

1. **Health Check Endpoint**

- **File**: `supabase/functions/health/index.ts`
- Checks: Database, AI gateway, storage
- **Action**: Create health check

2. **Metrics Collection**

- Track: Function invocations, errors, latency
- **Action**: Add metrics

3. **Alerting**

- Alerts: Errors, high latency, credit exhaustion
- **Action**: Set up alerts

**Action**: Implement monitoring

### Health Checks

**Current**: ❌ **MISSINGRequired Endpoint**: `GET /functions/v1/health`**Checks**:

1. Database connectivity
2. AI gateway status
3. Storage access
4. Environment variables

**Response**:

```typescript
{
  status: "healthy" | "degraded" | "unhealthy",
  checks: {
    database: "ok" | "error",
    aiGateway: "ok" | "error",
    storage: "ok" | "error"
  },
  timestamp: string
}
```

**Action**: Create `supabase/functions/health/index.ts`

### CI/CD

**Current**: ❌ **NOT VISIBLERequired**:

1. **Migration Testing**

- Test migrations on staging
- **Action**: Set up migration testing

2. **Function Testing**

- Test edge functions before deploy
- **Action**: Add tests

3. **Deployment Pipeline**

- Automated deployment
- **Action**: Set up CI/CD

**Action**: Document or implement CI/CD

### Migrations Strategy

**Current**: ✅ **GOOD** (sequential migrations)**Required**:

1. **Migration Testing**

- Test on staging first
- **Action**: Set up staging environment

2. **Rollback Plan**

- Document rollback procedures
- **Action**: Create rollback scripts

3. **Migration Validation**

- Validate migrations don't break existing data
- **Action**: Add validation

**Action**: Document migration process

### Rollback Plan

**Current**: ❌ **NOT DOCUMENTEDRequired**:

1. **Database Rollback**

- Document how to rollback migrations
- **Action**: Create rollback scripts

2. **Function Rollback**

- Document how to rollback edge functions
- **Action**: Document process

3. **Data Recovery**

- Backup strategy
- **Action**: Document backup process

**Action**: Create rollback documentation

### Seed Data Strategy

**Current**: ⚠️ **PARTIALRequired**:

1. **Initial Admin User**

- Seed admin in `user_roles` table
- **Action**: Create seed migration

2. **Sample Questions**

- Seed sample IELTS questions
- **Action**: Create seed data

3. **Test Data**

- Seed test data for development
- **Action**: Create seed script

**Action**: Create seed migrations---

## 8. Prioritized Execution Roadmap

### Phase 0 – Supabase Migration (Prerequisite)

**Goal**: Migrate to a new Supabase project with all data, functions, and configuration**When to Do This**: Before starting Phase 1, if you need to switch to a new Supabase project

#### Task 0.1: Create New Supabase Project

- **Action**: 

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note the Project URL (e.g., `https://xxxxx.supabase.co`)
3. Note the Project ID (found in Project Settings → General)
4. Note the Anon/Public Key (found in Project Settings → API)

- **Time**: 15 minutes

#### Task 0.2: Update Configuration Files

- **Files**: 
- `supabase/config.toml`
- `.env` or `.env.local` (create if missing)
- **Changes**:
- Update `project_id` in `supabase/config.toml` with new project ID
- Create `.env.local` with:
    ```bash
            VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
            VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
    ```




- **Time**: 10 minutes

#### Task 0.3: Link Supabase CLI to New Project

- **Commands**:
  ```bash
      # Install Supabase CLI if needed
      npm install -g supabase
      
      # Login to Supabase
      supabase login
      
      # Link to your new project
      supabase link --project-ref your-new-project-id
  ```




- **Time**: 5 minutes

#### Task 0.4: Run Database Migrations

- **Commands**:
  ```bash
      # Push all migrations to the new database
      supabase db push
      
      # Or if you need to reset and start fresh
      supabase db reset
  ```




- **Verification**: Check that all tables, functions, triggers, and RLS policies are created
- **Files**: All files in `supabase/migrations/` (14 migration files)
- **Time**: 5-10 minutes

#### Task 0.5: Deploy Edge Functions

- **Commands**:
  ```bash
      # Deploy all functions
      supabase functions deploy ai-analyze
      supabase functions deploy ai-chatbot
      supabase functions deploy generate-reading
      supabase functions deploy send-verification-email
  ```




- **Files**: All files in `supabase/functions/`
- **Time**: 10-15 minutes

#### Task 0.6: Set Edge Function Environment Variables

- **Action**: Set secrets in new Supabase project
- **Commands**:
  ```bash
      # Set secrets via CLI
      supabase secrets set LOVABLE_API_KEY=your-lovable-api-key
      supabase secrets set RESEND_API_KEY=your-resend-api-key
  ```




- **Alternative**: Set in Supabase Dashboard → Project Settings → Edge Functions → Secrets
- **Time**: 5 minutes

#### Task 0.7: Create Storage Buckets

- **Action**: Create required storage buckets in new project
- **Method 1 (Dashboard)**:

1. Go to Storage in Supabase Dashboard
2. Create bucket: `payment-receipts` (private)
3. Create bucket: `question-images` (public)

- **Method 2 (SQL)**:
  ```sql
      -- Create payment-receipts bucket (private)
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('payment-receipts', 'payment-receipts', false)
      ON CONFLICT (id) DO NOTHING;
      
      -- Create question-images bucket (public)
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('question-images', 'question-images', true)
      ON CONFLICT (id) DO NOTHING;
  ```




- **Files**: Storage policies should be created by migrations (`20260104060738_*.sql`, `20260105110319_*.sql`)
- **Time**: 5 minutes

#### Task 0.8: Set Up Storage Policies

- **Action**: Verify storage policies exist (should be created by migrations)
- **Files**: 
- `supabase/migrations/20260104060738_*.sql` (payment-receipts policies)
- `supabase/migrations/20260105110319_*.sql` (question-images policies)
- **Verification**: Check in Supabase Dashboard → Storage → Policies
- **Time**: 5 minutes

#### Task 0.9: Seed Initial Data (Optional)

- **Action**: Create initial admin user and sample data if needed
- **File**: `supabase/migrations/20260208000005_seed_initial_admin.sql` (will be created in Phase 1)
- **SQL Example**:
  ```sql
      -- Insert admin role for a user (replace with actual user_id)
      INSERT INTO user_roles (user_id, role)
      VALUES ('user-uuid-here', 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
  ```




- **Time**: 10 minutes

#### Task 0.10: Update Frontend Environment Variables

- **Action**: Update frontend environment variables
- **For Local Development**:
- Update `.env.local` with new `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Restart dev server
- **For Production**:
- Update environment variables in hosting platform (Vercel, Netlify, etc.)
- Redeploy frontend
- **Files**: `.env.local` (local), hosting platform settings (production)
- **Time**: 5 minutes

#### Task 0.11: Verify Connection

- **Commands**:
  ```bash
      # Test database connection
      supabase db ping
      
      # Test functions
      supabase functions list
      
      # Test from frontend
      # Open app and verify login/signup works
  ```




- **Verification Checklist**:
- [ ] Database connection works
- [ ] All edge functions deployed
- [ ] Storage buckets created
- [ ] Frontend can connect to new Supabase
- [ ] Authentication works (signup/login)
- [ ] Edge functions can be invoked
- **Time**: 10 minutes

#### Task 0.12: Data Migration (If Needed)

- **Action**: If migrating existing data from old project
- **Options**:

1. **Manual Export/Import**: Export data from old project, import to new
2. **Supabase CLI**: Use `supabase db dump` and `supabase db restore`
3. **Custom Script**: Write migration script for specific tables

- **Note**: Auth users won't transfer automatically - users need to sign up again
- **Time**: 30-60 minutes (if needed)

**Phase 0 Total**: ~2-3 hours (without data migration)**Important Notes**:

- Complete Phase 0 before starting Phase 1
- All subsequent phases assume you're working with the new Supabase project
- Keep old project as backup until migration is verified
- Document new project credentials securely

---

### Phase 1 – Critical Functionality (Week 1)

**Goal**: Make app work reliably with basic security

#### Task 1.1: Enable JWT Verification

- **Files**: `supabase/config.toml`
- **Change**: Set `verify_jwt = true` for all functions
- **Test**: Verify all functions still work
- **Time**: 2 hours

#### Task 1.2: Fix Super Admin Check

- **Files**: 
- `supabase/migrations/20260208000005_seed_initial_admin.sql` (new)
- `src/hooks/useAuth.tsx`
- **Change**: 
- Create migration to seed admin
- Remove hardcoded email check
- Use `has_role()` RPC instead
- **Test**: Verify admin access works
- **Time**: 3 hours

#### Task 1.3: Add Input Validation

- **Files**: 
- `supabase/functions/shared/validation.ts` (new)
- All edge functions
- **Change**: 
- Create Zod schemas for all requests
- Add validation to all functions
- **Test**: Verify invalid requests are rejected
- **Time**: 8 hours

#### Task 1.4: Standardize Error Handling

- **Files**: 
- `supabase/functions/shared/errors.ts` (new)
- All edge functions
- **Change**: 
- Create error utility
- Standardize error format
- **Test**: Verify error responses are consistent
- **Time**: 4 hours

#### Task 1.5: Add Missing Database Indexes

- **File**: `supabase/migrations/20260208000002_add_missing_indexes.sql`
- **Change**: Add indexes (see Section 3)
- **Test**: Verify query performance improved
- **Time**: 1 hour

**Phase 1 Total**: ~18 hours

### Phase 2 – Stability & Data Integrity (Week 2)

**Goal**: Ensure data consistency and reliability

#### Task 2.1: Fix Subscription Fields

- **File**: `supabase/migrations/20260208000000_fix_subscription_fields.sql`
- **Change**: Consolidate fields, add constraints
- **Test**: Verify constraints work
- **Time**: 3 hours

#### Task 2.2: Add Missing Foreign Keys

- **File**: `supabase/migrations/20260208000001_add_missing_foreign_keys.sql`
- **Change**: Add FKs (see Section 3)
- **Test**: Verify referential integrity
- **Time**: 2 hours

#### Task 2.3: Add Business Rule Constraints

- **File**: `supabase/migrations/20260208000003_add_business_constraints.sql`
- **Change**: Add CHECK constraints
- **Test**: Verify constraints prevent invalid data
- **Time**: 2 hours

#### Task 2.4: Implement Subscription Expiration Job

- **Files**: 
- `supabase/functions/cron/expire-subscriptions/index.ts` (new)
- Supabase Cron configuration
- **Change**: 
- Create function to expire subscriptions
- Schedule daily execution
- **Test**: Verify subscriptions expire correctly
- **Time**: 6 hours

#### Task 2.5: Add Payment Approval Validation

- **File**: `supabase/migrations/20260208000006_fix_approve_payment.sql`
- **Change**: Add status check, idempotency
- **Test**: Verify duplicate approvals prevented
- **Time**: 2 hours

#### Task 2.6: Fix JSON Parsing

- **Files**: 
- `supabase/functions/shared/utils.ts` (new)
- `supabase/functions/ai-analyze/index.ts`
- **Change**: 
- Create `extractJson()` utility
- Replace regex parsing
- **Test**: Verify JSON extraction works
- **Time**: 2 hours

**Phase 2 Total**: ~17 hours

### Phase 3 – Security & Hardening (Week 3)

**Goal**: Secure the application against attacks

#### Task 3.1: Add Permission Checks to Edge Functions

- **Files**: 
- `supabase/functions/shared/auth.ts` (new)
- All edge functions
- **Change**: 
- Create `verifyAdmin()` helper
- Add checks to admin operations
- **Test**: Verify unauthorized access blocked
- **Time**: 4 hours

#### Task 3.2: Fix CORS Configuration

- **Files**: All edge functions
- **Change**: Restrict to specific origins
- **Test**: Verify CORS works correctly
- **Time**: 2 hours

#### Task 3.3: Add Input Sanitization

- **Files**: 
- `supabase/functions/shared/sanitize.ts` (new)
- All edge functions
- **Change**: 
- Create sanitization utilities
- Sanitize all user input
- **Test**: Verify XSS prevention
- **Time**: 4 hours

#### Task 3.4: Implement Rate Limiting

- **Files**: 
- `supabase/functions/shared/rate-limit.ts` (new)
- All edge functions
- **Change**: 
- Create rate limiting utility
- Add limits to AI functions
- **Test**: Verify rate limits work
- **Time**: 8 hours

#### Task 3.5: Add Email Validation

- **Files**: 
- `supabase/functions/send-verification-email/index.ts`
- `supabase/functions/shared/validation.ts`
- **Change**: Validate email format
- **Test**: Verify invalid emails rejected
- **Time**: 1 hour

**Phase 3 Total**: ~19 hours

### Phase 4 – Scaling & Optimization (Week 4)

**Goal**: Prepare for scale and improve performance

#### Task 4.1: Implement Health Check

- **File**: `supabase/functions/health/index.ts` (new)
- **Change**: Create health check endpoint
- **Test**: Verify health checks work
- **Time**: 3 hours

#### Task 4.2: Add Logging Infrastructure

- **Files**: 
- `supabase/functions/shared/logger.ts` (new)
- All edge functions
- **Change**: 
- Create logging utility
- Add structured logging
- **Test**: Verify logs are captured
- **Time**: 6 hours

#### Task 4.3: Optimize Feature Gating Query

- **Files**: 
- `supabase/migrations/20260208000007_optimize_feature_gating.sql`
- `src/hooks/useFeatureGating.tsx`
- **Change**: 
- Add `practice_count` column to profiles
- Update query to use counter
- **Test**: Verify performance improved
- **Time**: 4 hours

#### Task 4.4: Implement Reading Passage Caching

- **Files**: 
- `supabase/migrations/20260208000008_create_reading_passages_table.sql`
- `supabase/functions/generate-reading/index.ts`
- **Change**: 
- Create `reading_passages` table
- Cache generated passages
- **Test**: Verify caching works
- **Time**: 6 hours

#### Task 4.5: Add Retry Logic for AI Calls

- **Files**: 
- `supabase/functions/shared/ai-client.ts` (new)
- All edge functions using AI
- **Change**: 
- Create AI client with retry logic
- Add exponential backoff
- **Test**: Verify retries work
- **Time**: 4 hours

#### Task 4.6: Implement Renewal Reminders

- **File**: `supabase/functions/cron/send-renewal-reminders/index.ts` (new)
- **Change**: Create reminder job
- **Test**: Verify reminders sent
- **Time**: 4 hours

**Phase 4 Total**: ~27 hours

### Phase 5 – RAG & Semantic Search Enhancement (Post-Launch Feature)

**Goal**: Implement retrieval-augmented generation using embeddings to improve AI grading quality by finding similar past exam questions**When to Do This**: After all core backend functionality is production-ready (Phases 1-4 complete)

#### Task 5.1: Enable pgvector Extension

- **File**: `supabase/migrations/20260209000000_enable_pgvector.sql` (new)
- **Change**: 
- Enable pgvector extension for vector similarity search
- Verify extension is available
- **SQL**:
  ```sql
      CREATE EXTENSION IF NOT EXISTS vector;
      SELECT * FROM pg_extension WHERE extname = 'vector';
  ```




- **Test**: Verify extension is enabled
- **Time**: 15 minutes

#### Task 5.2: Add Embedding Columns to ielts_library

- **File**: `supabase/migrations/20260209000001_add_embeddings_to_ielts_library.sql` (new)
- **Change**: 
- Add `question_embedding vector(1536)` column
- Add `answer_embedding vector(1536)` column (optional)
- Create ivfflat index for fast similarity search
- **SQL**:
  ```sql
      ALTER TABLE public.ielts_library 
      ADD COLUMN question_embedding vector(1536),
      ADD COLUMN answer_embedding vector(1536);
      
      CREATE INDEX idx_ielts_library_question_embedding 
      ON public.ielts_library 
      USING ivfflat (question_embedding vector_cosine_ops)
      WITH (lists = 100);
  ```




- **Test**: Verify columns and index created
- **Time**: 30 minutes

#### Task 5.3: Create Embedding Generation Function

- **File**: `supabase/functions/generate-embeddings/index.ts` (new)
- **Change**: 
- Create edge function to generate embeddings using OpenAI API
- Accept question text and optional answer text
- Store embeddings in database
- Handle batch processing for backfilling
- **Features**:
- Generate embeddings for questions
- Generate embeddings for model answers (optional)
- Update existing records or create new ones
- Batch processing support
- **Environment Variables**: Requires `OPENAI_API_KEY` secret
- **Test**: Generate embedding for test question, verify storage
- **Time**: 4 hours

#### Task 5.4: Create Similarity Search Function

- **File**: `supabase/migrations/20260209000002_create_similarity_search_function.sql` (new)
- **Change**: 
- Create PostgreSQL function to find similar questions using vector similarity
- Support filtering by task_type
- Return similarity scores
- Optional: Weight by user struggle frequency
- **SQL Function**:
  ```sql
      CREATE OR REPLACE FUNCTION find_similar_questions(
        user_question_embedding vector(1536),
        task_type_filter TEXT,
        similarity_threshold FLOAT DEFAULT 0.7,
        limit_count INT DEFAULT 5
      )
      RETURNS TABLE (
        id UUID,
        title TEXT,
        question_prompt TEXT,
        model_answer_band9 TEXT,
        similarity FLOAT
      )
  ```




- **Test**: Query with test embedding, verify results
- **Time**: 2 hours

#### Task 5.5: Create User Struggles Tracking Table

- **File**: `supabase/migrations/20260209000003_create_user_struggles_table.sql` (new)
- **Change**: 
- Create table to track which questions users struggle with
- Store error patterns and band scores
- Enable finding "commonly struggled with" questions
- **Table Structure**:
  ```sql
      CREATE TABLE public.user_struggles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id),
        question_id UUID REFERENCES ielts_library(id),
        submission_content TEXT,
        band_score DECIMAL(2,1),
        error_patterns JSONB,
        created_at TIMESTAMPTZ DEFAULT now()
      );
  ```




- **RLS**: Add policies for user data access
- **Test**: Insert test struggle record, verify RLS works
- **Time**: 1 hour

#### Task 5.6: Update AI Analysis Function to Use Similar Questions

- **File**: `supabase/functions/ai-analyze/index.ts`
- **Change**: 
- Generate embedding for user's question/essay
- Query similar questions using similarity search function
- Inject top 3-5 similar questions into AI prompt
- Include their model answers for context
- Enhance grading with similar question context
- **Integration Points**:
- Call embedding generation for user input
- Call `find_similar_questions` RPC function
- Enhance prompt with similar questions section
- **Test**: Submit essay, verify similar questions are found and used
- **Time**: 6 hours

#### Task 5.7: Backfill Embeddings for Existing Questions

- **File**: `supabase/functions/generate-embeddings/index.ts` (enhance existing)
- **Change**: 
- Create batch processing script
- Generate embeddings for all existing questions in `ielts_library`
- Handle rate limiting and errors
- Progress tracking
- **Implementation**:
- Query all questions without embeddings
- Process in batches (e.g., 10 at a time)
- Update database with embeddings
- Log progress
- **Test**: Run backfill, verify all questions have embeddings
- **Time**: 3 hours (depends on number of questions)

#### Task 5.8: Add Similarity Search to Frontend (Optional Enhancement)

- **Files**: 
- `src/pages/dashboard/WritingModule.tsx`
- `src/components/SimilarQuestions.tsx` (new)
- **Change**: 
- Display similar questions to user after grading
- Show "Other students struggled with similar questions" section
- Link to similar questions for practice
- **Test**: Verify UI displays similar questions
- **Time**: 4 hours

#### Task 5.9: Optimize Similarity Search Performance

- **File**: `supabase/migrations/20260209000004_optimize_similarity_search.sql` (new)
- **Change**: 
- Tune ivfflat index parameters based on data size
- Add composite indexes if needed
- Create materialized view for commonly struggled questions (optional)
- **Optimization**:
- Adjust `lists` parameter in ivfflat index
- Monitor query performance
- Add EXPLAIN ANALYZE queries
- **Test**: Measure query performance, verify < 100ms for similarity search
- **Time**: 2 hours

#### Task 5.10: Add Embedding Generation to Question Creation Flow

- **Files**: 
- `src/pages/admin/ContentManager.tsx`
- `supabase/functions/generate-embeddings/index.ts`
- **Change**: 
- Automatically generate embeddings when admin creates/updates questions
- Call embedding function after question save
- Handle errors gracefully (don't block question creation)
- **Test**: Create new question, verify embedding is generated
- **Time**: 2 hours

**Phase 5 Total**: ~25 hours**Dependencies**:

- Requires Phases 1-4 to be complete
- Requires OpenAI API key (for embeddings)
- Requires existing questions in `ielts_library` table

**Benefits**:

- Improved AI grading quality through context from similar questions
- Personalized feedback based on past exam patterns
- Scalable as more past exams are added
- Tracks common student struggles for content improvement

---

### Summary

**Total Estimated Time**:

- Phase 0: ~2-3 hours (if migrating to new Supabase)
- Phases 1-4: ~81 hours (~2 weeks for 1 developer)
- Phase 5: ~25 hours (RAG/embeddings feature - post-launch)
- **Total**: ~83-84 hours (core) + 25 hours (enhancement) if migration is needed

**Critical Path**:

0. Phase 0 (Supabase Migration) - **PREREQUISITE** (only if switching projects)
1. Phase 1 (Security fixes) - **MUST DO FIRST**
2. Phase 2 (Data integrity) - **MUST DO BEFORE LAUNCH**
3. Phase 3 (Security hardening) - **RECOMMENDED BEFORE LAUNCH**
4. Phase 4 (Optimization) - **CAN BE DONE POST-LAUNCH**
5. Phase 5 (RAG/Embeddings) - **POST-LAUNCH ENHANCEMENT** (requires Phases 1-4 complete)

**Dependencies**:

- Phase 0 must be completed before Phase 1 if migrating to new Supabase
- Phase 1 must be completed before Phases 2 and 3
- Phase 2 depends on Phase 1 (need validation in place)
- Phase 3 depends on Phase 1 (need auth in place)
- Phase 4 can be done independently
- Phase 5 depends on Phases 1-4 being complete (requires stable backend)

**Risk Assessment**:

- **High Risk**: Phase 1 tasks (security vulnerabilities)
- **Medium Risk**: Phase 2 tasks (data integrity)