# 🎯 Angular 18 + Tailwind CSS - Simplified Todo Workshop

## เป้าหมายของ Workshop

เรียนรู้ Angular 18 + Tailwind CSS แบบง่ายที่สุด ผ่านการสร้าง Todo App โดยใช้ Standalone Components และ Tailwind CSS เพื่อสร้าง UI ที่สวยงามและตอบสนองได้ดี

### ✨ สิ่งที่จะได้เรียนรู้

- ✅ **Angular 18** Standalone Components
- ✅ **Reactive Forms** (FormGroup/FormControl)
- ✅ **Form Validation** (required, maxlength)
- ✅ **Event Binding** (click events)
- ✅ **@if/@for** Control Flow
- ✅ **Angular Services** สำหรับจัดการ State & Business Logic
- ✅ **Dependency Injection** การใช้ Services ใน Componen- ✅ **Timestamps** - createdAt และ updatedAt tracking
- ✅ **Date Formatting** - Relative time display (Just now, 5m ago, etc.)
- ✅ **Automatic Updates** - updatedAt เปลี่ยนเมื่อมี modificationss
- ✅ **Signals in Services** การใช้ Signals ใน Service layer
- ✅ **Tailwind CSS** (cards, hover, transitions)
- ✅ **Error Messages** และ UI/UX

---

## 📁 โครงสร้างแบบ Simplified

```
src/app/
├── models/
│   └── todo.model.ts           # Simple Todo Interface
├── services/
│   └── todo.service.ts         # Todo Business Logic & State Management
├── components/
│   ├── todo-app/              # Main Component (Container)
│   │   ├── todo-app.component.ts
│   │   └── todo-app.component.html
│   ├── todo-form/             # Form Component
│   │   ├── todo-form.component.ts
│   │   └── todo-form.component.html
│   └── todo-item/             # Item Component
│       ├── todo-item.component.ts
│       └── todo-item.component.html
├── app.component.ts           # Root Component
└── app.component.html
```

---

## 🚀 Step 1: Simple Todo Model

สร้างไฟล์ `src/app/models/todo.model.ts`:

```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;    // Creation timestamp
  updatedAt: Date;    // Last update timestamp
}

export interface TodoFormData {
  title: string;
}
```

---

## 🚀 Step 2: Todo Service (Business Logic & State)

สร้างไฟล์ `src/app/services/todo.service.ts`:

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // Private Signals สำหรับ internal state
  private readonly _todos = signal<Todo[]>([
    { 
      id: 1, 
      title: 'Learn Angular 18', 
      completed: false,
      createdAt: new Date('2025-01-01T10:00:00'),
      updatedAt: new Date('2025-01-01T10:00:00')
    },
    { 
      id: 2, 
      title: 'Learn Tailwind CSS', 
      completed: true,
      createdAt: new Date('2025-01-01T11:00:00'),
      updatedAt: new Date('2025-01-02T14:30:00')
    },
    { 
      id: 3, 
      title: 'Build Todo App', 
      completed: false,
      createdAt: new Date('2025-01-01T12:00:00'),
      updatedAt: new Date('2025-01-01T12:00:00')
    }
  ]);

  private _nextId = 4;

  // Public Read-only Signals
  readonly todos = this._todos.asReadonly();

  // Computed Signals สำหรับ derived state
  readonly totalTodos = computed(() => this._todos().length);
  readonly completedTodos = computed(() => 
    this._todos().filter(todo => todo.completed).length
  );
  readonly pendingTodos = computed(() => 
    this._todos().filter(todo => !todo.completed).length
  );

  // Business Logic Methods

  /**
   * เพิ่ม Todo ใหม่
   * @param title ชื่อของ Todo
   */
  addTodo(title: string): void {
    if (!title.trim()) return;

    const now = new Date();
    const newTodo: Todo = {
      id: this._nextId++,
      title: title.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    this._todos.update(current => [...current, newTodo]);
  }

  /**
   * เปลี่ยนสถานะ completed ของ Todo
   * @param id ID ของ Todo
   */
  toggleTodo(id: number): void {
    this._todos.update(current =>
      current.map(todo =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() } 
          : todo
      )
    );
  }

  /**
   * ลบ Todo
   * @param id ID ของ Todo ที่ต้องการลบ
   */
  deleteTodo(id: number): void {
    this._todos.update(current => 
      current.filter(todo => todo.id !== id)
    );
  }

  /**
   * ลบ Todo ที่เสร็จแล้วทั้งหมด
   */
  clearCompleted(): void {
    this._todos.update(current => 
      current.filter(todo => !todo.completed)
    );
  }

  /**
   * ลบ Todo ทั้งหมด
   */
  clearAll(): void {
    this._todos.set([]);
    this._nextId = 1;
  }

  /**
   * ตรวจสอบว่า Todo มีอยู่หรือไม่
   * @param id ID ของ Todo
   */
  getTodoById(id: number): Todo | undefined {
    return this._todos().find(todo => todo.id === id);
  }

  /**
   * อัปเดต Todo
   * @param id ID ของ Todo
   * @param updates ข้อมูลที่ต้องการอัปเดต
   */
  updateTodo(id: number, updates: Partial<Pick<Todo, 'title' | 'completed'>>): void {
    this._todos.update(current =>
      current.map(todo =>
        todo.id === id 
          ? { ...todo, ...updates, updatedAt: new Date() } 
          : todo
      )
    );
  }
}
```

---

## 🧩 Step 3: Main TodoApp Component (Updated with Service)

สร้างไฟล์ `src/app/components/todo-app/todo-app.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
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
            📝 Todo App
          </h1>
          <p class="text-gray-600">Angular 18 + Services + Signals</p>
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
                {{ todoService.totalTodos() }}
              </div>
              <div class="text-xs text-gray-600">Total</div>
            </div>
            <div>
              <div class="text-xl font-bold text-green-600">
                {{ todoService.completedTodos() }}
              </div>
              <div class="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div class="text-xl font-bold text-orange-600">
                {{ todoService.pendingTodos() }}
              </div>
              <div class="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        <!-- Todo List -->
        <div class="space-y-3">
          @if (todoService.todos().length === 0) {
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
            @for (todo of todoService.todos(); track todo.id) {
              <app-todo-item
                [todo]="todo"
                (toggleCompleted)="onToggleTodo($event)"
                (deleteClicked)="onDeleteTodo($event)">
              </app-todo-item>
            }
          }
        </div>

        <!-- Actions -->
        @if (todoService.todos().length > 0) {
          <div class="mt-6 flex gap-3">
            <button
              (click)="onClearCompleted()"
              [disabled]="todoService.completedTodos() === 0"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                     hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200">
              Clear Completed ({{ todoService.completedTodos() }})
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
  // Inject TodoService using Angular 18 inject() function
  readonly todoService = inject(TodoService);

  // Event Handlers - Delegate to Service

  onTodoAdded(title: string): void {
    this.todoService.addTodo(title);
  }

  onToggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }

  onDeleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  onClearCompleted(): void {
    this.todoService.clearCompleted();
  }

  onClearAll(): void {
    if (confirm('Are you sure you want to clear all todos?')) {
      this.todoService.clearAll();
    }
  }
}
```

---

## 📝 Step 4: Todo Form Component

สร้างไฟล์ `src/app/components/todo-form/todo-form.component.ts`:

```typescript
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
        <!-- Title Input -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Todo Title <span class="text-red-500">*</span>
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
          />
          
          <!-- Error Messages -->
          @if (isFieldInvalid('title')) {
            <div class="mt-1 text-sm text-red-600">
              @if (todoForm.get('title')?.errors?.['required']) {
                <p>Title is required</p>
              }
              @if (todoForm.get('title')?.errors?.['maxlength']) {
                <p>Title must be less than 50 characters</p>
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
    </div>
  `
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<string>();

  todoForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]]
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      this.isSubmitting = true;
      
      const title = this.todoForm.get('title')?.value;
      
      // Simulate API call delay
      setTimeout(() => {
        this.todoAdded.emit(title);
        this.todoForm.reset();
        this.isSubmitting = false;
      }, 500);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
```

---

## 📋 Step 5: Todo Item Component

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
      <div class="flex items-center justify-between">
        <!-- Left Side: Checkbox + Title -->
        <div class="flex items-center space-x-3 flex-1">
          <!-- Custom Checkbox -->
          <button
            (click)="onToggle()"
            class="w-5 h-5 rounded border-2 flex items-center justify-center
                   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class]="checkboxClasses">
            @if (todo.completed) {
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            }
          </button>

          <!-- Title -->
          <span
            class="flex-1 transition-all duration-200"
            [class]="titleClasses">
            {{ todo.title }}
          </span>
          
          <!-- Created Date -->
          <div class="text-xs text-gray-400 mr-2">
            {{ formatDate(todo.createdAt) }}
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

## 🏠 Step 6: Update App Component

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
  title = 'Simple Todo App';
}
```

---

## 🎨 สิ่งที่ได้เรียนรู้

### ✅ Angular 18 Features
- **Standalone Components** - ไม่ต้องใช้ NgModule
- **Signals** - State Management แบบใหม่
- **@if/@for** - Control Flow syntax ใหม่
- **Reactive Forms** - FormGroup/FormControl
- **Event Binding** - (click) events
- **Input/Output** - Component communication
- **inject()** - Modern Dependency Injection function
- **Services with Signals** - Service-based state management

### ✅ Architecture & Best Practices
- **Service Layer** - Business logic separation
- **Single Responsibility** - แต่ละ component มีหน้าที่ชัดเจน
- **Dependency Injection** - Loose coupling
- **Immutable Updates** - Safe state mutations
- **Computed Values** - Derived state
- **Type Safety** - TypeScript interfaces
- **Clean Code** - Readable และ maintainable

### ✅ Form & Validation
- **FormBuilder** - สร้าง Reactive Forms
- **Validators** - required, maxLength
- **Error Handling** - แสดง error messages
- **Form States** - valid, invalid, dirty, touched

### ✅ Tailwind CSS
- **Cards** - bg-white rounded-lg shadow-md
- **Hover Effects** - hover:bg-blue-700
- **Transitions** - transition-all duration-200
- **Grid System** - grid grid-cols-2
- **Responsive** - max-w-md mx-auto
- **Colors** - text-gray-800, bg-blue-600

### ✅ State Management
- **Service-based Architecture** - Centralized state management
- **Signals in Services** - signal(), update(), set(), computed()
- **Read-only Signals** - Public API protection
- **Computed Values** - Automatic derived state
- **Immutable Updates** - spread operator, safe mutations
- **Business Logic Separation** - Services vs Components

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

- ✅ เพิ่ม Todo ใหม่พร้อม validation
- ✅ Toggle สถานะ completed
- ✅ ลบ Todo แต่ละรายการ
- ✅ แสดงสถิติ (Total/Completed/Pending)
- ✅ แสดงวันที่สร้าง Todo (relative time)
- ✅ อัปเดต updatedAt เมื่อมีการเปลี่ยนแปลง
- ✅ ลบ Todo ที่เสร็จแล้วทั้งหมด
- ✅ ลบ Todo ทั้งหมด
- ✅ Empty state เมื่อไม่มี Todo
- ✅ Loading state ขณะเพิ่ม Todo
- ✅ Confirmation dialogs
- ✅ Responsive design

---

## 💡 เคล็ดลับ

1. **Services**: ใช้สำหรับ business logic และ state management
2. **inject()**: ใช้แทน constructor injection (Angular 18 style)
3. **Signals in Services**: เหมาะสำหรับ reactive state management
4. **@if/@for**: Syntax ใหม่ที่อ่านง่ายกว่า *ngIf/*ngFor
5. **Tailwind**: ใช้ hover:, focus:, disabled: modifiers
6. **Forms**: ใช้ FormBuilder + Validators
7. **Events**: ใช้ EventEmitter สำหรับ component communication
8. **Architecture**: แยก concerns ระหว่าง Components และ Services
9. **Timestamps**: ใช้ Date objects สำหรับ tracking creation และ updates
10. **Date Formatting**: แสดงเวลาแบบ relative (user-friendly)

## 🏗️ Architecture Benefits

### ✅ ข้อดีของการใช้ Services
- **Reusable**: สามารถใช้ใน component หลายๆ ตัว
- **Testable**: ง่ายต่อการเขียน unit tests
- **Maintainable**: แยก business logic ออกจาก UI logic
- **Scalable**: เตรียมพร้อมสำหรับ API integration
- **Single Source of Truth**: state อยู่ที่เดียว

### ✅ Component vs Service Responsibilities

**Components (Presentation Layer)**:
- Template rendering
- User interactions
- Event handling
- UI state (loading, form states)

**Services (Business Layer)**:
- Data management
- Business logic
- State management
- API calls (future)
- Validation rules
- Timestamp management

---

**Happy Coding! 🎯**

เรียนรู้ Angular 18 + Services + Signals แบบ Best Practices ด้วย 3 Components + 1 Service!