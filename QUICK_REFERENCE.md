# 🎯 Developer Quick Reference

## Import Aliases
```typescript
// Use absolute imports from these paths:
import { } from '@/app'
import { } from '@/api'
import { } from '@/config'
import { } from '@/hooks'
import { } from '@/interfaces'
import { } from '@/components'
```

---

## Redux & State Management

### Access Redux State
```typescript
import { useAppSelector } from '@/app';

// Auth state
const { user, loading, error, isAuthenticated } = useAppSelector(state => state.auth);

// Products state
const { products, loading, error, total, page } = useAppSelector(state => state.products);
```

### Dispatch Redux Actions
```typescript
import { useAppDispatch } from '@/app';
import { loginUser, logoutUser } from '@/app/slices/authSlice';

const dispatch = useAppDispatch();

// Login
dispatch(loginUser({ email: 'test@test.com', password: 'pass' }));

// Logout
dispatch(logoutUser());
```

---

## Authentication Hooks

### useAuth Hook
```typescript
import { useAuth } from '@/hooks';

const {
  user,              // Current user | null
  loading,           // Loading state
  error,             // Error message
  isAuthenticated,   // Is user logged in
  login,             // login(credentials)
  signup,            // signup(userData)
  logout,            // logout()
  verify,            // verify()
  clearErrorMessage  // clearErrorMessage()
} = useAuth();

// Usage
await login({ email: 'user@example.com', password: 'password' });
```

### useAuthVerify Hook
```typescript
import { useAuthVerify } from '@/hooks';

// Auto verify auth on component mount
export const MyComponent = () => {
  useAuthVerify();
  return <div>Protected content</div>;
};
```

---

## Products Hooks

### useProducts Hook
```typescript
import { useProducts } from '@/hooks';

const {
  products,           // Product array
  loading,            // Loading state
  error,              // Error message
  total,              // Total products
  page,               // Current page
  pageSize,           // Items per page
  getProducts,        // getProducts(params)
  getProductById,     // getProductById(id)
  updatePage,         // updatePage(number)
  updatePageSize,     // updatePageSize(number)
  clearErrorMessage   // clearErrorMessage()
} = useProducts();

// Usage
useEffect(() => {
  getProducts({ page: 1, pageSize: 10 });
}, []);
```

---

## API Services

### AuthService
```typescript
import { AuthService } from '@/api';

await AuthService.login({ email, password });
await AuthService.signup({ email, password, name, confirmPassword });
await AuthService.getCurrentUser();
await AuthService.logout();
await AuthService.refreshToken(refreshToken);
await AuthService.updateProfile({ name, avatar });
await AuthService.changePassword(oldPassword, newPassword);
```

### ProductService
```typescript
import { ProductService } from '@/api';

await ProductService.getProducts({ page: 1, pageSize: 10 });
await ProductService.getProductById('productId');
await ProductService.searchProducts('query', { page: 1 });
await ProductService.getProductsByCategory('category', { page: 1 });
await ProductService.createProduct({ name, price, ... });    // Admin
await ProductService.updateProduct('id', { name, price });   // Admin
await ProductService.deleteProduct('id');                    // Admin
```

---

## Axios Instance

### Direct API Calls
```typescript
import { axiosInstance } from '@/config';

// GET
const { data } = await axiosInstance.get('/endpoint');
const { data } = await axiosInstance.get<IProduct>('/products/1');

// POST
await axiosInstance.post('/endpoint', { data: 'value' });

// PUT
await axiosInstance.put('/endpoint/1', { data: 'updated' });

// PATCH
await axiosInstance.patch('/endpoint/1', { data: 'partial' });

// DELETE
await axiosInstance.delete('/endpoint/1');
```

---

## Cookie Management

### CookieService
```typescript
import { CookieService } from '@/config';

// Basic operations
CookieService.set('name', 'value');
CookieService.get('name');
CookieService.remove('name');
CookieService.exists('name');

// Auth tokens
CookieService.setAuthToken(token);
CookieService.getAuthToken();
CookieService.setRefreshToken(token);
CookieService.getRefreshToken();

// User data
CookieService.setUserData({ id: '1', name: 'John' });
CookieService.getUserData();

// Cleanup
CookieService.removeAuthCookies();
CookieService.clearAll();
```

---

## Route Protection

### ProtectedRoute
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

### PublicRoute
```typescript
import { PublicRoute } from '@/components';

<Route 
  path="/login" 
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  } 
/>
```

---

## TypeScript Interfaces

### Common Types
```typescript
import { 
  IUser,
  IProduct,
  IAuthResponse,
  ILoginRequest,
  ISignupRequest,
  IPaginatedResponse,
  IPaginationParams
} from '@/interfaces';

// Use in components
const user: IUser = { ... };
const products: IProduct[] = [ ... ];
```

---

## Environment & Config

### Access Configuration
```typescript
import { config } from '@/config';

config.api.baseURL
config.api.timeout
config.cookies.authToken
config.app.isDevelopment
config.app.isProduction
```

### Environment Variables (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Basit Mobile Zone
VITE_ENABLE_ANALYTICS=false
```

---

## Common Patterns

### Login Component
```typescript
import { useAuth } from '@/hooks';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (!loginUser.rejected.match(result)) {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
    </form>
  );
};
```

### Protected Page
```typescript
import { useAuth } from '@/hooks';
import { Navigate } from 'react-router-dom';

export const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;

  return <div>Admin Content</div>;
};
```

### Data List with Pagination
```typescript
import { useProducts } from '@/hooks';
import { useEffect } from 'react';

export const ProductsList = () => {
  const { products, loading, getProducts, page, updatePage } = useProducts();

  useEffect(() => {
    getProducts({ page, pageSize: 10 });
  }, [page]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {products.map(p => <div key={p.id}>{p.name}</div>)}
      <button onClick={() => updatePage(page + 1)}>Next</button>
    </div>
  );
};
```

---

## Error Handling

### In Components
```typescript
const { error, clearErrorMessage } = useAuth();

useEffect(() => {
  if (error) {
    console.error(error);
    // Show toast/notification
  }
}, [error]);
```

### With Axios
```typescript
try {
  const result = await axiosInstance.get('/endpoint');
} catch (error: any) {
  console.error(error.response?.data?.message || error.message);
}
```

### With Redux Thunks
```typescript
const result = await dispatch(loginUser(credentials));
if (loginUser.fulfilled.match(result)) {
  // Success
} else if (loginUser.rejected.match(result)) {
  // Error: result.payload
}
```

---

## Redux DevTools

### In Browser
1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
2. Open DevTools → Redux tab
3. View state changes, time-travel debug

### Programmatic Access
```typescript
import { store } from '@/app';

// View current state
console.log(store.getState());

// Dispatch actions
import { loginUser } from '@/app/slices/authSlice';
store.dispatch(loginUser({ email, password }));
```

---

## Performance Tips

1. **Memoize selectors**
   ```typescript
   const user = useAppSelector(state => state.auth.user);
   ```

2. **Use custom hooks**
   ```typescript
   const { user } = useAuth(); // Already memoized
   ```

3. **Code split pages**
   ```typescript
   const AdminPage = lazy(() => import('@/pages/admin/Dashboard'));
   ```

4. **Avoid inline functions in render**
   ```typescript
   // ❌ Bad
   onClick={() => dispatch(action())}
   
   // ✅ Good
   const handleClick = useCallback(() => dispatch(action()), []);
   ```

---

## Common Errors & Solutions

### "Cannot find module"
- Check import path (use `@/` alias)
- Verify file exists
- Check tsconfig paths

### "No token found"
- Ensure login was successful
- Check cookies in DevTools
- Verify token is being stored

### "401 Unauthorized"
- Check token expiration
- Verify refresh token is set
- Check backend token validation

### Redux state not updating
- Open Redux DevTools
- Check action was dispatched
- Verify reducer handles action
- Check payload structure

---

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# Check types
npx tsc --noEmit
```

---

## Documentation Links

- [QUICK_START.md](./QUICK_START.md) - Get started
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Full guide
- [CHANGELOG.md](./CHANGELOG.md) - Changes
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What was done

---

**Version:** 1.0.0  
**Last Updated:** May 21, 2026
