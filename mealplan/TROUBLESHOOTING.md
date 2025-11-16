# 🔧 Troubleshooting Guide - Meal Plan Pro

This guide helps resolve common issues encountered during development, building, and deployment of Meal Plan Pro.

## 📋 Table of Contents

- [Development Issues](#development-issues)
- [Build Issues](#build-issues)
- [Mobile Development Issues](#mobile-development-issues)
- [Text-to-Speech Issues](#text-to-speech-issues)
- [Security Issues](#security-issues)
- [Performance Issues](#performance-issues)
- [Deployment Issues](#deployment-issues)

## 🛠️ Development Issues

### Node.js Version Issues

**Problem**: App fails to start or build
```bash
Error: Node.js version not supported
```

**Solution**:
```bash
# Check Node.js version
node --version

# Install Node.js v18 or higher
# Use nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Dependency Installation Issues

**Problem**: npm install fails
```bash
npm ERR! peer dep missing
```

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Port Already in Use

**Problem**: Development server won't start
```bash
Error: Port 5173 is already in use
```

**Solution**:
```bash
# Kill process using the port
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000

# Or set in vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
});
```

### TypeScript Errors

**Problem**: Type errors in development
```bash
Property 'xyz' does not exist on type
```

**Solution**:
```bash
# Check TypeScript version
npx tsc --version

# Update TypeScript
npm install typescript@latest

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Check tsconfig.json configuration
```

## 🏗️ Build Issues

### Build Memory Issues

**Problem**: Build fails with memory error
```bash
JavaScript heap out of memory
```

**Solution**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build

# Or add to package.json scripts
"build": "NODE_OPTIONS=--max-old-space-size=4096 vite build"

# For Windows
set NODE_OPTIONS=--max-old-space-size=4096 && npm run build
```

### Vite Build Issues

**Problem**: Vite build fails with module errors
```bash
Failed to resolve import
```

**Solution**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Check import paths (use relative paths)
import { Component } from './Component'
import { utils } from '@/utils/helpers'

# Verify vite.config.ts alias configuration
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

### Bundle Size Issues

**Problem**: Bundle too large
```bash
(!) Some chunks are larger than 500 kB
```

**Solution**:
```bash
# Analyze bundle
npm run build -- --analyze

# Use dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

# Configure manual chunks in vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
      }
    }
  }
}
```

## 📱 Mobile Development Issues

### Android Studio Issues

**Problem**: Android Studio won't open project
```bash
Project sync failed
```

**Solution**:
```bash
# Ensure Android Studio is properly installed
# Check Java JDK version (v11 or higher)
java -version

# Sync Capacitor
npx cap sync

# Clean and rebuild
cd android
./gradlew clean
./gradlew build

# If still failing, invalidate caches in Android Studio
File -> Invalidate Caches and Restart
```

### Gradle Build Issues

**Problem**: Gradle build fails
```bash
Could not resolve all files for configuration
```

**Solution**:
```bash
# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version=8.0

# Clear Gradle cache
./gradlew clean
rm -rf ~/.gradle/caches

# Check gradle.properties for proxy settings
# Ensure internet connection for dependency downloads
```

### Capacitor Sync Issues

**Problem**: Capacitor sync fails
```bash
[error] Capacitor could not find the web assets directory
```

**Solution**:
```bash
# Build web assets first
npm run build

# Then sync
npx cap sync

# Check capacitor.config.ts
const config: CapacitorConfig = {
  webDir: 'dist', // Ensure this matches your build output
};

# Verify dist folder exists after build
ls -la dist/
```

### Plugin Installation Issues

**Problem**: Capacitor plugins not working
```bash
Plugin not implemented on android
```

**Solution**:
```bash
# Verify plugin installation
npm list @capacitor-community/text-to-speech

# Reinstall plugin
npm uninstall @capacitor-community/text-to-speech
npm install @capacitor-community/text-to-speech

# Sync after plugin changes
npx cap sync

# Check MainActivity.java (should be auto-generated)
# Don't manually register plugins unless required
```

## 🔊 Text-to-Speech Issues

### TTS Not Working on Mobile

**Problem**: No sound when using TTS
```bash
TTS: Speech error: [object Object]
```

**Solution**:
```bash
# Check device volume settings
# Ensure TTS engine is installed on device
# Android Settings -> Accessibility -> Text-to-speech

# Test with simple text first
await TextToSpeech.speak({
  text: "Hello world",
  lang: "en-US"
});

# Check browser console for detailed errors
# Verify plugin is properly installed
npx cap ls
```

### TTS Permission Issues

**Problem**: TTS permission denied
```bash
TTS: Permission denied
```

**Solution**:
```typescript
// Request permissions first
const hasPermission = await TTSService.requestPermissions();
if (!hasPermission) {
  toast.error('Text-to-speech not available');
  return;
}

// Check if language is supported
const isSupported = await TextToSpeech.isLanguageSupported({ 
  lang: 'en-US' 
});
```

### Web TTS Issues

**Problem**: TTS not working in browser
```bash
speechSynthesis is not defined
```

**Solution**:
```typescript
// Check browser support
if ('speechSynthesis' in window) {
  // Wait for voices to load
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) {
    speechSynthesis.addEventListener('voiceschanged', () => {
      // Retry TTS
    });
  }
} else {
  console.error('Speech synthesis not supported');
}
```

## 🔒 Security Issues

### XSS Vulnerabilities

**Problem**: Security audit shows XSS issues
```bash
High severity vulnerability found
```

**Solution**:
```typescript
// Use DOMPurify for sanitization
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  });
};

// Sanitize all user inputs
const cleanInput = sanitizeInput(userInput);
```

### Authentication Issues

**Problem**: JWT token issues
```bash
Token expired or invalid
```

**Solution**:
```typescript
// Implement token refresh
const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('authToken', token);
      return token;
    }
  } catch (error) {
    // Redirect to login
    window.location.href = '/auth';
  }
};
```

### CORS Issues

**Problem**: API calls blocked by CORS
```bash
Access to fetch blocked by CORS policy
```

**Solution**:
```typescript
// Configure CORS on server
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));

// Or use proxy in vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

## ⚡ Performance Issues

### Slow Loading

**Problem**: App loads slowly
```bash
Large bundle size affecting performance
```

**Solution**:
```typescript
// Use lazy loading for routes
const Home = lazy(() => import('./pages/Home'));
const Recipes = lazy(() => import('./pages/Recipes'));

// Wrap with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/recipes" element={<Recipes />} />
  </Routes>
</Suspense>

// Optimize images
// Use WebP format
// Implement image lazy loading
```

### Memory Leaks

**Problem**: App becomes slow over time
```bash
Memory usage keeps increasing
```

**Solution**:
```typescript
// Clean up event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Clean up timers
useEffect(() => {
  const timer = setInterval(() => {
    // Timer logic
  }, 1000);
  
  return () => clearInterval(timer);
}, []);
```

### API Performance

**Problem**: Slow API responses
```bash
API calls taking too long
```

**Solution**:
```typescript
// Implement caching
const cache = new Map();

const fetchWithCache = async (url: string) => {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  
  return data;
};

// Use React Query for better caching
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['recipes'],
  queryFn: fetchRecipes,
  staleTime: 5 * 60 * 1000 // 5 minutes
});
```

## 🚀 Deployment Issues

### Build Deployment Issues

**Problem**: Deployed app shows blank page
```bash
White screen after deployment
```

**Solution**:
```bash
# Check build output
npm run build
ls -la dist/

# Verify base path in vite.config.ts
base: '/your-app-path/'

# Check browser console for errors
# Ensure all assets are loading correctly

# For SPA routing, configure server redirects
# _redirects file for Netlify
/*    /index.html   200
```

### Environment Variables

**Problem**: Environment variables not working in production
```bash
process.env.VITE_API_URL is undefined
```

**Solution**:
```bash
# Ensure variables start with VITE_
VITE_API_BASE_URL=https://api.example.com

# Set in deployment platform
# Netlify: Site settings -> Environment variables
# Vercel: Project settings -> Environment Variables

# Check build logs for variable values
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
```

### Mobile App Deployment

**Problem**: APK build fails
```bash
Build failed with exit code 1
```

**Solution**:
```bash
# Check Android SDK installation
# Ensure all required SDK components are installed

# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug

# Check for signing issues (release builds)
# Verify keystore configuration

# Check logs for specific error messages
./gradlew assembleDebug --stacktrace
```

## 🆘 Getting Additional Help

### Debug Information to Collect

When reporting issues, include:

```bash
# System information
node --version
npm --version
npx cap --version

# Project information
npm list --depth=0

# Build logs
npm run build > build.log 2>&1

# Mobile build logs
cd android && ./gradlew assembleDebug --stacktrace
```

### Useful Commands for Debugging

```bash
# Clear all caches
npm cache clean --force
rm -rf node_modules package-lock.json
rm -rf .vite
rm -rf dist

# Reset Capacitor
npx cap clean
npx cap sync

# Check for security vulnerabilities
npm audit
npm audit fix

# Analyze bundle size
npm run build -- --analyze
```

### Resources

- **GitHub Issues**: Search existing issues first
- **Capacitor Documentation**: https://capacitorjs.com/docs
- **Vite Documentation**: https://vitejs.dev/guide/
- **React Documentation**: https://react.dev/
- **Stack Overflow**: Tag questions with relevant technologies

### Creating Bug Reports

Include:
1. **Environment details** (OS, Node version, etc.)
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Error messages** and stack traces
5. **Screenshots** if applicable
6. **Code snippets** that demonstrate the issue

Remember: Most issues have been encountered before. Search existing documentation and issues first! 🔍