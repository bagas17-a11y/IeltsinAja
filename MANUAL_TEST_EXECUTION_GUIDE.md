# Manual Test Execution Guide - Signup Flow

## Prerequisites ✅
- [x] TypeScript compiles successfully (npm run build)
- [x] All 7 edge functions deployed and ACTIVE
- [x] Database migrations deployed (including trigger improvements and phone validation)
- [x] All critical code fixes applied:
  - isAdmin added to WaitingRoom.tsx
  - isAdmin added to UserManagement.tsx
  - subscription_expires_at removed from all code
  - phone_number added to Profile interface
  - Auth state race condition fixed
  - Trigger error handling improved

---

## Test Execution Instructions

### STEP 1: Pre-Test Database Validation (5 minutes)

**Action:** Open Supabase SQL Editor and run the "Quick Health Check Query" from `database_validation_queries.sql`

```sql
-- Copy and paste the "QUICK HEALTH CHECK QUERY" section
```

**Expected Result:**
```
overall_status: ✅ ALL CHECKS PASSED
total_users: [number]
total_profiles: [same number]
users_without_profiles: 0
elite_with_expiration_violations: 0
admin_count: 1 (or more)
invalid_phone_numbers: 0
```

**If any issues found:** Run the detailed validation queries in sections 1-10

---

### STEP 2: Fresh Signup Flow Test (10 minutes)

#### Test 2.1: Navigate to Signup Page
1. Open browser in **Incognito/Private mode** (to avoid cache)
2. Go to: `http://localhost:5173/auth?mode=signup`
3. **Expected:** Signup form displayed with:
   - Full Name field
   - Phone Number field (with Indonesian flag icon)
   - Email field
   - Password field
   - Show/hide password button
   - "Create Account" button

#### Test 2.2: Frontend Validation Testing
**Test invalid inputs:**

| Field | Input | Expected Error |
|-------|-------|----------------|
| Email | "notanemail" | "Please enter a valid email address" |
| Email | "test@" | "Please enter a valid email address" |
| Password | "12345" | "Password must be at least 6 characters" |
| Phone | "123" | "Phone number must be at least 10 digits" |
| Phone | "071234567890" | "Please enter a valid Indonesian phone number" |

**✅ Success Criteria:** All validation errors display correctly

#### Test 2.3: Valid Signup
**Fill in:**
- Full Name: `Test User [Your Name]`
- Phone: `081234567890`
- Email: `test_[timestamp]@example.com` (use unique email each time)
- Password: `password123`

**Click "Create Account"**

**Expected Behavior:**
1. Button shows "Please wait..."
2. Toast notification: "Check your email! We sent you a 6-digit verification code"
3. **Redirect to:** `/verify-email?email=test_[timestamp]@example.com`

**✅ Success Criteria:**
- No errors in browser console (press F12 → Console tab)
- Redirect successful
- Email parameter in URL correct

---

### STEP 3: Email Verification (5 minutes)

#### Test 3.1: Check Email
1. Open your email inbox
2. **Expected:** Email from IELTSinAja with subject "Your IELTSinAja verification code"
3. **Expected:** Email contains an 8-digit code (e.g., `12345678`)

**⚠️ Note:** Supabase sends 8-digit codes by default, page accepts 6-8 digits

#### Test 3.2: Invalid Code Tests
1. Enter `123` → **Expected:** "Invalid code" error (too short)
2. Enter `999999` → **Expected:** "Verification failed: Invalid or expired code"

#### Test 3.3: Valid Code Verification
1. Enter the 8-digit code from email
2. Click "Verify Email"
3. **Expected:**
   - Button shows "Verifying..."
   - Toast: "Email verified! Your account is now active."
   - **Redirect to:** `/pricing-selection`

**✅ Success Criteria:**
- No console errors
- Successful redirect
- Session established (check DevTools → Application → Local Storage → `sb-[project]-auth-token` exists)

---

### STEP 4: Database Verification (3 minutes)

**Action:** Run this query in Supabase SQL Editor:

```sql
-- Check the user you just created
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.phone_number,
  p.subscription_tier,
  p.is_verified,
  p.created_at
FROM auth.users u
JOIN public.profiles p ON p.user_id = u.id
WHERE u.email = 'test_[timestamp]@example.com';
```

**✅ Expected Results:**
- ✅ User exists in `auth.users`
- ✅ Profile exists in `public.profiles`
- ✅ `email_confirmed_at` is set (not null)
- ✅ `full_name` = "Test User [Your Name]"
- ✅ `phone_number` = "081234567890"
- ✅ `subscription_tier` = "free"
- ✅ `is_verified` = false (payment not yet approved)

---

### STEP 5: Login Flow Test (5 minutes)

#### Test 5.1: Logout
1. From pricing selection page, navigate to `/auth`
2. Or click logout if available
3. **Expected:** Redirected to login page

#### Test 5.2: Login (Unverified User)
1. Enter email: `test_[timestamp]@example.com`
2. Enter password: `password123`
3. Click "Sign In"
4. **Expected:**
   - Toast: "Welcome back! Successfully logged in."
   - **Redirect to:** `/waiting-room` (NOT /dashboard because is_verified=false)

**✅ Success Criteria:**
- Login succeeds
- Redirect to waiting room (not dashboard)
- Waiting room page displays:
  - "Verification in Progress" message
  - User's email shown
  - "Sign Out" button works

---

### STEP 6: Admin Verification Simulation (3 minutes)

**Action:** Manually approve the user in Supabase SQL Editor:

```sql
-- Manually verify the user (simulates admin payment approval)
UPDATE public.profiles
SET is_verified = true
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'test_[timestamp]@example.com'
);
```

**Verify:**
```sql
-- Check verification status
SELECT email, is_verified
FROM public.profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test_[timestamp]@example.com');
```

**Expected:** `is_verified` = true

---

### STEP 7: Verified User Login Test (3 minutes)

1. **Logout** from waiting room
2. **Login again** with same credentials
3. **Expected:**
   - **Redirect to:** `/dashboard` (NOT /waiting-room)
   - Dashboard loads successfully
   - User can access all modules (Reading, Listening, Writing, Speaking)

**✅ Success Criteria:**
- Verified users go to dashboard
- No errors loading dashboard
- All navigation works

---

### STEP 8: Reading Test Generation (JWT Authentication) (5 minutes)

**This tests the 401 error fix we implemented**

1. From dashboard, click "Reading" module
2. Select difficulty: "Medium"
3. Click "Generate Test"
4. **Watch browser console** (F12 → Console)

**Expected Console Logs:**
```
Session exists: true
Access token exists: true
User email confirmed: [date]
Token expires at: [date/time]
```

**Expected Result:**
- ✅ No 401 errors
- ✅ Reading passage generates successfully
- ✅ Timer starts (20:00)
- ✅ 13 questions displayed

**If 401 error occurs:**
- Check console logs for session details
- Try: Logout → Login → Try again
- Check edge function logs: `supabase functions logs generate-reading`

---

### STEP 9: Admin Access Test (3 minutes)

#### Test 9.1: Admin Login
1. Logout
2. Login as admin: `bagasshryo@gmail.com` (password: [admin password])
3. **Expected:** Redirect to `/dashboard`

#### Test 9.2: Admin Panel Access
1. Navigate to `/admin/users`
2. **Expected:**
   - User management page loads
   - List of all users displayed
   - Can see the test user you created
   - Filter and search work

**✅ Success Criteria:**
- Admin can access admin pages
- Non-admin cannot access admin pages (tested in Step 5)
- isAdmin check working correctly

---

### STEP 10: Comprehensive Browser Console Check (2 minutes)

**Throughout all tests, check for:**
- ❌ No red errors in console
- ⚠️ Warnings are acceptable (chunk size, etc.)
- ✅ All API calls return 200 or 201
- ✅ No authentication failures
- ✅ No TypeScript errors

---

## Test Results Summary

Fill this out as you test:

| Test | Status | Notes |
|------|--------|-------|
| 1. Database Health Check | ☐ | |
| 2.1 Signup Page Loads | ☐ | |
| 2.2 Form Validation | ☐ | |
| 2.3 Valid Signup | ☐ | |
| 3.1 Email Received | ☐ | |
| 3.2 Invalid Code Handling | ☐ | |
| 3.3 Valid Code Verification | ☐ | |
| 4. Database Profile Created | ☐ | |
| 5.1 Logout Works | ☐ | |
| 5.2 Unverified Login → Waiting Room | ☐ | |
| 6. Admin Verification | ☐ | |
| 7. Verified Login → Dashboard | ☐ | |
| 8. Reading Test Generation (JWT) | ☐ | |
| 9.1 Admin Login | ☐ | |
| 9.2 Admin Panel Access | ☐ | |
| 10. Console Clean | ☐ | |

---

## Common Issues & Solutions

### Issue: "Email rate limit exceeded"
**Solution:**
- Wait 10 minutes before retrying
- Or disable email confirmation in Supabase temporarily for testing
- Or use different email addresses

### Issue: 401 Unauthorized on edge functions
**Solution:**
1. Check browser console for session details
2. Logout → Login again to refresh JWT token
3. Check if email is confirmed: `SELECT email_confirmed_at FROM auth.users WHERE email = '...'`
4. Verify edge function has JWT verification enabled

### Issue: Profile not created after signup
**Solution:**
1. Check trigger exists: Run query from `database_validation_queries.sql` section 3
2. Check recent errors in Supabase logs
3. Manually create profile if needed

### Issue: Phone number validation failing
**Solution:**
- Use format: `081234567890` (starts with 08)
- Or: `+6281234567890` (starts with +62)
- Must be 10-15 digits total

---

## After Testing: Report Back

**Please report:**
1. ✅ Which tests passed
2. ❌ Which tests failed
3. 📝 Any console errors (screenshot or copy-paste)
4. 📝 Any unexpected behavior
5. 📝 Database validation query results

**Format:**
```
Test Results:
✅ Tests 1-7: All passed
❌ Test 8: 401 error on reading generation
Console Error: [paste error here]
```

This will allow me to fix any remaining issues in the next loop iteration!
