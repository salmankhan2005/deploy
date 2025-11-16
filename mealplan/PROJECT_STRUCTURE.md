# Meal Plan Pro - Project Structure

## 📱 Overview
**Meal Plan Pro** is a comprehensive meal planning mobile application built with React, TypeScript, and Capacitor. It features recipe management, meal planning, shopping lists, and text-to-speech functionality.

## 🏗️ Project Architecture

```
mealplan/
├── 📱 android/                    # Android native project (Capacitor)
├── 🌐 public/                     # Static assets
├── 📦 src/                        # Source code
│   ├── 🎨 assets/                 # Images and media files
│   ├── 🧩 components/             # Reusable UI components
│   ├── ⚙️ config/                 # Configuration files
│   ├── 🔄 contexts/               # React Context providers
│   ├── 🪝 hooks/                  # Custom React hooks
│   ├── 📚 lib/                    # Utility libraries
│   ├── 📄 pages/                  # Application pages/screens
│   ├── 🔌 services/               # API and external services
│   └── 🛠️ utils/                  # Utility functions
├── 📋 Documentation files
└── ⚙️ Configuration files
```

## 📦 Core Dependencies

### Frontend Framework
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.9** - Build tool
- **Tailwind CSS 3.4.17** - Styling

### Mobile Development
- **Capacitor 7.4.4** - Native mobile wrapper
- **@capacitor/android** - Android platform
- **@capacitor-community/text-to-speech** - TTS functionality

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## 🧩 Component Structure

### Layout Components (`src/components/layout/`)
- `Header.tsx` - App header with navigation
- `BottomNav.tsx` - Bottom navigation bar

### UI Components (`src/components/ui/`)
- Reusable components (buttons, cards, dialogs, etc.)
- Built with Radix UI primitives

### Feature Components (`src/components/`)
- `MealCard.tsx` - Recipe/meal display cards
- `StarRating.tsx` - Rating component
- `AnimatedChef.tsx` - Loading animations
- `GuidedTour.tsx` - User onboarding

## 📄 Pages Structure

### Core Pages
- `Home.tsx` - Dashboard with meal plans
- `Recipes.tsx` - Recipe browsing and management
- `Shopping.tsx` - Shopping list with recent items
- `Discover.tsx` - Recipe discovery
- `RecipeDetail.tsx` - Detailed recipe view with TTS

### User Management
- `Auth.tsx` - Authentication (login/register)
- `Profile.tsx` - User profile management
- `Settings.tsx` - App settings

### Additional Features
- `RecipeBuilder.tsx` - Create custom recipes
- `MealPlanTemplates.tsx` - Pre-made meal plans
- `Analytics.tsx` - Usage analytics
- `Premium.tsx` - Premium features

## 🔄 State Management

### Context Providers (`src/contexts/`)
- `AuthContext.tsx` - User authentication state
- `MealPlanContext.tsx` - Meal planning data
- `SavedRecipesContext.tsx` - Saved recipes management
- `NotificationContext.tsx` - Push notifications
- `ReviewsContext.tsx` - Recipe reviews and ratings

## 🔌 Services & APIs

### API Services (`src/services/`)
- `api.ts` - Main API service with authentication
- `recipeService.ts` - Recipe-specific operations
- `mealPlanSync.ts` - Meal plan synchronization

### Utility Services (`src/utils/`)
- `textToSpeech.ts` - TTS functionality (mobile + web)
- `security.ts` - XSS protection and input validation
- `errorHandler.ts` - Centralized error handling
- `recentItemsManager.ts` - Shopping list recent items

## 🔒 Security Features

### Implemented Security Measures
- **XSS Protection** - Input sanitization with DOMPurify
- **Secure Headers** - Content Security Policy
- **Input Validation** - Server-side validation
- **Error Handling** - Secure error messages
- **Authentication** - JWT token management

## 📱 Mobile Features

### Capacitor Plugins
- **Text-to-Speech** - Recipe instruction narration
- **Status Bar** - Native status bar styling
- **File System** - Local data storage

### Platform-Specific Features
- Native Android app packaging
- Mobile-optimized UI/UX
- Touch-friendly interactions

## 🎨 Styling & Theming

### Design System
- **Tailwind CSS** - Utility-first styling
- **Custom Theme** - Brand colors and typography
- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Theme switching

## 📊 Data Management

### Local Storage
- Recent items persistence
- User preferences
- Offline recipe caching

### API Integration
- RESTful API communication
- Authentication tokens
- Error handling and retries

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Mobile Development
```bash
npm run cap:build    # Build and sync with Capacitor
npm run cap:android  # Open Android Studio
npx cap sync         # Sync web assets with native
```

### Security & Quality
```bash
npm run security:audit  # Security audit
npm run lint           # Code linting
```

## 📋 Key Features

### ✅ Implemented Features
- **Recipe Management** - Browse, save, and create recipes
- **Meal Planning** - Weekly meal planning with drag-and-drop
- **Shopping Lists** - Auto-generated from meal plans
- **Text-to-Speech** - Recipe instruction narration
- **User Authentication** - Secure login/registration
- **Recipe Discovery** - Browse curated recipes
- **Reviews & Ratings** - Community feedback
- **Mobile App** - Native Android application
- **Security** - XSS protection and input validation

### 🔄 Recent Updates
- **TTS Integration** - Mobile-compatible text-to-speech
- **Security Fixes** - Comprehensive security improvements
- **Tab Reorganization** - Improved shopping list UX
- **Mobile Optimization** - Capacitor-based mobile app

## 🛠️ Development Guidelines

### Code Organization
- **TypeScript** - Strict type checking
- **Component-based** - Reusable UI components
- **Context Pattern** - State management
- **Custom Hooks** - Reusable logic

### Security Best Practices
- Input sanitization on all user inputs
- Secure error handling
- Authentication token management
- CORS configuration

### Mobile Development
- Platform detection for feature availability
- Native plugin integration
- Responsive design patterns
- Touch-optimized interactions

## 📞 Support & Documentation

- `README.md` - Quick start guide
- `BUILD_INSTRUCTIONS.md` - Detailed build process
- `SECURITY.md` - Security implementation details
- `TTS_USAGE.md` - Text-to-speech usage guide
- `ICON_SETUP.md` - App icon configuration

## 🎯 Future Enhancements

### Planned Features
- iOS app development
- Offline mode improvements
- Advanced meal planning algorithms
- Social sharing features
- Nutritional analysis
- Grocery store integration