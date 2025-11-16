# MealPlan Pro - Mobile App Build Instructions

## Prerequisites
- Node.js and npm installed
- Android Studio installed
- Java Development Kit (JDK) 17 or higher

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

### 3. Sync with Capacitor
```bash
npx cap sync
```

### 4. Open in Android Studio
```bash
npx cap open android
```

### 5. Build APK in Android Studio
1. In Android Studio, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. Wait for the build to complete
3. APK will be generated in `android/app/build/outputs/apk/debug/`

## Development Commands

### Run on Device/Emulator
```bash
npx cap run android
```

### Live Reload (Development)
```bash
npm run dev
# In another terminal:
npx cap sync
npx cap run android --livereload --external
```

## App Configuration
- **App Name**: MealPlan Pro
- **Package ID**: com.mealplan.app
- **Build Output**: `dist/` folder

## Notes
- The app is configured to work offline with localStorage
- Backend API calls will fallback gracefully when server is unavailable
- All security fixes and optimizations are included in the mobile build