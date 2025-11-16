# 🚀 Deployment Guide - Meal Plan Pro

## 📋 Prerequisites

### Required Software
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Android Studio** (for Android builds)
- **Java JDK** (v11 or higher)

### Environment Setup
```bash
# Install dependencies
npm install

# Install Capacitor CLI globally
npm install -g @capacitor/cli
```

## 🌐 Web Deployment

### Build for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Netlify/Vercel
1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Set up `.env` variables

### Environment Variables
```bash
# .env.production
VITE_API_BASE_URL=https://your-api.com
VITE_APP_NAME=Meal Plan Pro
VITE_ENABLE_ANALYTICS=true
```

## 📱 Android Deployment

### 1. Prepare for Mobile Build
```bash
# Build web assets and sync with Capacitor
npm run cap:build

# Or manually:
npm run build
npx cap sync
```

### 2. Open Android Studio
```bash
# Open Android project in Android Studio
npx cap open android
```

### 3. Build APK (Debug)
**In Android Studio:**
1. Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

**Via Command Line:**
```bash
cd android
./gradlew assembleDebug
```

### 4. Build APK (Release)
**Prepare Signing Key:**
```bash
# Generate keystore (one-time setup)
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

**Configure Signing in `android/app/build.gradle`:**
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/my-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Build Release APK:**
```bash
cd android
./gradlew assembleRelease
```

### 5. Google Play Store Deployment
1. **Create App Bundle** (recommended):
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
2. **Upload to Play Console**: Upload the `.aab` file
3. **Configure Store Listing**: Add descriptions, screenshots, etc.
4. **Review & Publish**: Submit for review

## 🔧 Configuration Files

### Capacitor Configuration (`capacitor.config.ts`)
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mealplan.app',
  appName: 'MealPlan Pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000'
    },
    TextToSpeech: {
      // TTS plugin configuration
    }
  }
};

export default config;
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "cap:build": "npm run build && npx cap sync",
    "cap:android": "npm run cap:build && npx cap open android",
    "security:audit": "npm audit",
    "security:fix": "npm audit fix"
  }
}
```

## 🔒 Security Checklist

### Pre-Deployment Security
- [ ] Remove all hardcoded credentials
- [ ] Enable XSS protection
- [ ] Configure secure headers
- [ ] Validate all user inputs
- [ ] Implement proper error handling
- [ ] Run security audit: `npm run security:audit`

### Production Environment
- [ ] Use HTTPS for all API calls
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Enable gzip compression
# Configure in your hosting provider
```

### Mobile Performance
- Optimize images and assets
- Minimize JavaScript bundle size
- Enable lazy loading for routes
- Use service workers for caching

## 🧪 Testing Before Deployment

### Web Testing
```bash
# Run development server
npm run dev

# Build and test production
npm run build && npm run preview
```

### Mobile Testing
1. **Test on Emulator**: Use Android Studio emulator
2. **Test on Device**: Install APK on physical device
3. **Test TTS**: Verify text-to-speech functionality
4. **Test Offline**: Check offline capabilities

## 📱 App Store Requirements

### Android (Google Play)
- **Target SDK**: Android 13 (API level 33) or higher
- **App Bundle**: Use `.aab` format (recommended)
- **Privacy Policy**: Required for apps with user data
- **Content Rating**: Complete content rating questionnaire

### App Assets Required
- **App Icon**: 512x512 PNG
- **Feature Graphic**: 1024x500 PNG
- **Screenshots**: Various device sizes
- **App Description**: Compelling store listing

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run security:audit
```

## 🚨 Troubleshooting

### Common Build Issues
1. **Node Version**: Ensure Node.js v18+
2. **Memory Issues**: Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096`
3. **Android Build Fails**: Check Java JDK version and Android SDK

### TTS Issues
- Verify plugin installation: `npm list @capacitor-community/text-to-speech`
- Check Android permissions in manifest
- Test on physical device (TTS may not work on emulator)

### Performance Issues
- Optimize bundle size with code splitting
- Compress images and assets
- Enable caching strategies

## 📞 Support

### Documentation
- `PROJECT_STRUCTURE.md` - Project overview
- `BUILD_INSTRUCTIONS.md` - Detailed build steps
- `TTS_USAGE.md` - Text-to-speech implementation
- `SECURITY.md` - Security measures

### Getting Help
- Check console logs for errors
- Review Capacitor documentation
- Test on multiple devices/browsers
- Monitor app performance post-deployment