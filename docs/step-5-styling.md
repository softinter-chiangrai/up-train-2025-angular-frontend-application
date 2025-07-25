# Step 5: Styling

🎯 **เป้าหมาย**: ปรับแต่ง UI/UX ด้วย Tailwind CSS และสร้าง responsive design

## 📋 สิ่งที่จะทำใน Step นี้

- [ ] ปรับปรุง design system
- [ ] เพิ่ม animations และ transitions  
- [ ] สร้าง responsive layout
- [ ] เพิ่ม dark mode support
- [ ] ปรับปรุง accessibility

## 🎨 Design System

### 1. อัพเดท Global Styles

แก้ไข `src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS Variables */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 500ms ease;
}

/* Dark mode variables */
[data-theme="dark"] {
  --color-gray-50: #1f2937;
  --color-gray-100: #374151;
  --color-gray-200: #4b5563;
  --color-gray-300: #6b7280;
  --color-gray-500: #9ca3af;
  --color-gray-700: #d1d5db;
  --color-gray-800: #e5e7eb;
  --color-gray-900: #f9fafb;
}

/* Global styles */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: var(--color-gray-800);
  background-color: var(--color-gray-50);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

/* Focus styles for accessibility */
.focus-visible:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-gray-100);
}

::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-500);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
```

### 2. อัพเดท Tailwind Config

แก้ไข `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-light': 'bounceLight 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
```

ติดตั้ง Tailwind Forms plugin:

```bash
npm install -D @tailwindcss/forms
```

## 🌙 Dark Mode Support

### 1. สร้าง Theme Service

สร้าง `src/app/services/theme.service.ts`:

```typescript
import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'todo-app-theme';
  
  // Current theme signal
  private _currentTheme = signal<Theme>('system');
  currentTheme = this._currentTheme.asReadonly();

  // System theme detection
  private _systemTheme = signal<'light' | 'dark'>('light');
  systemTheme = this._systemTheme.asReadonly();

  // Active theme (resolved from current + system)
  private _activeTheme = signal<'light' | 'dark'>('light');
  activeTheme = this._activeTheme.asReadonly();

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeDetection();
    
    // Effect to apply theme changes
    effect(() => {
      this.applyTheme(this._activeTheme());
    });
  }

  private initializeTheme(): void {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this._currentTheme.set(savedTheme);
    }

    this.updateActiveTheme();
  }

  private setupSystemThemeDetection(): void {
    // Initial system theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this._systemTheme.set(systemTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this._systemTheme.set(e.matches ? 'dark' : 'light');
      this.updateActiveTheme();
    });

    this.updateActiveTheme();
  }

  private updateActiveTheme(): void {
    const current = this._currentTheme();
    const system = this._systemTheme();
    
    const resolved = current === 'system' ? system : current;
    this._activeTheme.set(resolved);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    }
  }

  // Public methods
  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.updateActiveTheme();
  }

  toggleTheme(): void {
    const current = this._currentTheme();
    
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }

  getThemeIcon(): string {
    const theme = this._currentTheme();
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '💻';
      default: return '💻';
    }
  }

  getThemeLabel(): string {
    const theme = this._currentTheme();
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  }
}
```

### 2. เพิ่ม Theme Toggle Component

สร้าง `src/app/components/theme-toggle/theme-toggle.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      [title]="'Current theme: ' + themeService.getThemeLabel()"
    >
      <span class="text-lg">{{ themeService.getThemeIcon() }}</span>
    </button>
  `
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
```

## 📱 Responsive Design

### 1. อัพเดท TodoAppComponent Template

แก้ไข `src/app/components/todo-app/todo-app.component.html`:

```html
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <!-- Container with responsive padding -->
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Main content wrapper -->
    <div class="max-w-2xl mx-auto">
      
      <!-- Header with theme toggle -->
      <header class="text-center mb-8 animate-fade-in">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              📝 Todo App
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Angular 18 + Signals + Tailwind CSS
            </p>
          </div>
          <app-theme-toggle class="ml-4"></app-theme-toggle>
        </div>
        
        <!-- Quick stats -->
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ statusText() }}
        </div>
      </header>

      <!-- Add Todo Form -->
      <section class="mb-8 animate-slide-up">
        <app-todo-form 
          (todoAdded)="onTodoAdded($event)"
          class="block">
        </app-todo-form>
      </section>

      <!-- Statistics Card -->
      <section class="mb-8 animate-slide-up" style="animation-delay: 0.1s">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          
          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ progressPercentage() }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                [style.width.%]="progressPercentage()"
              ></div>
            </div>
          </div>
          
          <!-- Statistics Grid -->
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ totalTodos() }}
              </div>
              <div class="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Total Tasks
              </div>
            </div>
            <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ completedTodos() }}
              </div>
              <div class="text-xs text-green-700 dark:text-green-300 font-medium">
                Completed
              </div>
            </div>
            <div class="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {{ pendingTodos() }}
              </div>
              <div class="text-xs text-orange-700 dark:text-orange-300 font-medium">
                Pending
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Bar -->
      <section class="mb-6 animate-slide-up" style="animation-delay: 0.2s">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          
          <!-- Status Text -->
          <div class="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
            <span class="hidden sm:inline">Status: </span>{{ statusText() }}
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 order-1 sm:order-2">
            @if (completedTodos() > 0 && canPerformActions()) {
              <button 
                (click)="clearCompleted()"
                class="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Clear Completed
              </button>
            }
            
            <button 
              (click)="refreshTodos()"
              [disabled]="isLoading()"
              class="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 transition-colors"
            >
              @if (isLoading()) {
                <span class="flex items-center">
                  <div class="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent mr-1"></div>
                  Refreshing...
                </span>
              } @else {
                🔄 Refresh
              }
            </button>
          </div>
        </div>
      </section>

      <!-- Rest of the template (Error, Loading, Todo List) remains similar but with dark mode classes -->
      <!-- ... -->
      
    </div>
  </div>
</div>
```

## 🎯 Accessibility Improvements

### 1. เพิ่ม ARIA attributes

```html
<!-- ใน todo-app.component.html -->
<main role="main" aria-label="Todo application">
  
  <!-- Progress bar với aria attributes -->
  <div 
    role="progressbar" 
    [attr.aria-valuenow]="progressPercentage()"
    aria-valuemin="0" 
    aria-valuemax="100"
    [attr.aria-label]="'Todo completion progress: ' + progressPercentage() + ' percent'"
    class="w-full bg-gray-200 rounded-full h-3"
  >
    <!-- progress content -->
  </div>

  <!-- Todo list -->
  <ul role="list" aria-label="Todo items">
    @for (todo of todos(); track trackByTodoId($index, todo)) {
      <li role="listitem" class="todo-item">
        <!-- todo content -->
      </li>
    }
  </ul>

</main>
```

### 2. เพิ่ม Keyboard Navigation

```typescript
// ใน todo-app.component.ts
@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
  // Quick add todo with Ctrl+Enter
  if (event.ctrlKey && event.key === 'Enter') {
    // Focus on add todo input
    const input = document.querySelector('input[placeholder*="Add"]') as HTMLInputElement;
    input?.focus();
  }
  
  // Quick refresh with F5 or Ctrl+R
  if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
    event.preventDefault();
    this.refreshTodos();
  }
}
```

## 🎨 Animation Enhancements

### 1. เพิ่ม CSS animations

```css
/* ใน todo-app.component.css */

/* Staggered animations for list items */
.todo-item {
  animation: slideUp 0.3s ease-out;
  animation-fill-mode: both;
}

.todo-item:nth-child(1) { animation-delay: 0.1s; }
.todo-item:nth-child(2) { animation-delay: 0.15s; }
.todo-item:nth-child(3) { animation-delay: 0.2s; }
.todo-item:nth-child(4) { animation-delay: 0.25s; }
.todo-item:nth-child(5) { animation-delay: 0.3s; }

/* Smooth check/uncheck animation */
.todo-checkbox {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.todo-checkbox:checked {
  animation: bounceLight 0.6s ease-out;
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.todo-card {
  transition: all 0.2s ease;
}

.todo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Focus styles */
.focus-ring:focus-visible {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
}
```

## ✅ ตรวจสอบผลลัพธ์

- [ ] Design system ใช้งานได้
- [ ] Dark mode ทำงานได้
- [ ] Responsive design ใช้งานได้บนหน้าจอขนาดต่างๆ
- [ ] Animations ทำงานได้
- [ ] Accessibility features ทำงานได้
- [ ] Theme toggle ทำงานได้
- [ ] Performance ไม่มีปัญหา

## 🔧 การทดสอบ

1. **Responsive**: ลองเปลี่ยนขนาดหน้าจอ
2. **Dark Mode**: ทดสอบ toggle theme
3. **Accessibility**: ใช้ keyboard navigation
4. **Animations**: สังเกต transitions และ animations
5. **Performance**: ตรวจสอบ smooth scrolling

## 🔗 ขั้นตอนถัดไป

✅ **สำเร็จแล้ว?** ไปต่อที่ [Step 6: API Integration](./step-6-integration.md)

---

<div align="center">
  <a href="./step-4-forms.md">⬅️ Step 4: Forms</a> | 
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a> | 
  <a href="./step-6-integration.md">➡️ Step 6: Integration</a>
</div>
