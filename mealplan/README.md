# 🍽️ Meal Plan Pro

**A comprehensive meal planning mobile application with recipe management, shopping lists, and text-to-speech functionality.**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.4.4-blue.svg)](https://capacitorjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue.svg)](https://tailwindcss.com/)

## 🎯 Overview

Meal Plan Pro is a modern, feature-rich meal planning application that helps users organize their meals, discover new recipes, and streamline their cooking experience. Built with React and TypeScript, it offers both web and mobile experiences through Capacitor.

## ✨ Key Features

### 🍳 Recipe Management
- Browse and discover curated recipes
- Create custom recipes with detailed instructions
- Save favorite recipes for quick access
- Comprehensive ingredient and nutrition information

### 📅 Smart Meal Planning
- Interactive weekly meal planning grid
- Drag-and-drop meal assignment
- Pre-made meal plan templates
- Serving size adjustments for families

### 🛒 Intelligent Shopping Lists
- Auto-generated shopping lists from meal plans
- Recent items tracking and management
- Organized by ingredient categories
- Persistent storage for offline access

### 🔊 Text-to-Speech Integration
- Recipe instruction narration
- Step-by-step audio guidance
- Visual feedback during playback
- Mobile and web platform support

### 👤 User Experience
- Secure authentication system
- Personalized user profiles
- Recipe reviews and ratings
- Responsive design for all devices

### 📱 Mobile Application
- Native Android app via Capacitor
- Touch-optimized interactions
- Offline functionality
- Native plugin integration

### 🔒 Security & Performance
- XSS protection and input sanitization
- Secure error handling
- JWT authentication
- Optimized bundle size and performance

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **Android Studio** (for mobile development)
- **Java JDK** v11 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mealplan

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Mobile Development

```bash
# Build and sync with Capacitor
npm run cap:build

# Open Android Studio
npm run cap:android
```

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Mobile Development
- `npm run cap:build` - Build and sync with Capacitor
- `npm run cap:android` - Build and open Android Studio
- `npx cap sync` - Sync web assets with native platforms

### Security & Quality
- `npm run security:audit` - Run security audit
- `npm run security:fix` - Fix security vulnerabilities

## 🏗️ Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern UI library
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.9** - Fast build tool and dev server

### Mobile Development
- **Capacitor 7.4.4** - Native mobile wrapper
- **@capacitor/android** - Android platform support
- **@capacitor-community/text-to-speech** - TTS functionality

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications

### State Management
- **React Context** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Persistent data storage

## 📁 Project Structure

```
mealplan/
├── 📱 android/                    # Android native project
├── 🌐 public/                     # Static assets
├── 📦 src/
│   ├── 🎨 assets/                 # Images and media
│   ├── 🧩 components/             # Reusable UI components
│   │   ├── layout/                # Layout components
│   │   └── ui/                    # UI primitives
│   ├── ⚙️ config/                 # Configuration files
│   ├── 🔄 contexts/               # React Context providers
│   ├── 🪝 hooks/                  # Custom React hooks
│   ├── 📚 lib/                    # Utility libraries
│   ├── 📄 pages/                  # Application pages
│   ├── 🔌 services/               # API and external services
│   └── 🛠️ utils/                  # Utility functions
├── 📋 Documentation files
└── ⚙️ Configuration files
```

## 📚 Documentation

- **[Project Structure](PROJECT_STRUCTURE.md)** - Detailed project organization
- **[Feature Documentation](FEATURE_DOCUMENTATION.md)** - Complete feature overview
- **[API Documentation](API_DOCUMENTATION.md)** - API endpoints and usage
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Build and deployment instructions
- **[Security Guide](SECURITY.md)** - Security implementation details
- **[Build Instructions](BUILD_INSTRUCTIONS.md)** - Detailed build process
- **[TTS Usage Guide](TTS_USAGE.md)** - Text-to-speech implementation

## 🔧 Configuration

### Environment Variables
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Meal Plan Pro
VITE_ENABLE_ANALYTICS=true
```

### Capacitor Configuration
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.mealplan.app',
  appName: 'MealPlan Pro',
  webDir: 'dist',
  plugins: {
    StatusBar: { style: 'DARK' },
    TextToSpeech: {}
  }
};
```

## 🧪 Testing

### Web Testing
```bash
# Development testing
npm run dev

# Production testing
npm run build && npm run preview
```

### Mobile Testing
1. Build and sync: `npm run cap:build`
2. Open Android Studio: `npx cap open android`
3. Run on emulator or device
4. Test TTS functionality
5. Verify offline capabilities

## 🚀 Deployment

### Web Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting provider
3. Configure environment variables

### Android App
1. Build APK: In Android Studio → Build → Build APK(s)
2. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`
3. For Play Store: Build App Bundle (`.aab` format)

## 🔒 Security Features

- **XSS Protection** - Input sanitization with DOMPurify
- **Secure Headers** - Content Security Policy implementation
- **Input Validation** - Server-side validation for all inputs
- **Authentication** - JWT token management
- **Error Handling** - Secure error messages

## 🎯 Recent Updates

### v2.0.0 - Mobile App Release
- ✅ Native Android app with Capacitor
- ✅ Text-to-speech functionality
- ✅ Comprehensive security fixes
- ✅ Shopping list improvements
- ✅ Mobile-optimized UI/UX

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing component patterns
- Implement proper error handling
- Add security considerations
- Test on both web and mobile

## 📞 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Security**: Report security issues privately

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React, TypeScript, and Capacitor**