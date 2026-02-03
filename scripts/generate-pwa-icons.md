# PWA Icon Generation Guide

## Quick Method: Online Tools

### Option 1: Real Favicon Generator (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload your logo (use `public/favicon.svg` or a high-res PNG)
3. Configure:
   - iOS: Check "Add to home screen"
   - Android Chrome: Check "Use Material Design"
   - Windows: Configure tile color (#8B5CF6)
4. Download and extract to `public/`

### Option 2: PWA Builder
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo
3. Generate all sizes
4. Download and extract to `public/icons/`

### Option 3: Maskable.app
For maskable icons (Android adaptive icons):
1. Go to https://maskable.app/editor
2. Upload your logo
3. Adjust safe zone
4. Export in required sizes

---

## Manual Method: Node.js Script

Install sharp for image processing:

```bash
npm install --save-dev sharp
```

Create `scripts/generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE = 'public/logo.png'; // Use a 1024x1024 PNG source
const OUTPUT_DIR = 'public/icons';

async function generateIcons() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate each size
  for (const size of SIZES) {
    await sharp(SOURCE)
      .resize(size, size)
      .png()
      .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`));

    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Generate shortcut icons (96x96)
  const shortcuts = ['talk', 'circle', 'chat'];
  for (const name of shortcuts) {
    await sharp(SOURCE)
      .resize(96, 96)
      .png()
      .toFile(path.join(OUTPUT_DIR, `shortcut-${name}.png`));

    console.log(`Generated shortcut-${name}.png`);
  }

  console.log('Done!');
}

generateIcons().catch(console.error);
```

Run:
```bash
node scripts/generate-icons.js
```

---

## Apple Splash Screens

Generate splash screens for iOS:

```javascript
const sharp = require('sharp');

const SPLASH_SIZES = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png' }, // iPad Pro 12.9"
  { width: 1170, height: 2532, name: 'apple-splash-1170-2532.png' }, // iPhone 14
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' }, // iPhone X/XS
];

async function generateSplash() {
  for (const { width, height, name } of SPLASH_SIZES) {
    // Create a gradient background with centered logo
    const background = Buffer.from(`
      <svg width="${width}" height="${height}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f0a1a"/>
            <stop offset="50%" style="stop-color:#1a0a2e"/>
            <stop offset="100%" style="stop-color:#0f0a1a"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
      </svg>
    `);

    const logo = await sharp('public/logo.png')
      .resize(Math.floor(width * 0.3))
      .toBuffer();

    await sharp(background)
      .composite([{
        input: logo,
        gravity: 'center'
      }])
      .png()
      .toFile(`public/splash/${name}`);

    console.log(`Generated ${name}`);
  }
}

generateSplash().catch(console.error);
```

---

## Required Files Checklist

After generation, verify you have:

```
public/
├── icons/
│   ├── icon-72x72.png      ✓
│   ├── icon-96x96.png      ✓
│   ├── icon-128x128.png    ✓
│   ├── icon-144x144.png    ✓
│   ├── icon-152x152.png    ✓
│   ├── icon-192x192.png    ✓
│   ├── icon-384x384.png    ✓
│   ├── icon-512x512.png    ✓
│   ├── shortcut-talk.png   ✓
│   ├── shortcut-circle.png ✓
│   └── shortcut-chat.png   ✓
├── splash/
│   ├── apple-splash-2048-2732.png  ✓
│   ├── apple-splash-1170-2532.png  ✓
│   └── apple-splash-1125-2436.png  ✓
├── og-image.png            ✓ (1200x630)
├── manifest.json           ✓
├── sw.js                   ✓
└── offline.html            ✓
```

---

## Testing PWA Installation

1. **Build the app:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Open Chrome DevTools → Application → Manifest**
   - Check for errors
   - Verify icons load

3. **Lighthouse Audit:**
   - DevTools → Lighthouse → PWA
   - Target: 90+ score

4. **Test Install:**
   - Look for install button in address bar
   - Or: Chrome menu → "Install Attune..."

5. **Mobile Testing:**
   - Open on mobile device
   - iOS: Share → Add to Home Screen
   - Android: Banner should appear, or menu → Add to Home Screen
