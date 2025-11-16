# App Icon Setup Instructions

## Steps to Replace Capacitor Logo:

### 1. Save Your Icon Image
- Save the provided image as `icon.png` in the `public/` folder
- Recommended size: 1024x1024 pixels
- Format: PNG with transparent background

### 2. Generate Icon Sizes
Install the Capacitor Assets plugin:
```bash
npm install @capacitor/assets --save-dev
```

### 3. Create Icon Variants
Run the assets generator:
```bash
npx capacitor-assets generate --iconBackgroundColor '#FFFFFF' --iconBackgroundColorDark '#000000' --splashBackgroundColor '#FFFFFF' --splashBackgroundColorDark '#000000'
```

### 4. Manual Icon Replacement (Alternative)
If the generator doesn't work, manually replace these files:

**Android Icons:**
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

### 5. Update Capacitor Config
Add icon path to `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  // ... existing config
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000'
    }
  }
};
```

### 6. Sync and Build
```bash
npx cap sync
npx cap open android
```

## Note:
Please save the actual image file as `public/icon.png` and follow the steps above to properly set up the app icon.