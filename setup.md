# Setup Notes for Claude Code

## Install Dependencies
npm install

## Run Dev Server
npm run dev

## Key Environment Facts
- React 18 + TypeScript + Tailwind CSS
- All data is static (no API calls needed for data)
- Geolocation for birth place: use a free geocoding API
  or accept manual lat/lon input as fallback
- No authentication required
- Target browsers: Chrome, Safari, Firefox (modern)

## Tailwind Note
Use only Tailwind core utility classes.
Do not add custom plugins or extend config unless necessary.

## Font Loading
Add to index.html:
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

## PDF Export
Use window.print() with print-specific CSS for the Report tab.
Or install: npm install jspdf html2canvas

## Lucide React (Icons)
Already available: import { Sun, Moon, Star } from 'lucide-react'