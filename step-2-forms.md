# 🎯 Angular 18 + Tailwind CSS - Simplified Forms Workshop

## เป้าหมายของ Workshop

เรียนรู้ Angular 18 **Reactive Forms** แบบง่ายที่สุด ผ่านการสร้าง Todo App โดยเน้นที่ **Forms และ Validation** สำหรับมือใหม่

### ✨ สิ่งที่จะได้เรียนรู้

- ✅ **Reactive Forms** (FormGroup/FormControl/FormBuilder)  
- ✅ **Form Validation** (required, maxlength, pattern)
- ✅ **Error Messages** แสดง error messages แบบง่าย
- ✅ **Form States** (valid, invalid, dirty, touched)
- ✅ **Form Submission** การส่งข้อมูล และ loading states
- ✅ **Form Reset** การรีเซ็ต form
- ✅ **Event Binding** (submit events)
- ✅ **@if/@for** Control Flow
- ✅ **Tailwind CSS** (forms, validation states)

---

## 📁 โครงสร้างแบบ Simplified

```
src/app/
├── models/
│   └── todo.model.ts           # Simple Todo Interface
├── components/
│   ├── todo-app/              # Main Component (Container)
│   │   ├── todo-app.component.ts
│   │   └── todo-app.component.html
│   ├── todo-form/             # Form Component with Validation
│   │   ├── todo-form.component.ts
│   │   └── todo-form.component.html
│   └── todo-item/             # Item Component
│       ├── todo-item.component.ts
│       └── todo-item.component.html
├── app.component.ts           # Root Component
└── app.component.html
```

---

## 🚀 Step 1: Simple Todo Model with Forms

สร้างไฟล์ `src/app/models/todo.model.ts`:

```typescript
export interface Todo {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}
```

---

## 🚀 Step 2: Todo Form Component with Reactive Forms

สร้างไฟล์ `src/app/components/todo-form/todo-form.component.ts`:

```typescript
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoFormData } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        ➕ Add New Todo
      </h2>
      
      <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
        <!-- Title Field -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="Enter todo title..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200"
            [class.border-red-500]="isFieldInvalid('title')"
            [class.border-green-500]="isFieldValid('title')"
          />
          
          <!-- Error Messages -->
          @if (isFieldInvalid('title')) {
            <div class="mt-1 text-sm text-red-600">
              @if (todoForm.get('title')?.errors?.['required']) {
                <p>Title is required</p>
              }
              @if (todoForm.get('title')?.errors?.['minlength']) {
                <p>Title must be at least 3 characters</p>
              }
              @if (todoForm.get('title')?.errors?.['maxlength']) {
                <p>Title must be less than 50 characters</p>
              }
            </div>
          }
        </div>

        <!-- Description Field -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="Enter description..."
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200"
            [class.border-red-500]="isFieldInvalid('description')"
            [class.border-green-500]="isFieldValid('description')">
          </textarea>
          
          @if (isFieldInvalid('description')) {
            <div class="mt-1 text-sm text-red-600">
              @if (todoForm.get('description')?.errors?.['maxlength']) {
                <p>Description must be less than 200 characters</p>
              }
            </div>
          }
        </div>

        <!-- Priority Field -->
        <div class="mb-4">
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
            Priority <span class="text-red-500">*</span>
          </label>
          <select
            id="priority"
            formControlName="priority"
            class="w-full px-3 py-2 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200"
            [class.border-red-500]="isFieldInvalid('priority')"
            [class.border-green-500]="isFieldValid('priority')">
            <option value="">Select priority...</option>
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
          
          @if (isFieldInvalid('priority')) {
            <div class="mt-1 text-sm text-red-600">
              @if (todoForm.get('priority')?.errors?.['required']) {
                <p>Priority is required</p>
              }
            </div>
          }
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="todoForm.invalid || isSubmitting"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium
                 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          @if (isSubmitting) {
            <span class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          } @else {
            Add Todo
          }
        </button>
      </form>

      <!-- Form Debug Info (Optional for learning) -->
      <div class="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p><strong>Form Valid:</strong> {{ todoForm.valid }}</p>
        <p><strong>Form Value:</strong> {{ todoForm.value | json }}</p>
      </div>
    </div>
  `
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<TodoFormData>();

  todoForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      description: ['', [
        Validators.maxLength(200)
      ]],
      priority: ['', [
        Validators.required
      ]]
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.todoForm.value;
      const todoData: TodoFormData = {
        title: formValue.title,
        description: formValue.description || undefined,
        priority: formValue.priority
      };
      
      // Simulate API call delay
      setTimeout(() => {
        this.todoAdded.emit(todoData);
        this.resetForm();
        this.isSubmitting = false;
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  private resetForm(): void {
    this.todoForm.reset();
    this.todoForm.markAsUntouched();
    this.todoForm.markAsPristine();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.todoForm.controls).forEach(key => {
      const control = this.todoForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return field ? field.valid && (field.dirty || field.touched) && field.value : false;
  }
}
```

---

## 🧩 Step 3: Main TodoApp Component with Forms

สร้างไฟล์ `src/app/components/todo-app/todo-app.component.ts`:

```typescript
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo, TodoFormData } from '../../models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-md mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            📝 Todo Forms App
          </h1>
          <p class="text-gray-600">Angular 18 + Reactive Forms</p>
        </div>

        <!-- Add Todo Form -->
        <app-todo-form 
          (todoAdded)="onTodoAdded($event)"
          class="mb-6 block">
        </app-todo-form>

        <!-- Statistics -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-xl font-bold text-blue-600">
                {{ totalTodos() }}
              </div>
              <div class="text-xs text-gray-600">Total</div>
            </div>
            <div>
              <div class="text-xl font-bold text-green-600">
                {{ completedTodos() }}
              </div>
              <div class="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div class="text-xl font-bold text-orange-600">
                {{ pendingTodos() }}
              </div>
              <div class="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        <!-- Todo List -->
        <div class="space-y-3">
          @if (todos().length === 0) {
            <!-- Empty State -->
            <div class="bg-white rounded-lg shadow-md p-8 text-center">
              <div class="text-4xl mb-3">📝</div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2">
                No todos yet!
              </h3>
              <p class="text-gray-500">
                Add your first todo above
              </p>
            </div>
          } @else {
            <!-- Todo Items -->
            @for (todo of todos(); track todo.id) {
              <app-todo-item
                [todo]="todo"
                (toggleCompleted)="onToggleTodo($event)"
                (deleteClicked)="onDeleteTodo($event)">
              </app-todo-item>
            }
          }
        </div>

        <!-- Actions -->
        @if (todos().length > 0) {
          <div class="mt-6 flex gap-3">
            <button
              (click)="onClearCompleted()"
              [disabled]="completedTodos() === 0"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                     hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200">
              Clear Completed ({{ completedTodos() }})
            </button>
            <button
              (click)="onClearAll()"
              class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium
                     hover:bg-gray-700 transition-colors duration-200">
              Clear All
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class TodoAppComponent {
  // Component State with initial data
  private _todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Learn Angular Forms',
      description: 'Master reactive forms and validation',
      priority: 'high',
      completed: false,
      createdAt: new Date('2025-01-01T10:00:00'),
      updatedAt: new Date('2025-01-01T10:00:00')
    },
    {
      id: 2,
      title: 'Build Todo App',
      description: 'Create a todo app with forms',
      priority: 'medium',
      completed: true,
      createdAt: new Date('2025-01-01T11:00:00'),
      updatedAt: new Date('2025-01-02T14:30:00')
    }
  ]);

  private _nextId = 3;

  // Public readonly signals
  readonly todos = this._todos.asReadonly();

  // Computed signals
  readonly totalTodos = computed(() => this._todos().length);
  readonly completedTodos = computed(() => 
    this._todos().filter(todo => todo.completed).length
  );
  readonly pendingTodos = computed(() => 
    this._todos().filter(todo => !todo.completed).length
  );

  // Event handlers
  onTodoAdded(formData: TodoFormData): void {
    const now = new Date();
    const newTodo: Todo = {
      id: this._nextId++,
      title: formData.title.trim(),
      description: formData.description?.trim(),
      priority: formData.priority,
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    this._todos.update(current => [...current, newTodo]);
  }

  onToggleTodo(id: number): void {
    this._todos.update(current =>
      current.map(todo =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() } 
          : todo
      )
    );
  }

  onDeleteTodo(id: number): void {
    this._todos.update(current => 
      current.filter(todo => todo.id !== id)
    );
  }

  onClearCompleted(): void {
    this._todos.update(current => 
      current.filter(todo => !todo.completed)
    );
  }

  onClearAll(): void {
    if (confirm('Are you sure you want to clear all todos?')) {
      this._todos.set([]);
      this._nextId = 1;
    }
  }
}
```

---

## 📋 Step 4: Enhanced Todo Item Component

สร้างไฟล์ `src/app/components/todo-item/todo-item.component.ts`:

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg">
      <div class="flex items-start justify-between">
        <!-- Left Side: Checkbox + Content -->
        <div class="flex items-start space-x-3 flex-1">
          <!-- Custom Checkbox -->
          <button
            (click)="onToggle()"
            class="w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class]="checkboxClasses">
            @if (todo.completed) {
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            }
          </button>

          <!-- Content -->
          <div class="flex-1">
            <!-- Title -->
            <h3 class="font-medium transition-all duration-200" [class]="titleClasses">
              {{ todo.title }}
            </h3>
            
            <!-- Description -->
            @if (todo.description) {
              <p class="text-sm text-gray-600 mt-1" [class]="descriptionClasses">
                {{ todo.description }}
              </p>
            }
            
            <!-- Priority & Date -->
            <div class="flex items-center gap-2 mt-2">
              <span class="text-xs px-2 py-1 rounded-full" [class]="priorityClasses">
                {{ priorityText }}
              </span>
              <span class="text-xs text-gray-400">
                {{ formatDate(todo.createdAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Side: Delete Button -->
        <button
          (click)="onDelete()"
          class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Delete todo">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggleCompleted = new EventEmitter<number>();
  @Output() deleteClicked = new EventEmitter<number>();

  get checkboxClasses(): string {
    return this.todo.completed
      ? 'bg-green-500 border-green-500'
      : 'border-gray-300 hover:border-blue-500';
  }

  get titleClasses(): string {
    return this.todo.completed
      ? 'text-gray-500 line-through'
      : 'text-gray-800';
  }

  get descriptionClasses(): string {
    return this.todo.completed
      ? 'line-through'
      : '';
  }

  get priorityClasses(): string {
    const baseClasses = 'font-medium';
    switch (this.todo.priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  get priorityText(): string {
    switch (this.todo.priority) {
      case 'high':
        return '🔴 High';
      case 'medium':
        return '🟡 Medium';
      case 'low':
        return '🟢 Low';
      default:
        return 'Unknown';
    }
  }

  onToggle() {
    this.toggleCompleted.emit(this.todo.id);
  }

  onDelete() {
    if (confirm(`Are you sure you want to delete "${this.todo.title}"?`)) {
      this.deleteClicked.emit(this.todo.id);
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }
}
```

---

## 🏠 Step 5: Update App Component

แก้ไข `src/app/app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { TodoAppComponent } from './components/todo-app/todo-app.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoAppComponent],
  template: `<app-todo-app></app-todo-app>`
})
export class AppComponent {
  title = 'Todo Forms App';
}
```

---

## 🎨 สิ่งที่ได้เรียนรู้

### ✅ Reactive Forms Basics
- **FormBuilder** - สร้าง reactive forms ง่าย ๆ
- **FormGroup** - กลุ่มของ form controls
- **FormControl** - แต่ละ input field  
- **Validators** - built-in validators (required, minLength, maxLength)
- **Form States** - valid, invalid, dirty, touched

### ✅ Form Validation & UX
- **Visual Feedback** - เปลี่ยนสี border เมื่อ invalid/valid
- **Error Messages** - แสดง error messages เฉพาะที่จำเป็น
- **Loading States** - แสดง loading ขณะ submit
- **Form Reset** - รีเซ็ต form หลัง submit สำเร็จ
- **Touch States** - แสดง error เมื่อ user แตะ field แล้ว

### ✅ Angular 18 Features
- **Standalone Components** - ไม่ต้องใช้ NgModule
- **@if/@for** - Control flow syntax ใหม่
- **Signals** - State management แบบใหม่
- **Event Binding** - (submit), (click) events
- **Input/Output** - Component communication

### ✅ Form Best Practices
- **Accessible Forms** - ใช้ label และ id
- **Progressive Enhancement** - แสดง error หลัง user interaction
- **User Feedback** - Loading states และ success feedback
- **Form Structure** - แยก validation logic อย่างชัดเจน
- **Type Safety** - ใช้ TypeScript interfaces

### ✅ Tailwind CSS for Forms
- **Form Styling** - input, textarea, select styles
- **Validation States** - border colors สำหรับ valid/invalid
- **Hover Effects** - hover:border-blue-500
- **Focus States** - focus:ring-2 focus:ring-blue-500
- **Transitions** - transition-all duration-200

---

## 🚀 การรันโปรเจค

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm start

# เปิด browser
http://localhost:4200
```

---

## 🎯 ฟีเจ่อร์ที่ได้

- ✅ เพิ่ม Todo พร้อม title, description, priority
- ✅ Form validation แบบ real-time
- ✅ Error messages แสดงเฉพาะเมื่อจำเป็น
- ✅ Loading state ขณะ submit
- ✅ Visual feedback (สี border เปลี่ยนตาม validation)
- ✅ Form reset หลัง submit สำเร็จ
- ✅ Priority display แบบสวยงาม (🔴🟡🟢)
- ✅ Toggle completed status
- ✅ Delete individual todos
- ✅ Clear completed/all actions
- ✅ Statistics display
- ✅ Responsive design

---

## 💡 เคล็ดลับสำหรับมือใหม่

1. **FormBuilder**: ใช้สร้าง form ง่าย ๆ แทนการสร้าง FormControl แยก
2. **Validators**: เริ่มจาก built-in validators ก่อน (required, minLength, maxLength)
3. **Form States**: เช็ค touched && invalid เพื่อแสดง error ที่เหมาะสม
4. **Visual Feedback**: ใช้ class binding เพื่อเปลี่ยนสี border
5. **Loading States**: แสดง loading ขณะ submit เพื่อ UX ที่ดี
6. **Form Reset**: อย่าลืม reset form หลัง submit สำเร็จ
7. **Type Safety**: ใช้ interface สำหรับ form data
8. **Event Handling**: ใช้ EventEmitter สำหรับ component communication
9. **Form Debug**: แสดง form value และ state เพื่อการเรียนรู้
10. **Accessibility**: ใช้ label และ proper form structure

---

**Happy Coding! 🎯**

เรียนรู้ Angular 18 Reactive Forms แบบ Simplified สำหรับมือใหม่!
