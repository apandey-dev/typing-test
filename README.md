# Typing Test – Speed & Accuracy Practice

A modern, distraction-free online typing assessment and practice web application built with React, TypeScript, and Tailwind CSS.

Live Production: [https://typing.apandey.me](https://typing.apandey.me)

## ✨ Features

- **Character-Level Highlighting**: Zero bulky block backgrounds; clean green text for correct characters and red underline indicator for mistypes.
- **Precision Caret**: Smooth, vertical blinking typing cursor.
- **100 Curated Original Passages**: Hosted on Cloudflare R2 across 11 diverse topics and 4 difficulty tiers (Beginner to Expert).
- **Proportional Scaling**: Automatically selects appropriate passages for 15s, 30s, 1m, 2m, 3m, 5m, and 10m tests.
- **Custom Tests**: Support for drag-and-drop `.txt` file uploads and custom passage pasting with complete client-side privacy (never uploaded to servers).
- **Industry Standard Metrics**: Gross WPM, Net WPM, Accuracy %, Keystroke Accuracy, CPM, and Consistency Score based on standard deviation.
- **Official Typing Certificates**: Downloadable PNG and high-fidelity PDF certificates featuring unique verification IDs and scannable QR codes.
- **Genuine QR Verification**: Instant online registry verification showing authentic recipient and performance credentials.
- **Themes**: Day, Night, and System theme synchronization.
- **Zero AI in V1**: Pure deterministic, privacy-friendly typing tests without external runtime model dependencies.

## 🚀 Architecture

- **Frontend**: React 19 + TypeScript 5.7 + Vite + Tailwind CSS 4
- **Hosting**: Vercel Production Platform
- **Content Storage**: Cloudflare R2 (`typing-content` bucket with public CDN distribution and CORS policies)
- **Domain**: `https://typing.apandey.me`

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build

# Preview production build
npm run preview
```

## 📄 License

MIT © [apandey-dev](https://github.com/apandey-dev)
