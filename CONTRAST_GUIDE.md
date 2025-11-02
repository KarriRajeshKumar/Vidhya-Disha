# Color Contrast Guide

## Problem Fixed
Font colors were merging with background colors, making text hard to read, especially in dark mode.

## Solution Applied

### 1. Updated CSS Variables
- **Dark mode**: Improved `--muted-foreground` from 65.1% to 75% lightness for better contrast
- **Light mode**: Improved `--muted-foreground` from 46.9% to 35% lightness for better contrast
- **Cards**: Better separation between card backgrounds and main background

### 2. Replaced Hardcoded Colors
- `text-gray-300` → `text-muted-foreground`
- `text-gray-600` → `text-muted-foreground`
- `text-gray-700` → `text-foreground`
- `text-gray-800` → `text-foreground`
- `text-gray-900` → `text-foreground`
- `text-white` → `text-foreground`

### 3. Added Utility Classes
```css
.text-high-contrast     /* Use for primary text */
.text-medium-contrast   /* Use for secondary text */
.contrast-safe          /* Ensures minimum contrast */
.contrast-safe-card     /* For card content */
```

## Best Practices Going Forward

### ✅ DO Use These Classes
- `text-foreground` - Primary text color
- `text-muted-foreground` - Secondary text color
- `text-card-foreground` - Text on cards
- `text-primary` - Brand color text
- `bg-background` - Main background
- `bg-card` - Card backgrounds
- `bg-muted` - Subtle backgrounds

### ❌ DON'T Use These
- `text-gray-*` classes (except in specific design contexts)
- `text-white` or `text-black` (use semantic colors instead)
- Hardcoded hex colors for text
- Low contrast combinations

### Component Usage
```tsx
// Good
<p className="text-muted-foreground">Secondary text</p>
<h1 className="text-foreground">Primary heading</h1>

// Better - using the ContrastText component
<ContrastText variant="medium">Secondary text</ContrastText>
<ContrastText variant="high">Primary heading</ContrastText>
```

### Testing Contrast
1. Test in both light and dark modes
2. Use browser dev tools to check contrast ratios
3. Aim for WCAG AA compliance (4.5:1 ratio minimum)

## Files Modified
- `src/index.css` - Updated CSS variables and added utilities
- `src/pages/Landing.tsx` - Fixed hardcoded gray colors
- `src/pages/NotFound.tsx` - Fixed text contrast
- `src/pages/UpToDate.tsx` - Fixed navigation and category colors
- `src/components/ui/contrast-text.tsx` - New utility component

Your website now has proper color contrast in both light and dark modes!