# App Links Configuration

This document describes how to configure Android App Links and iOS Universal Links for Flyball Hub so that links to `app.flyballhub.com` and team subdomains open in the native app.

## Current Status

### Implemented (Web)
- `public/.well-known/assetlinks.json` - Android verification file (needs SHA256 fingerprint)
- `public/.well-known/apple-app-site-association` - iOS verification file (needs Team ID)
- `src/app/.well-known/[...path]/route.ts` - Route handler to serve files with correct headers

### TODO (Native - after Capacitor init)
- Android: Add intent filters to `AndroidManifest.xml`
- iOS: Add Associated Domains to `App.entitlements`

---

## Configuration Steps

### 1. Update Android Verification File

**File**: `public/.well-known/assetlinks.json`

Replace `TODO:REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your release signing key fingerprint.

To get your SHA256 fingerprint:
```bash
keytool -list -v -keystore your-release-key.jks -alias your-alias
```

Or for debug builds:
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### 2. Update iOS Verification File

**File**: `public/.well-known/apple-app-site-association`

Replace `TODO_TEAM_ID` with your Apple Developer Team ID.

To find your Team ID:
1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to Membership
3. Copy your Team ID

---

## After Capacitor Initialization

Once you run `npx cap init` and `npx cap add android/ios`, add these configurations:

### Android: AndroidManifest.xml

Add inside the `<activity>` tag in `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- App Links for app.flyballhub.com -->
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="app.flyballhub.com" />
</intent-filter>

<!-- App Links for team subdomains -->
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="*.flyballhub.com" />
</intent-filter>
```

### iOS: App.entitlements

Create/update `ios/App/App/App.entitlements`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.developer.associated-domains</key>
  <array>
    <string>applinks:app.flyballhub.com</string>
    <string>applinks:*.flyballhub.com</string>
  </array>
</dict>
</plist>
```

Also enable in Xcode: **Signing & Capabilities** → **+ Capability** → **Associated Domains**

---

## Handling Deep Links in App

To route users to specific screens based on the URL:

```typescript
import { App } from '@capacitor/app';

App.addListener('appUrlOpen', (event) => {
  const url = new URL(event.url);

  // Route based on pathname
  if (url.pathname.startsWith('/dashboard')) {
    // Navigate to dashboard
  } else if (url.pathname.startsWith('/team/')) {
    // Navigate to team page
  }
});
```

---

## Verification

### Test Android App Links
```bash
# Check assetlinks.json is accessible
curl -I https://app.flyballhub.com/.well-known/assetlinks.json

# Test on device
adb shell am start -W -a android.intent.action.VIEW -d "https://app.flyballhub.com/dashboard"
```

### Test iOS Universal Links
```bash
# Check AASA file
curl https://app.flyballhub.com/.well-known/apple-app-site-association

# Use Apple's validator
# https://search.developer.apple.com/appsearch-validation-tool/
```

---

## Notes

- **Verification delay**: Google/Apple cache these files - changes can take hours to propagate
- **Wildcard subdomains**: Each team subdomain (`team-name.flyballhub.com`) should resolve to the same domain serving these verification files
- **PWA conflict**: If a user has the PWA installed but not the native app, links will open in the browser
