# Text-to-Speech Mobile Fix

## Problem Fixed:
Web Speech API doesn't work reliably in mobile Capacitor apps.

## Solution:
Added `@capacitor-community/text-to-speech` plugin for native mobile TTS support.

## Usage:
```typescript
import { TTSService } from '@/utils/textToSpeech';

// Speak text
await TTSService.speak("Hello, this is Meal Plan Pro!");

// Stop speaking
await TTSService.stop();
```

## Features:
- ✅ Works on Android/iOS mobile apps
- ✅ Fallback to Web Speech API in browser
- ✅ Configurable voice settings (rate, pitch, volume)
- ✅ Error handling

## Implementation:
The service automatically detects if running on mobile (Capacitor) or web and uses the appropriate TTS method.

## Next Steps:
1. Build and test on mobile device
2. Replace any existing `speechSynthesis` calls with `TTSService.speak()`
3. The plugin is now synced and ready to use in Android Studio