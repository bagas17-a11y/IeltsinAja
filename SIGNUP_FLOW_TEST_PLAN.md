# Comprehensive Signup Flow Test Plan

## Test Execution Date: 2026-02-15

---

## Phase 1: Pre-Test Setup Validation

### 1.1 Database Schema Check
- [ ] Verify `profiles` table has all required columns
- [ ] Verify `phone_number` column exists
- [ ] Verify `subscription_end_date` exists (not subscription_expires_at)
- [ ] Verify constraints are in place
- [ ] Verify triggers are active

### 1.2 Edge Functions Check
- [ ] Verify all 4 edge functions deployed
- [ ] Verify JWT verification enabled
- [ ] Verify secrets set (ANTHROPIC_API_KEY, RESEND_API_KEY)
- [ ] Check function logs for recent errors

### 1.3 Frontend Compilation Check
- [ ] Run TypeScript type check
- [ ] Check for import errors
- [ ] Verify all components compile

---

## Phase 2: Signup Flow Tests

### Test Case 1: New User Signup (Happy Path)
**Steps:**
1. Navigate to /auth?mode=signup
2. Fill in:
   - Full Name: "Test User"
   - Phone: "081234567890"
   - Email: "test@example.com"
   - Password: "password123"
3. Submit form
4. Expect: Redirect to /verify-email?email=test@example.com
5. Enter OTP code from email
6. Expect: Redirect to /pricing-selection
7. Check database: profile created with phone_number

**Expected Results:**
- ✅ Form validation passes
- ✅ API call succeeds
- ✅ Email sent with OTP
- ✅ Redirect to verification page
- ✅ OTP verification succeeds
- ✅ Session established
- ✅ Profile created in database with phone_number

### Test Case 2: Email Validation
**Steps:**
1. Try invalid emails:
   - "notanemail" → Should show error
   - "test@" → Should show error
   - "test@example" → Should show error
2. Try valid email: "test@example.com" → Should accept

**Expected Results:**
- ✅ Frontend validation catches invalid emails
- ✅ Clear error messages shown

### Test Case 3: Phone Number Validation (Indonesian Format)
**Steps:**
1. Try invalid phones:
   - "123" → Should show error
   - "081" → Should show error (too short)
   - "08123456789012345" → Should show error (too long)
   - "071234567890" → Should show error (must start with 08)
2. Try valid phones:
   - "081234567890" → Should accept
   - "0812345678" → Should accept
   - "+6281234567890" → Should accept

**Expected Results:**
- ✅ Regex validation works correctly
- ✅ Clear error messages shown

### Test Case 4: Password Validation
**Steps:**
1. Try short password: "12345" → Should show error
2. Try valid password: "password123" → Should accept

**Expected Results:**
- ✅ Minimum 6 characters enforced

### Test Case 5: OTP Verification
**Steps:**
1. Complete signup flow
2. Try invalid OTP: "123" → Should show error (too short)
3. Try invalid OTP: "999999" → Should show error (wrong code)
4. Try valid OTP from email → Should succeed

**Expected Results:**
- ✅ Code length validation (6-8 digits)
- ✅ Invalid code rejected
- ✅ Valid code accepted
- ✅ Session established

### Test Case 6: Resend OTP Code
**Steps:**
1. Complete signup flow
2. Click "Resend code"
3. Wait for new email
4. Enter new code

**Expected Results:**
- ✅ New code sent
- ✅ New code works
- ✅ Old code invalidated

### Test Case 7: Duplicate Email Prevention
**Steps:**
1. Sign up with email: "test@example.com"
2. Try to sign up again with same email
3. Expect: Error message "Email already registered"

**Expected Results:**
- ✅ Duplicate prevented
- ✅ Clear error message

### Test Case 8: Profile Creation Trigger
**Steps:**
1. Complete signup
2. Check database:
   - `auth.users` table has user
   - `profiles` table has matching profile
   - Profile has: full_name, email, phone_number, is_verified=false

**Expected Results:**
- ✅ Profile auto-created by trigger
- ✅ All fields populated correctly
- ✅ Default values set (free tier, is_verified=false)

---

## Phase 3: Login Flow Tests

### Test Case 9: Login After Signup (Unverified)
**Steps:**
1. Complete signup but DON'T verify payment
2. Log out
3. Log back in with email/password
4. Expect: Redirect to /waiting-room

**Expected Results:**
- ✅ Login succeeds
- ✅ Redirect to waiting room (not dashboard)
- ✅ Session established

### Test Case 10: Login After Verification (Verified)
**Steps:**
1. Admin approves payment (set is_verified=true)
2. User logs in
3. Expect: Redirect to /dashboard

**Expected Results:**
- ✅ Login succeeds
- ✅ Redirect to dashboard
- ✅ Can access all features

### Test Case 11: Admin Login
**Steps:**
1. Log in as admin: bagasshryo@gmail.com
2. Expect: Redirect to /dashboard
3. Check: Admin pages accessible

**Expected Results:**
- ✅ Admin access granted
- ✅ Can access /admin/users
- ✅ Bypass waiting room

---

## Phase 4: Edge Cases

### Test Case 12: Session Persistence
**Steps:**
1. Log in
2. Refresh page
3. Expect: Still logged in

**Expected Results:**
- ✅ Session persists across refreshes
- ✅ No re-login required

### Test Case 13: Expired Session
**Steps:**
1. Log in
2. Wait for session to expire (or manually delete tokens)
3. Try to use app
4. Expect: Redirect to /auth

**Expected Results:**
- ✅ Expired session detected
- ✅ Clean redirect to login

### Test Case 14: Network Errors
**Steps:**
1. Try signup with network disabled
2. Expect: Clear error message

**Expected Results:**
- ✅ Error caught and displayed
- ✅ No crashes

---

## Phase 5: Database Integrity Tests

### Test Case 15: Foreign Key Constraints
**Query:**
```sql
-- Check for orphaned profiles
SELECT * FROM profiles WHERE user_id NOT IN (SELECT id FROM auth.users);
```

**Expected Results:**
- ✅ No orphaned profiles

### Test Case 16: Subscription Field Consistency
**Query:**
```sql
-- Check elite users don't have expiration
SELECT * FROM profiles WHERE subscription_tier = 'elite' AND subscription_end_date IS NOT NULL;

-- Check pro users have expiration
SELECT * FROM profiles WHERE subscription_tier = 'pro' AND subscription_end_date IS NULL;
```

**Expected Results:**
- ✅ Elite users: no expiration
- ✅ Pro users: have expiration

---

## Automated Test Commands

### Check TypeScript Errors
```bash
cd /Users/abhinavjinka/Documents/IeltsinAja
npm run type-check || echo "Type check failed"
```

### Check Build
```bash
npm run build || echo "Build failed"
```

### Check Database Schema
```bash
supabase db diff --linked
```

### Check Edge Function Logs
```bash
supabase functions logs ai-analyze --limit 10
supabase functions logs generate-reading --limit 10
```

---

## Success Criteria

✅ **All test cases pass**
✅ **No TypeScript errors**
✅ **No console errors**
✅ **Database schema matches code**
✅ **All edge functions deployed and working**
✅ **Session management working correctly**
✅ **Admin access control working**

---

## Error Tracking

Errors will be documented below as they're found:

### Errors Found:
1. [To be filled during testing]

### Fixes Applied:
1. [To be filled during testing]
