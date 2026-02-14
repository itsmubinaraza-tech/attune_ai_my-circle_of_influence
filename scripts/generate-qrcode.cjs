const QRCode = require('qrcode');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateQRCodeWithLogo() {
  const url = 'https://weattuned.com';
  const outputPath = path.join(__dirname, '..', 'public', 'qrcode-weattuned.png');
  const logoPath = path.join(__dirname, '..', 'public', 'favicon.svg');

  // QR code size
  const qrSize = 1000;
  const logoSize = 200; // Logo will be 20% of QR code

  try {
    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: qrSize,
      margin: 2,
      color: {
        dark: '#1a1a2e',  // Dark purple color matching the app theme
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H' // High error correction to allow logo overlay
    });

    // Convert SVG logo to PNG and resize
    const logoBuffer = await sharp(logoPath)
      .resize(logoSize, logoSize)
      .png()
      .toBuffer();

    // Create a white circle background for the logo
    const circleBackground = Buffer.from(`
      <svg width="${logoSize + 40}" height="${logoSize + 40}">
        <circle cx="${(logoSize + 40) / 2}" cy="${(logoSize + 40) / 2}" r="${(logoSize + 40) / 2}" fill="white"/>
      </svg>
    `);

    const circleBuffer = await sharp(circleBackground)
      .png()
      .toBuffer();

    // Composite: QR code + white circle + logo
    const logoPosition = Math.floor((qrSize - logoSize) / 2);
    const circlePosition = Math.floor((qrSize - logoSize - 40) / 2);

    await sharp(qrBuffer)
      .composite([
        {
          input: circleBuffer,
          top: circlePosition,
          left: circlePosition
        },
        {
          input: logoBuffer,
          top: logoPosition,
          left: logoPosition
        }
      ])
      .toFile(outputPath);

    console.log(`QR code generated successfully: ${outputPath}`);
    console.log(`URL encoded: ${url}`);

  } catch (error) {
    console.error('Error generating QR code:', error);
    process.exit(1);
  }
}

generateQRCodeWithLogo();
