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
      // Enable TTS plugin
    }
  }
};

export default config;