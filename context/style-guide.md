# Verdict360 Lite Style Guide

## Overview
This style guide defines the visual design standards and styling patterns for the Verdict360 Lite multi-tenant SaaS platform. It ensures consistency across the application for both the chatbot interface and admin dashboards.

## Color Palette

### Primary Colors
```css
primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',  /* Main primary */
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
}
```

### Semantic Colors
- **Success**: `#10b981` (green-500)
- **Warning**: `#f59e0b` (amber-500)
- **Error**: `#ef4444` (red-500)
- **Info**: `#3b82f6` (blue-500)

### Neutral Colors
- **Background**: `#ffffff` (white)
- **Surface**: `#f9fafb` (gray-50)
- **Border**: `#e5e7eb` (gray-200)
- **Text Primary**: `#111827` (gray-900)
- **Text Secondary**: `#6b7280` (gray-500)
- **Text Muted**: `#9ca3af` (gray-400)

### Dark Theme
- **Background**: `#111827` (gray-900)
- **Surface**: `#1f2937` (gray-800)
- **Border**: `#374151` (gray-700)
- **Text Primary**: `#f9fafb` (gray-50)
- **Text Secondary**: `#d1d5db` (gray-300)

## Typography

### Font Families
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
```

### Font Sizes
- **Heading 1**: `text-4xl` (36px)
- **Heading 2**: `text-3xl` (30px)
- **Heading 3**: `text-2xl` (24px)
- **Heading 4**: `text-xl` (20px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)
- **Extra Small**: `text-xs` (12px)

### Font Weights
- **Bold**: `font-bold` (700)
- **Semibold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)
- **Normal**: `font-normal` (400)

## Spacing

### Standard Spacing Scale
- `space-1`: 0.25rem (4px)
- `space-2`: 0.5rem (8px)
- `space-3`: 0.75rem (12px)
- `space-4`: 1rem (16px)
- `space-6`: 1.5rem (24px)
- `space-8`: 2rem (32px)
- `space-12`: 3rem (48px)
- `space-16`: 4rem (64px)

### Padding Patterns
- **Button**: `px-4 py-2` (default), `px-3 py-1` (small), `px-8 py-3` (large)
- **Card**: `p-6`
- **Input**: `px-3 py-2`
- **Modal**: `p-6`

## Components

### Buttons

#### Primary Button
```tsx
className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-md font-medium transition-colors"
```

#### Secondary Button
```tsx
className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-md font-medium transition-colors"
```

#### Outline Button
```tsx
className="border border-gray-300 bg-transparent hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors"
```

#### Icon Button
```tsx
className="h-10 w-10 rounded-md hover:bg-gray-100 inline-flex items-center justify-center"
```

### Cards
```tsx
className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
```

### Inputs
```tsx
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
```

### Badges
- **Default**: `bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium`
- **Success**: `bg-green-100 text-green-800`
- **Warning**: `bg-yellow-100 text-yellow-800`
- **Error**: `bg-red-100 text-red-800`

## Layout

### Container
```css
max-width: 1280px;
margin: 0 auto;
padding: 0 1rem;
```

### Grid System
- **Dashboard Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Form Grid**: `grid grid-cols-1 md:grid-cols-2 gap-4`
- **Card Grid**: `grid grid-cols-1 lg:grid-cols-3 gap-6`

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Animations

### Transitions
```css
transition-all: 0.2s ease-in-out;
transition-colors: 150ms;
```

### Custom Animations

#### Slide Up
```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Pulse
```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
```

#### Spin
```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## Shadow System
- **Small**: `shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
- **Default**: `shadow` (0 1px 3px rgba(0,0,0,0.1))
- **Medium**: `shadow-md` (0 4px 6px rgba(0,0,0,0.1))
- **Large**: `shadow-lg` (0 10px 15px rgba(0,0,0,0.1))
- **Extra Large**: `shadow-xl` (0 20px 25px rgba(0,0,0,0.1))

## Border Radius
- **Small**: `rounded-sm` (2px)
- **Default**: `rounded` (4px)
- **Medium**: `rounded-md` (6px)
- **Large**: `rounded-lg` (8px)
- **Full**: `rounded-full` (9999px)

## Chat Widget Specific Styles

### Chat Message Bubbles
- **User Message**: `bg-primary-500 text-white rounded-2xl rounded-br-none`
- **Bot Message**: `bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none`

### Chat Widget Container
```css
width: 380px;
height: 600px;
max-width: calc(100vw - 2rem);
max-height: calc(100vh - 2rem);
```

### Chat Widget Button
```css
width: 64px;
height: 64px;
border-radius: 50%;
background: primary-500;
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Accessibility

### Focus States
```css
focus:outline-none 
focus:ring-2 
focus:ring-primary-500 
focus:ring-offset-2
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  animation: none;
  transition: none;
}
```

### Contrast Requirements
- Normal text: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

## Icons
Using Lucide React icons throughout the application:
- Size variants: 16px, 20px, 24px
- Default stroke width: 2px
- Color: Inherit from parent text color

## Form Validation States

### Error State
```css
border-color: #ef4444;
background-color: #fee2e2;
```

### Success State
```css
border-color: #10b981;
background-color: #d1fae5;
```

## Custom Scrollbar
```css
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
```

## Best Practices

1. **Consistency**: Always use the defined color palette and spacing scale
2. **Accessibility**: Ensure all interactive elements have proper focus states
3. **Responsive Design**: Design mobile-first and enhance for larger screens
4. **Performance**: Use CSS transitions instead of JavaScript animations when possible
5. **Dark Mode**: Always provide dark mode variants for components
6. **Typography**: Use semantic HTML elements and consistent font sizes
7. **Spacing**: Use consistent padding and margin values from the spacing scale
8. **Icons**: Keep icon sizes consistent within context (16px for small, 20px for medium, 24px for large)

## Component Library
The application uses a custom component library based on shadcn/ui patterns with Tailwind CSS. Components are located in `/src/client/src/components/ui/` and follow these principles:

- Composable and reusable
- Fully typed with TypeScript
- Accessible by default
- Customizable through className props
- Support for dark mode