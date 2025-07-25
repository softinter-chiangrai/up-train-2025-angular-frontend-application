# Step 5.1: Tailwind CSS Basics

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การใช้ **Tailwind CSS** เพื่อสร้าง UI ที่สวยงามและ responsive

---

## 📚 สิ่งที่จะได้เรียนรู้
- Tailwind CSS Utilities
- Responsive Design
- Color System
- Typography
- Spacing และ Layout

---

## 📋 Prerequisites
- ✅ Step 4.1 เสร็จแล้ว (Todo Item Component)
- ✅ Tailwind CSS ติดตั้งแล้วในโปรเจค

---

## 📝 Task: ปรับปรุง UI ด้วย Tailwind CSS

### 1. ตรวจสอบ Tailwind Configuration

ตรวจสอบไฟล์ `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // TODO: เพิ่ม custom theme configuration
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // เพิ่ม custom colors ตามต้องการ
      },
      fontFamily: {
        // TODO: เพิ่ม custom fonts
      },
      spacing: {
        // TODO: เพิ่ม custom spacing
      },
      animation: {
        // TODO: เพิ่ม custom animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
```

### 2. ปรับปรุง App Component ด้วย Tailwind

แก้ไข `src/app/app.component.html`:

```html
<!-- TODO: ใช้ Tailwind classes แทน custom CSS -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        📝 Modern Todo App
      </h1>
      <p class="text-gray-600 text-lg">
        Built with Angular 18 + Tailwind CSS
      </p>
    </div>

    <!-- Main Todo App -->
    <app-todo-app class="block"></app-todo-app>
  </div>
</div>
```

### 3. ปรับปรุง TodoApp Component ด้วย Tailwind

แก้ไข `src/app/components/todo-app/todo-app.component.html`:

```html
<div class="space-y-6">
  
  <!-- Add Todo Form -->
  <app-todo-form 
    (todoAdded)="onTodoAdded($event)"
    class="block">
  </app-todo-form>

  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- TODO: สร้าง statistics cards ด้วย Tailwind -->
    
    <!-- Total Todos Card -->
    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Todos</p>
          <p class="text-3xl font-bold text-blue-600">{{ totalTodos() }}</p>
        </div>
        <div class="p-3 bg-blue-100 rounded-full">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Completed Todos Card -->
    <!-- TODO: สร้าง completed card เหมือน total card -->
    <!-- ใช้ green color scheme -->
    <div class="">
      <!-- เขียน HTML ตรงนี้ -->
    </div>

    <!-- Pending Todos Card -->
    <!-- TODO: สร้าง pending card เหมือน total card -->
    <!-- ใช้ orange color scheme -->
    <div class="">
      <!-- เขียน HTML ตรงนี้ -->
    </div>
  </div>

  <!-- Todo List Container -->
  <div class="bg-white rounded-xl shadow-lg border border-gray-100">
    
    <!-- List Header -->
    <div class="px-6 py-4 border-b border-gray-100">
      <h3 class="text-lg font-semibold text-gray-800">Your Todos</h3>
      @if (todos().length > 0) {
        <p class="text-sm text-gray-600 mt-1">
          {{ completedTodos() }} of {{ totalTodos() }} completed
        </p>
      }
    </div>

    <!-- Todo List -->
    <div class="divide-y divide-gray-100">
      <!-- Empty State -->
      @if (todos().length === 0) {
        <div class="px-6 py-16 text-center">
          <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
          <p class="text-gray-500">Get started by adding your first todo above!</p>
        </div>
      } @else {
        <!-- Todo Items -->
        @for (todo of todos(); track todo.id; let i = $index) {
          <div class="p-6 hover:bg-gray-50 transition-colors duration-200">
            <app-todo-item
              [todo]="todo"
              [index]="i"
              (toggleCompleted)="onToggleTodo($event)"
              (deleteClicked)="onDeleteTodo($event)"
              (editClicked)="onEditTodo($event)">
            </app-todo-item>
          </div>
        }
      }
    </div>

    <!-- List Actions -->
    @if (todos().length > 0) {
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- TODO: สร้าง action buttons ด้วย Tailwind -->
          
          <!-- Clear Completed Button -->
          <button
            (click)="onClearCompleted()"
            [disabled]="completedTodos() === 0"
            class="flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   enabled:hover:bg-red-50 enabled:hover:border-red-300 enabled:hover:text-red-700
                   border-red-200 text-red-600 bg-white">
            Clear Completed ({{ completedTodos() }})
          </button>

          <!-- Clear All Button -->
          <!-- TODO: สร้าง clear all button เหมือน clear completed -->
          <!-- ใช้ gray color scheme -->
          <button
            (click)="onClearAll()"
            class="">
            Clear All
          </button>
        </div>
      </div>
    }
  </div>

</div>
```

### 4. ปรับปรุง TodoForm Component ด้วย Tailwind

แก้ไข `src/app/components/todo-form/todo-form.component.html`:

```html
<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
  
  <!-- Form Header -->
  <div class="mb-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-2">
      ➕ Add New Todo
    </h2>
    <p class="text-gray-600 text-sm">
      What would you like to accomplish today?
    </p>
  </div>

  <!-- Form -->
  <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="space-y-4">
    
    <!-- Input Group -->
    <div class="space-y-2">
      
      <!-- Input with Button -->
      <div class="flex gap-3">
        <!-- TODO: ปรับปรุง input field ด้วย Tailwind -->
        <input 
          type="text"
          formControlName="title"
          placeholder="Enter your todo..."
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                 placeholder-gray-500 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                 disabled:bg-gray-50 disabled:text-gray-500"
          [class.border-red-300]="isFieldInvalid('title')"
          [class.focus:ring-red-500]="isFieldInvalid('title')">
        
        <!-- Submit Button -->
        <!-- TODO: ปรับปรุง submit button ด้วย Tailwind -->
        <button 
          type="submit"
          [disabled]="todoForm.invalid || isSubmitting"
          class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:bg-gray-300 disabled:cursor-not-allowed
                 transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center">
          
          <!-- Loading Spinner -->
          @if (isSubmitting) {
            <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Adding...</span>
          } @else {
            <span>Add Todo</span>
          }
        </button>
      </div>

      <!-- Error Message -->
      @if (isFieldInvalid('title')) {
        <div class="flex items-center gap-2 text-red-600 text-sm">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ getFieldError('title') }}</span>
        </div>
      }
    </div>

    <!-- Progress Section -->
    <!-- TODO: สร้าง progress section ด้วย Tailwind -->
    <div class="space-y-2">
      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          [style.width.%]="getProgressPercentage()"
          [class]="getProgressPercentage() > 80 ? 
                   (getProgressPercentage() > 90 ? 'bg-red-500' : 'bg-yellow-500') : 
                   'bg-blue-500'">
        </div>
      </div>
      
      <!-- Character Info -->
      <div class="flex justify-between text-xs text-gray-500">
        <span>{{ getCharacterCount() }}/50 characters</span>
        <span 
          [class]="getCharacterCount() > 45 ? 'text-red-500' : 
                   getCharacterCount() > 40 ? 'text-yellow-500' : 'text-gray-500'">
          {{ 50 - getCharacterCount() }} remaining
        </span>
      </div>
    </div>

  </form>
</div>
```

### 5. ปรับปรุง TodoItem Component ด้วย Tailwind

แก้ไข `src/app/components/todo-item/todo-item.component.html`:

```html
<div class="group transition-all duration-200 hover:bg-gray-50 rounded-lg p-4 -m-4">
  
  <!-- Normal View -->
  @if (!isEditing) {
    <div class="flex items-center justify-between">
      
      <!-- Left Section -->
      <div class="flex items-center gap-4 flex-1 min-w-0">
        
        <!-- Custom Checkbox -->
        <!-- TODO: สร้าง custom checkbox ด้วย Tailwind -->
        <button
          (click)="onToggle()"
          class="flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200
                 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          [class]="todo.completed ? 
                   'bg-green-500 border-green-500 text-white' : 
                   'border-gray-300 hover:border-blue-400 bg-white'">
          
          @if (todo.completed) {
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          }
        </button>

        <!-- Content Section -->
        <div class="flex-1 min-w-0">
          <!-- Title -->
          <!-- TODO: ปรับปรุง title styling ด้วย Tailwind -->
          <div 
            (dblclick)="startEdit()"
            class="font-medium text-gray-900 cursor-pointer transition-all duration-200
                   hover:text-blue-600 truncate"
            [class]="todo.completed ? 'line-through text-gray-500' : ''">
            {{ todo.title }}
          </div>
          
          <!-- Metadata -->
          <div class="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <!-- Date -->
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
              {{ formatDate(todo.createdAt) }}
            </span>
            
            <!-- Word Count -->
            <!-- TODO: เพิ่ม word count ด้วย Tailwind -->
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
              </svg>
              {{ getWordCount() }} words
            </span>

            @if (index !== undefined) {
              <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                #{{ index + 1 }}
              </span>
            }
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <!-- TODO: สร้าง action buttons ด้วย Tailwind -->
      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <!-- Edit Button -->
        <button
          (click)="startEdit()"
          class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Edit todo">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>

        <!-- Delete Button -->
        <!-- TODO: สร้าง delete button เหมือน edit button -->
        <!-- ใช้ red color scheme -->
        <button
          (click)="onDelete()"
          class=""
          title="Delete todo">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  }

  <!-- Edit View -->
  @else {
    <div class="flex items-center gap-3">
      <!-- Edit Input -->
      <!-- TODO: สร้าง edit input ด้วย Tailwind -->
      <input 
        type="text"
        [(ngModel)]="editTitle"
        (keypress)="onKeyPress($event)"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
               transition-all duration-200"
        #editInput>

      <!-- Edit Actions -->
      <div class="flex items-center gap-2">
        <!-- Save Button -->
        <button
          (click)="saveEdit()"
          [disabled]="!editTitle.trim()"
          class="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg
                 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                 disabled:bg-gray-300 disabled:cursor-not-allowed
                 transition-all duration-200">
          Save
        </button>

        <!-- Cancel Button -->
        <!-- TODO: สร้าง cancel button เหมือน save button -->
        <!-- ใช้ gray color scheme -->
        <button
          (click)="cancelEdit()"
          class="">
          Cancel
        </button>
      </div>
    </div>
  }

</div>
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Tailwind Classes Working

ตรวจสอบใน browser:
- ✅ สีและ styling แสดงผลถูกต้อง
- ✅ Hover effects ทำงาน
- ✅ Responsive design ใน mobile/tablet
- ✅ Animations และ transitions ทำงาน

### Test 2: Component Styling

ตรวจสอบแต่ละ component:
- ✅ Cards และ shadows แสดงผล
- ✅ Icons และ colors ถูกต้อง
- ✅ Typography และ spacing สม่ำเสมอ
- ✅ Interactive states (hover, focus, disabled)

### Test 3: Responsive Design

ทดสอบใน screen sizes ต่างๆ:
- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)  
- ✅ Desktop (> 1024px)

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Professional UI Design

- ✅ Consistent color scheme
- ✅ Modern card-based layout
- ✅ Beautiful shadows และ borders
- ✅ Smooth animations

### 2. Responsive Layout

- ✅ Grid system ที่ responsive
- ✅ Flexible spacing
- ✅ Mobile-first design
- ✅ Touch-friendly interactions

### 3. Enhanced User Experience

- ✅ Hover effects
- ✅ Focus states
- ✅ Loading indicators
- ✅ Visual feedback

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ Tailwind CSS Fundamentals
- Utility-first approach
- Responsive design patterns
- Color และ spacing systems
- Typography utilities

### ✅ Component Styling
- Card designs
- Button variants
- Form styling
- Icon integration

### ✅ Advanced Techniques
- Custom animations
- Conditional classes
- Hover และ focus states
- Mobile-responsive design

### ✅ Design Systems
- Consistent spacing
- Color schemes
- Typography scales
- Component patterns

---

## 🔧 Troubleshooting

### ❌ Tailwind classes ไม่ทำงาน
**Solution**: ตรวจสอบ tailwind.config.js และ content paths
```javascript
content: ["./src/**/*.{html,ts}"]
```

### ❌ Custom colors ไม่แสดง
**Solution**: ตรวจสอบ theme.extend ใน config
```javascript
theme: {
  extend: {
    colors: {
      primary: {...}
    }
  }
}
```

### ❌ Responsive breakpoints ไม่ทำงาน
**Solution**: ใช้ responsive prefixes ถูกต้อง
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 5.2: Advanced Tailwind Effects](./step-5.2-hover-transitions.md)

---

## 💡 เคล็ดลับ

1. **Utility-First**: ใช้ utilities แทน custom CSS
2. **Consistent Spacing**: ใช้ spacing scale ของ Tailwind
3. **Responsive Design**: เริ่มจาก mobile-first
4. **Performance**: Tailwind จะ purge unused classes automatically

---

**🎯 Goal Achieved**: สร้าง Professional UI ด้วย Tailwind CSS!
