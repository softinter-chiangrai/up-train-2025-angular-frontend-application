# 🎯 Angular 18 + Tailwind CSS - Simplified Todo Workshop (Components Only)

## เป้าหมายของ Workshop

เรียนรู้ Angular 18 + Tailwind CSS แบบง่ายที่สุด ผ่านการสร้าง Todo App โดยใช้ Standalone Components และ Tailwind CSS สำหรับมือใหม่ (Beginner Level)

### ✨ สิ่งที่จะได้เรียนรู้ (Components Focus)

- ✅ **Angular 18** Standalone Components
- ✅ **Component State** การจัดการ state ใน component
- ✅ **Reactive Forms** (FormGroup/FormControl)
- ✅ **Form Validation** (required, maxlength)
- ✅ **Event Binding** (click events)
- ✅ **@if/@for** Control Flow
- ✅ **Property Binding** [property]="value"
- ✅ **Event Emitters** @Output() สำหรับ communication
- ✅ **Tailwind CSS** (cards, hover, transitions)
- ✅ **Error Messages** และ UI/UX

---

## 📁 โครงสร้างแบบ Simplified (Components Only)

```
src/app/
├── models/
│   └── todo.model.ts           # Simple Todo Interface
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
}

export interface TodoFormData {
  title: string;
}
```

---

## 🧩 Step 2: Main TodoApp Component (Container with State)

สร้างไฟล์
```shell
ng g c components/todo-app --skip-tests
```

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.ts`:

```typescript
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent {
  // Component State using Signals
  private _todos = signal<Todo[]>([
    { 
      id: 1, 
      title: 'Learn Angular 18', 
      completed: false,
      createdAt: new Date('2025-01-01T10:00:00')
    },
    { 
      id: 2, 
      title: 'Learn Tailwind CSS', 
      completed: true,
      createdAt: new Date('2025-01-01T11:00:00')
    },
    { 
      id: 3, 
      title: 'Build Todo App', 
      completed: false,
      createdAt: new Date('2025-01-01T12:00:00')
    }
  ]);

  private _nextId = 4;

  // Public Readonly Signals
  todos = this._todos.asReadonly();

  // Computed Signals for Statistics
  totalTodos = computed(() => this._todos().length);
  completedTodos = computed(() => 
    this._todos().filter(todo => todo.completed).length
  );
  pendingTodos = computed(() => 
    this._todos().filter(todo => !todo.completed).length
  );

  // Event Handlers

  onTodoAdded(title: string): void {
    if (!title.trim()) return;

    const newTodo: Todo = {
      id: this._nextId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };

    this._todos.update(current => [...current, newTodo]);
  }

  onToggleTodo(id: number): void {
    this._todos.update(current =>
      current.map(todo =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed } 
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

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.html`:

```html
<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        📝 Todo App
      </h1>
      <p class="text-gray-600">Angular 18 + Components + Signals</p>
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
```
---

## 📝 Step 3: Todo Form Component

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
      
      // Simulate loading delay
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

สร้างไฟล์ `src/app/components/todo-form/todo-form.component.html`:

```html
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
```
---

## 📋 Step 4: Todo Item Component

สร้างไฟล์ `src/app/components/todo-item/todo-item.component.ts`:

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
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


สร้างไฟล์ `src/app/components/todo-item/todo-item.component.html`:

```html
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
  imports: [RouterOutlet, TodoAppComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Simple Todo App - Components Only';
}
```

แก้ไข `src/app/app.component.html`:

```html
<app-todo-app></app-todo-app>

<router-outlet />
```
---

## 🎨 สิ่งที่ได้เรียนรู้ (Components Focus)

### ✅ Angular 18 Features (Beginner Level)
- **Standalone Components** - ไม่ต้องใช้ NgModule
- **Signals** - State Management ใน Component
- **@if/@for** - Control Flow syntax ใหม่
- **Reactive Forms** - FormGroup/FormControl
- **Event Binding** - (click) events
- **Property Binding** - [property]="value"
- **Input/Output** - Component communication
- **Component State** - การจัดการ state ใน component

### ✅ Component Architecture (Beginner Friendly)
- **Single Component State** - ทุกอย่างอยู่ใน main component
- **Child Components** - แยก UI ออกเป็น component ย่อย
- **Event Emitters** - การส่งข้อมูลจาก child ไป parent
- **Property Binding** - การส่งข้อมูลจาก parent ไป child
- **Simple State Management** - ใช้ signals ใน component
- **No Services** - เหมาะสำหรับมือใหม่

### ✅ Form & Validation
- **FormBuilder** - สร้าง Reactive Forms
- **Validators** - required, maxLength
- **Error Handling** - แสดง error messages
- **Form States** - valid, invalid, dirty, touched

### ✅ Tailwind CSS
- **Cards** - bg-white rounded-lg shadow-md
- **Hover Effects** - hover:bg-blue-700
- **Transitions** - transition-all duration-200
- **Grid System** - grid grid-cols-3
- **Responsive** - max-w-md mx-auto
- **Colors** - text-gray-800, bg-blue-600

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

## 🎯 ฟีเจ่อร์ที่ได้ (Components Only)

- ✅ เพิ่ม Todo ใหม่พร้อม validation
- ✅ Toggle สถานะ completed
- ✅ ลบ Todo แต่ละรายการ
- ✅ แสดงสถิติ (Total/Completed/Pending)
- ✅ แสดงวันที่สร้าง Todo (relative time)
- ✅ ลบ Todo ที่เสร็จแล้วทั้งหมด
- ✅ ลบ Todo ทั้งหมด
- ✅ Empty state เมื่อไม่มี Todo
- ✅ Loading state ขณะเพิ่ม Todo
- ✅ Confirmation dialogs
- ✅ Responsive design

---

## 💡 เคล็ดลับสำหรับมือใหม่

1. **Component State**: เก็บ state ใน main component (TodoAppComponent)
2. **Signals**: ใช้ signal() สำหรับ reactive state
3. **@if/@for**: Syntax ใหม่ที่อ่านง่ายกว่า *ngIf/*ngFor
4. **Tailwind**: ใช้ hover:, focus:, disabled: modifiers
5. **Forms**: ใช้ FormBuilder + Validators
6. **Events**: ใช้ EventEmitter สำหรับ component communication
7. **Simple Architecture**: เริ่มต้นด้วย component-based architecture
8. **No Services**: ไม่ซับซ้อน เหมาะสำหรับมือใหม่
9. **Step by Step**: เรียนรู้ทีละ concept
10. **Practice**: ลองสร้าง component เพิ่มเติม

---

## 📚 Next Steps

เมื่อเชี่ยวชาญ Components แล้ว สามารถเรียนรู้:

1. **Services** - แยก business logic ออกจาก components
2. **Dependency Injection** - การใช้ services
3. **HTTP Client** - เรียก API
4. **Routing** - หลายหน้า
5. **State Management** - NgRx หรือ Akita

---

**🎓 Learning Path**
- เริ่มต้นจาก Components
- เรียนรู้ Signals และ Reactive Forms
- เตรียมพร้อมสำหรับขั้นต่อไป (Services)


**💡 Key Differences จาก Service Version**
- No Services - ทุกอย่างอยู่ใน component
- Simpler State - ใช้ private signals ใน component
- Direct Logic - business logic อยู่ใน component methods
- Beginner Focus - เหมาะสำหรับคนที่เริ่มเรียน Angular

--- 

**Happy Coding! 🎯**

เรียนรู้ Angular 18 + Components + Signals แบบ Beginner-Friendly ด้วย 3 Components เท่านั้น!