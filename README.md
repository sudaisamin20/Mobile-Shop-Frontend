# 🚀 Basit Mobile Zone - Frontend

A production-ready React + TypeScript frontend application with Redux Toolkit state management, Axios API client with automatic token refresh, and secure cookie-based authentication.

## ✨ Features

- **🔒 Secure Authentication**: Cookie-based authentication with automatic token refresh
- **📦 State Management**: Redux Toolkit with async thunks for API operations
- **🔄 API Integration**: Axios instance with request/response interceptors
- **🛡️ Type Safety**: Complete TypeScript interfaces and type definitions
- **🎣 Custom Hooks**: Simplified Redux integration with useAuth and useProducts
- **📱 Responsive UI**: Tailwind CSS for styling
- **🔐 Protected Routes**: Role-based access control components
- **⚙️ Environment Config**: Flexible configuration management
- **🧪 Development Tools**: Redux DevTools integration

## 🎯 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

1. **Clone the repository**
```bash
cd basit-mobile-zone-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
# Update VITE_API_BASE_URL with your backend URL
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in minutes
- **[PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)** - Comprehensive setup guide
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and changes

## 🏗️ Architecture

```
Redux Store
    ↓
Custom Hooks (useAuth, useProducts)
    ↓
React Components
    ↓
API Services (AuthService, ProductService)
    ↓
Axios Instance (with Interceptors)
    ↓
Backend Server
```

## 📁 Project Structure

```
src/
├── app/                    # Redux store, slices, and hooks
│   ├── store.ts            # Store configuration
│   ├── hooks.ts            # useAppDispatch, useAppSelector
│   └── slices/             # Redux slices
│
├── api/                    # API service layer
│   ├── authService.ts      # Authentication endpoints
│   └── productService.ts   # Product endpoints
│
├── config/                 # Configuration
│   ├── environment.ts      # Environment variables
│   ├── cookies.ts          # Cookie utilities
│   └── axiosInstance.ts    # Axios setup
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Auth operations
│   └── useProducts.ts      # Product operations
│
├── interfaces/             # TypeScript types
│   └── index.ts            # All type definitions
│
├── components/             # React components
├── pages/                  # Page components
├── layout/                 # Layout components
└── utils/                  # Utility functions
```

## 🔐 Authentication

The application uses secure HTTP cookies for authentication:

```typescript
import { useAuth } from '@/hooks';

const { user, login, logout, loading, error } = useAuth();

// Login
await login({ email: 'user@example.com', password: 'password' });

// Logout
await logout();
```

**Security Features:**
- ✅ Secure HTTP cookies (HttpOnly flag)
- ✅ Automatic token refresh on 401
- ✅ CSRF protection (SameSite=Strict)
- ✅ HTTPS enforcement in production
- ✅ Automatic logout on token expiration

## 📦 State Management

Redux Toolkit manages application state:

```typescript
import { useAppSelector } from '@/app';

const { user, isAuthenticated } = useAppSelector(state => state.auth);
const { products } = useAppSelector(state => state.products);
```

## 🌐 API Integration

Type-safe API services with automatic error handling:

```typescript
import { AuthService, ProductService } from '@/api';

// Authenticate
const user = await AuthService.login({ email, password });

// Fetch data
const products = await ProductService.getProducts({ page: 1, pageSize: 10 });
```

## 🛡️ Protected Routes

Role-based route protection:

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

## 📝 Environment Variables

```env
# Backend API
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Basit Mobile Zone
VITE_APP_VERSION=1.0.0
```

## 🔧 Available Scripts

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

## 📦 Dependencies

### Production
- **@reduxjs/toolkit** - State management
- **react-redux** - React bindings for Redux
- **axios** - HTTP client
- **js-cookie** - Cookie management
- **react-router-dom** - Routing
- **tailwindcss** - Styling
- **lucide-react** - Icons

### Development
- **TypeScript** - Type safety
- **Vite** - Build tool
- **ESLint** - Code linting

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Deployment Checklist
- [ ] Update `VITE_API_BASE_URL` to production server
- [ ] Set secure cookies (HTTPS only)
- [ ] Disable Redux DevTools
- [ ] Test token refresh flow
- [ ] Validate CORS configuration
- [ ] Set up error logging
- [ ] Performance optimization
- [ ] Security audit

See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md#production-deployment-checklist) for full checklist.

## 🐛 Troubleshooting

### Cookies not persisting?
1. Check backend sets `HttpOnly` flag
2. Verify `withCredentials: true` in axios
3. Ensure domain matches

### 401 errors after login?
1. Verify token refresh endpoint
2. Check refresh token is being stored
3. Inspect browser cookies

### State not updating?
1. Open Redux DevTools
2. Check action dispatched
3. Verify reducer logic

See [PRODUCTION_SETUP.md#troubleshooting](./PRODUCTION_SETUP.md#troubleshooting) for more solutions.

## 📖 Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Axios Documentation](https://axios-http.com/)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Follow the code style
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Basit Mobile Zone Team

---

**Last Updated:** May 21, 2026  
**Version:** 1.0.0

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
