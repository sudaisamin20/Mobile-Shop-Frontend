# Debugging Guide - Authentication Flow

This guide helps you debug the authentication flow and identify issues with user data persistence.

## Quick Start

### 1. Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5174`

### 2. Open Browser Developer Tools
- Press `F12` or `Ctrl+Shift+I`
- Go to the **Console** tab
- Look for debug logs with emoji prefixes

## Understanding the Debug Logs

### Login Page Logs

When you attempt to login, you'll see logs in this order:

```
🔐 Attempting login with email: user@example.com
📥 Login result: { payload: { user: {...}, token: "...", refreshToken: "..." } }
✔️ Auth response validation: { valid: true }
✅ User authenticated, redirecting... { role: "ADMIN" }
🔍 LoginPage - Auth State Updated: { isAuthenticated: true, user: {...}, loading: false, error: null }
```

### What Each Log Means

| Log | Meaning | Action |
|-----|---------|--------|
| 🔐 | Login request started | Check email/password are valid |
| 📥 | Response received from backend | Check response structure below |
| ✔️ | Response validation passed | Payload is correctly formatted |
| ✅ | User authenticated | User data was properly stored |
| 🔍 | State updated | Redux state has been updated |
| ❌ | Validation failed | Check backend response format |

## Testing the Login Flow

### Step 1: Test with Invalid Credentials

1. Navigate to http://localhost:5174/login
2. Enter any email and password
3. Click the Login button
4. Check console for error messages

**Expected Behavior:**
- See error toast notification
- Console shows error details
- Stay on login page

### Step 2: Test with Valid Admin Credentials

1. Enter valid admin credentials (from your backend)
   - Email: admin@example.com
   - Password: admin123
2. Click Login
3. Check console logs
4. Should redirect to `/admin/dashboard`

**Expected Console Logs:**
```
🔐 Attempting login with email: admin@example.com
📥 Login result: { payload: { ... } }
✔️ Auth response validation: { valid: true }
✅ User authenticated, redirecting... { role: "ADMIN" }
```

### Step 3: Test with Valid User Credentials

1. Enter valid user credentials
   - Email: user@example.com
   - Password: user123
2. Click Login
3. Should redirect to home page `/`

### Step 4: Test Protected Routes

1. Logout from admin dashboard
2. Try accessing `/admin/dashboard` directly via URL
3. Should redirect to `/login`

## Checking Backend Response Format

Your backend MUST return responses in this exact format:

```json
{
  "data": {
    "user": {
      "id": "uuid-or-id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "ADMIN",
      "avatar": "https://...",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Why Double-Wrapped?

- **First level** (`response.data`): Added by Axios
- **Second level** (`response.data.data`): Added by your backend

The app code expects this structure:
```typescript
const response = await axiosInstance.post('/user/auth/login', { ... });
// response.data = { data: { user, token, refreshToken } }
// action.payload = response.data = { user, token, refreshToken }
```

## Checking Browser Cookies

1. Open Developer Tools (F12)
2. Go to **Application** tab
3. Click **Cookies** in the left sidebar
4. Select `localhost:5173` or `localhost:5174`

**Expected Cookies After Login:**
```
auth_token      = "jwt_token_here"
refresh_token   = "jwt_refresh_token"
user_data       = "{\"id\":\"...\",\"email\":\"...\",\"name\":\"...\",\"role\":\"ADMIN\"}"
```

### Cookie Settings
- **SameSite**: Strict (secure cookies)
- **Secure**: Enabled in production
- **Path**: /
- **MaxAge**: 7 days

## Common Issues & Solutions

### Issue 1: "User is undefined"
**Symptoms:**
- Login appears to work but user is null
- Console shows: `user: null` in logs

**Debugging:**
1. Check browser console for the 📥 log
2. Verify response payload structure
3. Check if `action.payload.user` exists

**Solution:**
Make sure backend returns `user` object with all required fields:
```json
{
  "data": {
    "user": {
      "id": "...",
      "email": "...",
      "name": "...",
      "role": "ADMIN"  // Must be uppercase
    }
  }
}
```

### Issue 2: "Validation failed"
**Symptoms:**
- See ❌ Auth response validation failed
- Error message appears

**Debugging:**
1. Check 📥 log for actual response
2. Compare with expected format above
3. Verify all required fields are present

**Solution:**
Ensure backend sends all required fields:
- `user` object with id, email, name, role
- `token` string
- `refreshToken` string

### Issue 3: "Redirect not working"
**Symptoms:**
- Login succeeds but stays on login page
- No redirect to dashboard or home

**Debugging:**
1. Check ✅ log to see if user role is detected
2. Verify role value (should be "ADMIN" or "USER")
3. Check console for useEffect logs

**Solution:**
Ensure role is exactly:
- `"ADMIN"` (uppercase) for admins
- `"USER"` (uppercase) for regular users

### Issue 4: "Network requests failing"
**Symptoms:**
- See red errors in Network tab
- Login button doesn't respond

**Debugging:**
1. Open Network tab (F12 → Network)
2. Click Login
3. Look for the POST request to `/user/auth/login`
4. Check response status and body

**Solution:**
- Ensure backend is running
- Check CORS configuration if on different ports
- Verify API base URL: http://localhost:3000/api

## Testing Token Refresh

1. Login successfully
2. Open Network tab
3. Wait 1 minute or manually trigger a request
4. Look for POST request to `/user/auth/refresh`
5. Verify 401 triggers refresh automatically

## Useful Console Commands

Run these in browser console (F12):

```javascript
// Check current auth state
store.getState().auth

// Check stored cookies
console.log(document.cookie)

// Check stored user data
JSON.parse(document.cookie.split('user_data=')[1])

// Manually trigger login
dispatch(loginUser({ email: 'test@example.com', password: 'password' }))
```

## Environment Configuration

The backend URL is configured in:
**File:** `src/config/environment.ts`

```typescript
export const config = {
  api: {
    baseURL: 'http://localhost:3000/api'
  }
};
```

Change this if your backend runs on a different port.

## Next Steps

Once debugging is complete:

1. ✅ Test all login scenarios
2. ✅ Verify cookies are stored
3. ✅ Test token refresh on 401
4. ✅ Test protected routes
5. ✅ Test logout clears cookies
6. ✅ Ready for production deployment

## Need More Help?

Check these files for implementation details:

- **Auth Logic**: `src/app/slices/authSlice.ts`
- **Login Page**: `src/pages/auth/LoginPage.tsx`
- **Axios Setup**: `src/config/axiosInstance.ts`
- **Cookie Service**: `src/config/cookies.ts`
- **Route Protection**: `src/components/ProtectedRoute.tsx`
- **Debug Utilities**: `src/helpers/DebugHelper.ts`

All files have TypeScript types and detailed comments.
