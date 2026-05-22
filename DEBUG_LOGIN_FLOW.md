# Complete Login Debug Flow Guide

## What I Fixed

I've added **comprehensive logging** to the Redux auth slice to track exactly where your user data is being lost.

## How Cookies Work (Will NOT be gone on refresh)

### On First Login:
1. ✅ Login successful
2. ✅ User data saved to cookies: `user_data`, `auth_token`, `refresh_token`
3. ✅ Redux state updated with user

### On Page Refresh:
1. ✅ App mounts and calls `useAuthVerify()`
2. ✅ This triggers `checkAuth` thunk
3. ✅ `checkAuth` **reads cookies** and restores Redux state
4. ✅ User stays logged in

**Cookies will NOT be gone** unless you manually clear them or logout.

---

## How to Debug the User Data Issue

### Step 1: Open Developer Tools
1. Press `F12` (or `Ctrl+Shift+I`)
2. Go to the **Console** tab
3. Look for logs starting with: 🔐📤📨🔍✅❌⏳

### Step 2: Login and Watch Console Logs

Enter test credentials and click Login. You'll see this sequence:

```
🔐 Attempting login with email: your@email.com
📤 Sending login request: {email: "...", password: "..."}
📨 Raw response received: {data: {...}, status: 200, ...}
📨 response.data: {...}
📨 response.data.data: {...}
🔍 Auth data extracted: {...}
🔍 User in authData: {...}
🔍 Token in authData: present
🔍 RefreshToken in authData: present
✅ All fields present, saving to cookies
✅ Cookies saved. Returning auth data to Redux: {...}
⏳ loginUser.pending
✅ loginUser.fulfilled - action.payload: {...}
✅ loginUser.fulfilled - action.payload.user: {...}
✅ Setting user in Redux state: {...}
```

### Step 3: Check Each Log for Problems

| Log | What It Checks |
|-----|----------------|
| `📨 response.data.data` | Is your backend returning the right structure? |
| `🔍 User in authData` | Is the user object present? |
| `🔍 Token in authData` | Is the token present? |
| `🔍 RefreshToken in authData` | Is the refresh token present? |
| `❌ Missing required auth fields` | Backend response is incomplete |
| `✅ Setting user in Redux state` | User was successfully saved to Redux |

---

## Expected Console Output

### Success Case:
```
🔐 Attempting login with email: user@example.com
📤 Sending login request: {...}
📨 Raw response received: {...}
📨 response.data: {data: {user: {...}, token: "...", refreshToken: "..."}}
📨 response.data.data: {user: {...}, token: "...", refreshToken: "..."}
🔍 Auth data extracted: {user: {...}, token: "...", refreshToken: "..."}
🔍 User in authData: {id: "...", email: "...", name: "...", role: "ADMIN"}
🔍 Token in authData: present
🔍 RefreshToken in authData: present
✅ All fields present, saving to cookies
✅ Cookies saved. Returning auth data to Redux: {...}
⏳ loginUser.pending
✅ loginUser.fulfilled - action.payload: {user: {...}, token: "...", refreshToken: "..."}
✅ loginUser.fulfilled - action.payload.user: {id: "...", email: "...", ...}
✅ Setting user in Redux state: {id: "...", email: "...", ...}
```

### Problem Case: Missing User
```
🔐 Attempting login with email: user@example.com
📨 Raw response received: {...}
📨 response.data.data: {token: "...", refreshToken: "..."}  // ❌ NO USER!
🔍 User in authData: undefined  // ❌ PROBLEM!
❌ Missing required auth fields: {user: false, token: true, refreshToken: true}
```

### Problem Case: Wrong Response Structure
```
📨 response.data.data: undefined  // ❌ Not double-wrapped!
🔍 Auth data extracted: undefined
```

---

## Possible Issues & Solutions

### Issue 1: "user is null and isAuthenticated is false"

**Root Causes:**
1. Backend is not returning user object
2. Response structure is different
3. User object has no `id` field

**How to Fix:**
1. Check the 📨 logs to see actual response
2. Verify your backend returns:
```json
{
  "data": {
    "user": {
      "id": "some-id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "ADMIN"
    },
    "token": "jwt-token-here",
    "refreshToken": "jwt-refresh-token"
  }
}
```

### Issue 2: "Backend sends flat response (no double wrap)"

If your backend returns:
```json
{
  "user": {...},
  "token": "...",
  "refreshToken": "..."
}
```

Instead of double-wrapped. The code handles this automatically with:
```typescript
let authData = response.data.data || response.data;
```

So both structures work.

### Issue 3: "Redux state updated but user still null"

This means the data reached Redux but wasn't set. Check the ✅ logs:
- If `✅ Setting user in Redux state` appears → Redux was updated
- If this log is missing → `action.payload.user` was falsy

---

## Testing Cookie Persistence on Refresh

### Step 1: Login Successfully
1. Open http://localhost:5174/login
2. Enter credentials and click Login
3. Wait for redirect

### Step 2: Check Cookies
1. Press `F12` → **Application** tab
2. Click **Cookies** → `localhost:5174`
3. Verify these cookies exist:
   - `auth_token` (has a value)
   - `refresh_token` (has a value)
   - `user_data` (has JSON string)

### Step 3: Refresh the Page
Press `Ctrl+R` or `Cmd+R`

### Step 4: Check Console
You should see:
```
⏳ checkAuth.pending - restoring session from cookies
🔍 checkAuth - checking for saved token in cookies
✅ Token found: present
✅ User data in cookies: {id: "...", email: "...", ...}
✅ Using cached user data from cookies: {...}
✅ checkAuth.fulfilled - user restored: {...}
```

**Result:** You stay logged in! Cookies are persistent.

---

## Advanced Debugging Commands

Run these in browser console (F12 → Console):

```javascript
// Check current Redux auth state
console.log(store.getState().auth)

// Check stored cookies
console.log(document.cookie)

// Check specific cookie
document.cookie.split(';').forEach(c => {
  if (c.includes('user_data')) {
    console.log(JSON.parse(c.split('=')[1]))
  }
})

// Check localStorage (shouldn't be using this)
console.log(localStorage)
```

---

## Backend Response Format Checklist

Your backend MUST return this structure:

```json
{
  "data": {
    "user": {
      "id": "required - unique identifier",
      "email": "required - user email",
      "name": "required - display name",
      "role": "required - ADMIN or USER (uppercase)",
      "avatar": "optional - avatar URL",
      "createdAt": "optional - ISO date",
      "updatedAt": "optional - ISO date"
    },
    "token": "required - JWT access token",
    "refreshToken": "required - JWT refresh token"
  }
}
```

Checklist:
- [ ] Response wrapped in `data` object
- [ ] Inner `data.data` contains user, token, refreshToken
- [ ] `user.id` is present
- [ ] `user.email` is present
- [ ] `user.name` is present
- [ ] `user.role` is present (uppercase)
- [ ] `token` is a JWT string
- [ ] `refreshToken` is a JWT string

---

## Log Colors & Meanings

| Emoji | Meaning |
|-------|---------|
| 🔐 | Login started |
| 📤 | Request sent to backend |
| 📨 | Response received from backend |
| 🔍 | Data extraction/inspection |
| ✅ | Success - operation completed |
| ⏳ | Pending - waiting for response |
| ❌ | Error - something failed |

---

## Step-by-Step: What Should Happen

### 1. User clicks Login button
```
↓
handleLogin() is called
↓
📤 POST /user/auth/login is sent
```

### 2. Backend responds
```
↓
📨 Response received
↓
loginUser thunk extracts data
↓
🔍 Validates all fields present
```

### 3. Data is saved
```
↓
✅ Cookies updated
↓
Redux action dispatched
```

### 4. Redux state updated
```
↓
⏳ loginUser.pending
↓
✅ loginUser.fulfilled
↓
state.user = action.payload.user
state.isAuthenticated = true
```

### 5. Component detects change
```
↓
useEffect runs with [isAuthenticated, user]
↓
Redirect to /admin/dashboard or /
```

---

## Real-World Example: Debugging User Null

**Console Output:**
```
📨 response.data.data: {token: "abc...", refreshToken: "def..."}  ❌
🔍 User in authData: undefined  ❌
❌ Missing required auth fields: {user: false, token: true, refreshToken: true}
```

**Diagnosis:** Backend is not returning user object

**Solution:** 
1. Check backend code for login endpoint
2. Ensure it returns user data
3. Update response to include user object

---

## Next Steps After Debugging

1. ✅ Run the app
2. ✅ Open Developer Tools (F12)
3. ✅ Navigate to /login
4. ✅ Check console for 🔐 logs
5. ✅ Enter test credentials
6. ✅ Watch the sequence of logs
7. ✅ Compare with expected output above
8. ✅ Fix backend response if needed
9. ✅ Test page refresh (cookies should persist)

---

## Files Modified

- `src/app/slices/authSlice.ts` - Added comprehensive logging
- `src/pages/auth/LoginPage.tsx` - Enhanced with debug info
- `src/helpers/DebugHelper.ts` - Validation utilities

All logs only appear in **development mode** (`import.meta.env.DEV`).
Production builds don't include these logs.
