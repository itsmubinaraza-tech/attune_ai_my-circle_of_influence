const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');
const SPLASH_DIR = path.join(__dirname, '..', 'public', 'splash');

// SVG source for the logo (message bubble with music notes)
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6"/>
      <stop offset="100%" style="stop-color:#D946EF"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="url(#grad)"/>
  <path
    d="M80 20H20C15 20 12 23 12 28v40c0 5 3 8 8 8h12v12c0 1.2 1.4 1.8 2.4 1L48 76h32c5 0 8-3 8-8V28c0-5-3-8-8-8z"
    fill="rgba(255,255,255,0.2)"
  />
  <g fill="white" transform="translate(5, 5)">
    <ellipse cx="35" cy="55" rx="8" ry="6" transform="rotate(-20 35 55)"/>
    <ellipse cx="58" cy="48" rx="8" ry="6" transform="rotate(-20 58 48)"/>
    <rect x="41" y="28" width="3" height="28" rx="1.5"/>
    <rect x="64" y="22" width="3" height="28" rx="1.5"/>
    <path d="M42.5 28 L67 22 L67 27 L42.5 33 Z"/>
  </g>
</svg>
`;

// Shortcut icon SVGs
const SHORTCUT_ICONS = {
  talk: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6"/>
          <stop offset="100%" style="stop-color:#D946EF"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#grad)"/>
      <circle cx="50" cy="45" r="20" fill="white" opacity="0.9"/>
      <rect x="46" y="65" width="8" height="15" rx="4" fill="white" opacity="0.9"/>
      <path d="M30 75 Q50 90 70 75" stroke="white" stroke-width="4" fill="none" opacity="0.7"/>
    </svg>
  `,
  circle: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6"/>
          <stop offset="100%" style="stop-color:#D946EF"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#grad)"/>
      <circle cx="50" cy="35" r="12" fill="white"/>
      <circle cx="30" cy="60" r="10" fill="white" opacity="0.8"/>
      <circle cx="70" cy="60" r="10" fill="white" opacity="0.8"/>
      <circle cx="50" cy="75" r="8" fill="white" opacity="0.6"/>
      <line x1="50" y1="47" x2="35" y2="52" stroke="white" stroke-width="2" opacity="0.5"/>
      <line x1="50" y1="47" x2="65" y2="52" stroke="white" stroke-width="2" opacity="0.5"/>
    </svg>
  `,
  chat: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6"/>
          <stop offset="100%" style="stop-color:#D946EF"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#grad)"/>
      <rect x="20" y="25" width="60" height="40" rx="8" fill="white"/>
      <polygon points="35,65 45,65 30,80" fill="white"/>
      <circle cx="35" cy="45" r="4" fill="#8B5CF6"/>
      <circle cx="50" cy="45" r="4" fill="#8B5CF6"/>
      <circle cx="65" cy="45" r="4" fill="#8B5CF6"/>
    </svg>
  `
};

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  // Create output directories
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(SPLASH_DIR)) {
    fs.mkdirSync(SPLASH_DIR, { recursive: true });
  }

  // Generate main icons
  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    await sharp(Buffer.from(LOGO_SVG))
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated icon-${size}x${size}.png`);
  }

  // Generate shortcut icons (96x96)
  for (const [name, svg] of Object.entries(SHORTCUT_ICONS)) {
    const outputPath = path.join(OUTPUT_DIR, `shortcut-${name}.png`);

    await sharp(Buffer.from(svg))
      .resize(96, 96)
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated shortcut-${name}.png`);
  }

  // Generate OG image (1200x630)
  const ogSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0a1a"/>
          <stop offset="50%" style="stop-color:#1a0a2e"/>
          <stop offset="100%" style="stop-color:#0f0a1a"/>
        </linearGradient>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6"/>
          <stop offset="100%" style="stop-color:#D946EF"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgGrad)"/>
      <circle cx="100" cy="100" r="150" fill="#8B5CF6" opacity="0.1"/>
      <circle cx="1100" cy="530" r="200" fill="#D946EF" opacity="0.1"/>

      <!-- Logo centered -->
      <g transform="translate(500, 100)">
        <rect width="200" height="200" rx="40" fill="url(#iconGrad)"/>
        <path d="M160 40H40C30 40 24 46 24 56v80c0 10 6 16 16 16h24v24c0 2.4 2.8 3.6 4.8 2L96 152h64c10 0 16-6 16-16V56c0-10-6-16-16-16z" fill="rgba(255,255,255,0.2)"/>
        <g fill="white" transform="translate(10, 10)">
          <ellipse cx="70" cy="110" rx="16" ry="12" transform="rotate(-20 70 110)"/>
          <ellipse cx="116" cy="96" rx="16" ry="12" transform="rotate(-20 116 96)"/>
          <rect x="82" y="56" width="6" height="56" rx="3"/>
          <rect x="128" y="44" width="6" height="56" rx="3"/>
          <path d="M85 56 L134 44 L134 54 L85 66 Z"/>
        </g>
      </g>

      <text x="600" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-size="72" font-weight="700" fill="white">Attune</text>
      <text x="600" y="440" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" fill="rgba(255,255,255,0.7)">Your Personal AI Relationship Coach</text>
      <text x="600" y="490" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" fill="rgba(255,255,255,0.5)">Build stronger connections with expert-backed guidance</text>
    </svg>
  `;

  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'og-image.png'));

  console.log(`✅ Generated og-image.png (1200x630)`);

  // Generate Apple splash screens
  const splashConfigs = [
    { width: 1170, height: 2532, name: 'apple-splash-1170-2532.png' }, // iPhone 14
    { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' }, // iPhone X/XS
    { width: 1284, height: 2778, name: 'apple-splash-1284-2778.png' }, // iPhone 14 Pro Max
  ];

  for (const { width, height, name } of splashConfigs) {
    const logoSize = Math.floor(width * 0.25);
    const splashSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f0a1a"/>
            <stop offset="50%" style="stop-color:#1a0a2e"/>
            <stop offset="100%" style="stop-color:#0f0a1a"/>
          </linearGradient>
          <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B5CF6"/>
            <stop offset="100%" style="stop-color:#D946EF"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
        <g transform="translate(${(width - logoSize) / 2}, ${(height - logoSize) / 2 - 100})">
          <rect width="${logoSize}" height="${logoSize}" rx="${logoSize * 0.2}" fill="url(#iconGrad)"/>
          <g fill="white" transform="scale(${logoSize / 100})">
            <ellipse cx="40" cy="58" rx="9" ry="7" transform="rotate(-20 40 58)"/>
            <ellipse cx="63" cy="51" rx="9" ry="7" transform="rotate(-20 63 51)"/>
            <rect x="47" y="28" width="3" height="32" rx="1.5"/>
            <rect x="70" y="22" width="3" height="32" rx="1.5"/>
            <path d="M48.5 28 L73 22 L73 27 L48.5 33 Z"/>
          </g>
        </g>
        <text x="${width / 2}" y="${height / 2 + logoSize / 2}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${width * 0.06}" font-weight="600" fill="white">Attune</text>
      </svg>
    `;

    await sharp(Buffer.from(splashSvg))
      .resize(width, height)
      .png()
      .toFile(path.join(SPLASH_DIR, name));

    console.log(`✅ Generated ${name}`);
  }

  console.log('\n🎉 All icons generated successfully!');
  console.log(`\nOutput locations:`);
  console.log(`  Icons: ${OUTPUT_DIR}`);
  console.log(`  Splash: ${SPLASH_DIR}`);
  console.log(`  OG Image: public/og-image.png`);
}

generateIcons().catch(console.error);
