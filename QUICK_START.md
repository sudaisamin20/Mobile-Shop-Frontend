# Quick Start Guide

This guide will help you get started with the production-ready Basit Mobile Zone Frontend.

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
# Copy the example environment file
cp .env.example .env.local

# Update with your backend URL
# VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Architecture Quick Reference

### State Management (Redux)
```typescript
// Use auth state
import { useAuth } from '@/hooks';

const { user, isAuthenticated, login, logout } = useAuth();
```

### API Calls
```typescript
// Use services directly
import { AuthService, ProductService } from '@/api';

const user = await AuthService.getCurrentUser();
const products = await ProductService.getProducts({ page: 1 });
```

### Custom Hooks
```typescript
// Use custom hooks for operations
import { useAuth, useProducts } from '@/hooks';

const { login, loading, error } = useAuth();
const { products, getProducts } = useProducts();
```

### Protected Routes
```typescript
import { ProtectedRoute } from '@/components';

<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

---

## File Structure

```
src/
├── app/                 # Redux store & slices
├── api/                 # API service layer
├── config/              # Configuration & environment
├── hooks/               # Custom React hooks
├── interfaces/          # TypeScript types
├── components/          # React components
├── pages/               # Page components
├── layout/              # Layout components
└── utils/               # Utility functions
```

---

## Common Tasks

### Login User
```typescript
import { useAuth } from '@/hooks';

const LoginComponent = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};
```

### Fetch Products
```typescript
import { useProducts } from '@/hooks';
import { useEffect } from 'react';

const ProductsComponent = () => {
  const { products, loading, getProducts } = useProducts();

  useEffect(() => {
    getProducts({ page: 1, pageSize: 10 });
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

### Make API Call
```typescript
import { axiosInstance } from '@/config';

// GET request
const response = await axiosInstance.get('/endpoint');

// POST request
await axiosInstance.post('/endpoint', { data: 'value' });

// PUT request
await axiosInstance.put('/endpoint/1', { data: 'updated' });

// DELETE request
await axiosInstance.delete('/endpoint/1');
```

---

## Authentication Flow

1. **Login Request**
   ```
   User enters credentials → Redux dispatch loginUser thunk
   ```

2. **Token Storage**
   ```
   Backend returns tokens → Axios interceptor stores in cookies
   ```

3. **Authenticated Requests**
   ```
   Every request → Axios adds Authorization header from cookie
   ```

4. **Token Refresh**
   ```
   401 Response → Axios interceptor calls refresh endpoint
                → Updates cookie with new token
                → Retries original request
   ```

5. **Logout**
   ```
   User clicks logout → Redux clears auth state
                     → Cookies removed via CookieService
   ```

---

## Cookies Storage

The application stores user data in secure HTTP cookies:

- **auth_token**: JWT authentication token
- **refresh_token**: Token refresh token (7-day expiration)
- **user_data**: JSON stringified user information

**Security Features:**
- HttpOnly flag (set by backend)
- SameSite=Strict (CSRF protection)
- Secure flag in production (HTTPS only)
- Automatic cleanup on logout

---

## Environment Variables

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=1000

# App Configuration
VITE_APP_NAME=Basit Mobile Zone
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

---

## Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Debugging

### Redux DevTools
- Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
- Open browser DevTools to access Redux tab
- Time-travel debug state changes

### API Debugging
- Check Network tab in browser DevTools
- Verify request headers include Authorization
- Check cookie storage in DevTools

### Console Debugging
```typescript
// Log Redux state
import { store } from '@/app';
console.log('State:', store.getState());

// Dispatch actions manually
import { loginUser } from '@/app/slices/authSlice';
store.dispatch(loginUser({ email: 'test@test.com', password: 'pass' }));
```

---

## Troubleshooting

**Cookies not being saved?**
- Check backend sets HttpOnly flag
- Verify withCredentials in axios config
- Check cookie domain matches

**401 errors after login?**
- Verify token refresh endpoint works
- Check refresh token is being set
- Inspect cookies in DevTools

**State not updating?**
- Open Redux DevTools
- Check if action was dispatched
- Verify reducer is handling action

---

## Next Steps

1. **Review** [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) for detailed documentation
2. **Implement** your page components using the hooks
3. **Update** API services with your backend endpoints
4. **Configure** environment variables for your backend
5. **Test** authentication flow with your backend

---

## Documentation Links

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Axios Docs](https://axios-http.com/)
- [React Router Docs](https://reactrouter.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)

---

Happy coding! 🚀
