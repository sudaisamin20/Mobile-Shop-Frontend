# Basit Mobile Zone - Production Configuration Documentation

## Overview
This document outlines the production-level configuration implemented in the Basit Mobile Zone Frontend application. The setup includes Redux Toolkit for state management, Axios for API calls with automatic cookie-based authentication, and TypeScript interfaces for type safety.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [State Management (Redux Toolkit)](#state-management-redux-toolkit)
3. [API Configuration (Axios)](#api-configuration-axios)
4. [Cookie-Based Authentication](#cookie-based-authentication)
5. [File Structure](#file-structure)
6. [Setup Instructions](#setup-instructions)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

The application follows a modern, scalable architecture:

```
┌─────────────────────────────────────────┐
│         React Components                 │
├─────────────────────────────────────────┤
│   Custom Hooks (useAuth, useProducts)   │
├─────────────────────────────────────────┤
│    Redux Store & Slices (Auth, Products) │
├─────────────────────────────────────────┤
│   API Services (AuthService, ProductService) │
├─────────────────────────────────────────┤
│   Axios Instance (with Interceptors)    │
├─────────────────────────────────────────┤
│  Config (Environment, Cookies)          │
├─────────────────────────────────────────┤
│   External APIs (Backend Server)        │
└─────────────────────────────────────────┘
```

---

## State Management (Redux Toolkit)

### Directory Structure
```
src/app/
├── index.ts              # Store exports and typed hooks
├── store.ts              # Redux store configuration
├── hooks.ts              # Custom Redux hooks (useAppDispatch, useAppSelector)
└── slices/
    ├── authSlice.ts      # Authentication state & async thunks
    └── productsSlice.ts  # Products state & async thunks
```

### Key Features

#### 1. **Auth Slice** (`src/app/slices/authSlice.ts`)
Manages user authentication state and related operations.

**Async Thunks:**
- `loginUser`: Authenticate user with credentials
- `signupUser`: Register new user
- `checkAuth`: Verify existing authentication
- `logoutUser`: Clear authentication

**State:**
```typescript
{
  user: IUser | null;           // Current authenticated user
  loading: boolean;              // Loading state
  error: string | null;          // Error message
  isAuthenticated: boolean;      // Auth status
}
```

#### 2. **Products Slice** (`src/app/slices/productsSlice.ts`)
Manages product listings and details.

**Async Thunks:**
- `fetchProducts`: Get paginated products
- `fetchProductById`: Get single product details

**State:**
```typescript
{
  products: IProduct[];          // Product list
  loading: boolean;              // Loading state
  error: string | null;          // Error message
  total: number;                 // Total product count
  page: number;                  // Current page
  pageSize: number;              // Items per page
}
```

### Custom Redux Hooks

Located in `src/app/hooks.ts`:

```typescript
// Typed dispatch hook
const dispatch = useAppDispatch();

// Typed selector hook
const auth = useAppSelector(state => state.auth);
```

---

## API Configuration (Axios)

### Directory Structure
```
src/config/
├── index.ts              # Config exports
├── environment.ts        # Environment variables & config
├── cookies.ts            # Cookie service utilities
└── axiosInstance.ts      # Axios instance with interceptors
```

### Axios Instance Features

**File:** `src/config/axiosInstance.ts`

1. **Request Interceptor:**
   - Automatically adds Bearer token to Authorization header
   - Includes CORS credentials

2. **Response Interceptor:**
   - Handles 401 Unauthorized responses
   - Auto-refreshes expired tokens
   - Retries failed requests
   - Redirects to login if refresh fails

3. **Methods:**
   - `get<T>(url, config?)`
   - `post<T>(url, data?, config?)`
   - `put<T>(url, data?, config?)`
   - `patch<T>(url, data?, config?)`
   - `delete<T>(url, config?)`

### Environment Configuration

**File:** `src/config/environment.ts`

```typescript
config.api.baseURL      // API base URL
config.api.timeout      // Request timeout (ms)
config.api.retryAttempts // Number of retry attempts
config.api.retryDelay   // Delay between retries (ms)

config.cookies.authToken      // Auth token cookie name
config.cookies.refreshToken   // Refresh token cookie name
config.cookies.userData       // User data cookie name
config.cookies.maxAge         // Cookie expiration (seconds)
config.cookies.secure         // HTTPS only (production)
config.cookies.sameSite       // CSRF protection

config.app.name          // Application name
config.app.environment   // dev/production
config.app.isDevelopment // Is development
config.app.isProduction  // Is production
```

---

## Cookie-Based Authentication

### Overview
Instead of localStorage, the application uses secure HTTP cookies for storing authentication tokens. This provides better security and automatic inclusion in requests.

### Cookie Service

**File:** `src/config/cookies.ts`

**Features:**
- Secure cookie handling with js-cookie
- Automatic CSRF protection (SameSite=Strict)
- HTTPS enforcement in production
- JSON serialization for complex data

**Methods:**

```typescript
// Set/Get cookies
CookieService.set(name, value, options?)
CookieService.get(name)
CookieService.remove(name)
CookieService.exists(name)

// Auth-specific methods
CookieService.setAuthToken(token)
CookieService.getAuthToken()
CookieService.setRefreshToken(token)
CookieService.getRefreshToken()
CookieService.setUserData(userData)
CookieService.getUserData()

// Clear all cookies
CookieService.clearAll()
CookieService.removeAuthCookies()
```

### Cookie Security Features

1. **HttpOnly** (Backend responsibility):
   - Cookies should be set as HttpOnly from backend
   - Prevents JavaScript access to sensitive tokens

2. **Secure Flag**:
   - Automatically set in production (HTTPS only)
   - Development allows HTTP for testing

3. **SameSite**:
   - Set to `Strict` to prevent CSRF attacks
   - Cookies only sent to same site

4. **Path**:
   - Scoped to `/` for application-wide access

5. **MaxAge**:
   - 7 days default expiration
   - Configurable per cookie type

---

## File Structure

### Complete Project Structure

```
src/
├── app/                          # Redux store & slices
│   ├── index.ts                  # Exports
│   ├── store.ts                  # Store configuration
│   ├── hooks.ts                  # Custom hooks
│   └── slices/
│       ├── authSlice.ts          # Auth state
│       └── productsSlice.ts      # Products state
│
├── api/                          # API services
│   ├── index.ts                  # Exports
│   ├── authService.ts            # Auth endpoints
│   └── productService.ts         # Product endpoints
│
├── config/                       # Configuration
│   ├── index.ts                  # Exports
│   ├── environment.ts            # Environment config
│   ├── cookies.ts                # Cookie utilities
│   └── axiosInstance.ts          # Axios setup
│
├── hooks/                        # Custom React hooks
│   ├── index.ts                  # Exports
│   ├── useAuth.ts                # Auth operations
│   └── useProducts.ts            # Product operations
│
├── interfaces/                   # TypeScript interfaces
│   └── index.ts                  # All type definitions
│
├── components/
│   ├── index.ts                  # Component exports
│   ├── ProtectedRoute.tsx        # Auth-required routes
│   ├── PublicRoute.tsx           # Auth-restricted routes
│   ├── ui/                       # UI components
│   └── ...
│
├── pages/                        # Page components
│   ├── admin/
│   ├── auth/
│   ├── home/
│   └── user/
│
├── layout/                       # Layout components
├── helpers/                      # Utility functions
├── utils/                        # Utility functions
├── assets/                       # Images, fonts, etc.
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
└── index.css                     # Global styles
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings for Redux
- `axios` - HTTP client
- `js-cookie` - Cookie management
- And all other dependencies

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update values as needed:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Basit Mobile Zone
```

### 3. Update App Routes

Edit `src/App.tsx` to use protected routes:

```typescript
import { ProtectedRoute, PublicRoute } from './components';
import { useAuthVerify } from './hooks';

function App() {
  useAuthVerify(); // Verify auth on app load

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### 4. Start Development Server

```bash
npm run dev
```

---

## Usage Examples

### Authentication Example

**Login Component:**

```typescript
import { useAuth } from '../hooks';
import { useState } from 'react';

export const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (!result.payload) {
      // Handle error
      console.error(error);
    }
  };

  return (
    <div>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
```

### Products Example

**Products List Component:**

```typescript
import { useProducts } from '../hooks';
import { useEffect } from 'react';

export const ProductsList = () => {
  const { products, loading, error, getProducts, page, pageSize } = useProducts();

  useEffect(() => {
    getProducts({ page, pageSize });
  }, [page, pageSize]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};
```

### Direct API Service Usage

```typescript
import { AuthService, ProductService } from '../api';

// Login via service
const response = await AuthService.login({ 
  email: 'user@example.com', 
  password: 'password' 
});

// Get products
const products = await ProductService.getProducts({ 
  page: 1, 
  pageSize: 10 
});

// Search products
const results = await ProductService.searchProducts('laptop', {
  page: 1,
  pageSize: 10
});
```

### Accessing Redux State Directly

```typescript
import { useAppSelector, useAppDispatch } from '../app';
import { loginUser } from '../app/slices/authSlice';

export const CustomComponent = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const products = useAppSelector(state => state.products.products);

  // Dispatch async thunks directly
  const handleLogin = async () => {
    dispatch(loginUser({ 
      email: 'user@example.com', 
      password: 'password' 
    }));
  };

  return <div>{user?.name}</div>;
};
```

---

## Best Practices

### 1. Always Use Custom Hooks
✅ **Good:**
```typescript
const { user, loading } = useAuth();
```

❌ **Avoid:**
```typescript
const state = useSelector(state => state);
```

### 2. Use Typed Selectors
✅ **Good:**
```typescript
const { user } = useAppSelector(state => state.auth);
```

❌ **Avoid:**
```typescript
const user = useSelector((state: any) => state.auth.user);
```

### 3. Error Handling
Always handle async thunk rejections:
```typescript
const result = await login(credentials);
if (loginUser.rejected.match(result)) {
  console.error('Login failed:', result.payload);
}
```

### 4. Environment Variables
Always use environment variables for API URLs:
```typescript
// ✅ Good
const baseURL = config.api.baseURL;

// ❌ Avoid
const baseURL = 'http://localhost:3000/api';
```

### 5. Cookie Security
- Never store sensitive data in user-accessible cookies
- Use HttpOnly flag from backend for tokens
- Always validate tokens on backend
- Implement CSRF protection

### 6. Type Safety
Always define interfaces for API responses:
```typescript
interface IApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
```

---

## Troubleshooting

### Issue: Cookies Not Being Saved
**Solution:**
1. Ensure backend sets `HttpOnly` flag
2. Check `withCredentials: true` is set in axios
3. Verify cookie domain matches

### Issue: 401 Errors Not Handled
**Solution:**
1. Ensure refresh token endpoint returns valid token
2. Check `config.cookies.refreshToken` is being set
3. Verify token expiration logic

### Issue: CORS Errors
**Solution:**
1. Update `VITE_API_BASE_URL` in `.env.local`
2. Ensure backend CORS headers are correct
3. Check `withCredentials` setting

### Issue: TypeScript Errors in Components
**Solution:**
1. Always import interfaces from `interfaces/index.ts`
2. Use `useAppSelector` and `useAppDispatch` for type safety
3. Enable strict mode in `tsconfig.json`

### Issue: State Not Updating
**Solution:**
1. Check Redux DevTools browser extension
2. Verify slice reducers are defined correctly
3. Ensure components subscribe to correct state slice

---

## Production Deployment Checklist

- [ ] Update API base URL to production server
- [ ] Ensure `secure: true` for cookies (HTTPS only)
- [ ] Disable Redux DevTools in production
- [ ] Update environment variables for production
- [ ] Test cookie security settings
- [ ] Implement error logging service
- [ ] Enable analytics if configured
- [ ] Test token refresh flow
- [ ] Validate CORS settings
- [ ] Test on different browsers
- [ ] Performance audit and optimization

---

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Axios Documentation](https://axios-http.com/)
- [js-cookie Documentation](https://github.com/js-cookie/js-cookie)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## Support

For issues or questions regarding the setup, please:
1. Check troubleshooting section above
2. Review Redux DevTools for state debugging
3. Check browser console for errors
4. Verify backend API is running
5. Check environment variables are set correctly

---

**Last Updated:** May 21, 2026
**Version:** 1.0.0
