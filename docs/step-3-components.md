# Step 3: Components

🎯 **เป้าหมาย**: สร้าง Angular components โดยใช้ Signals และ Standalone Components

## 📋 สิ่งที่จะทำใน Step นี้

- [ ] สร้าง TodoAppComponent (main component)
- [ ] ใช้ Angular Signals สำหรับ state management
- [ ] เชื่อมต่อกับ TodoService
- [ ] ใช้ Angular 18 Control Flow (@if, @for)
- [ ] จัดการ component lifecycle

## 🏗️ โครงสร้าง Components

```
src/app/components/
├── todo-app/
│   ├── todo-app.component.ts
│   ├── todo-app.component.html
│   ├── todo-app.component.css
│   └── todo-app.component.spec.ts
└── todo-form/
    ├── todo-form.component.ts
    ├── todo-form.component.html
    ├── todo-form.component.css
    └── todo-form.component.spec.ts
```

## 🚀 สร้าง TodoAppComponent

### 1. สร้างโฟลเดอร์ components

```bash
mkdir src/app/components
mkdir src/app/components/todo-app
```

### 2. สร้าง TodoAppComponent

#### `src/app/components/todo-app/todo-app.component.ts`

```typescript
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, DatePipe, TodoFormComponent],
  templateUrl: './todo-app.component.html',
  styleUrl: './todo-app.component.css'
})
export class TodoAppComponent implements OnInit, OnDestroy {

  private readonly todoService = inject(TodoService);
  private subscriptions = new Subscription();

  private _todos = signal<Todo[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  todos = this._todos.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  // Computed Signals
  readonly completedCount = signal(0);
  readonly pendingCount = signal(0);

  private _nextId = 4;

  ngOnInit(): void {
    this.loadTodos();
    // generate local storage
    if (!localStorage.getItem('user')) {
      // Generate a v4 UUID and store as 'user'
      const uuid = crypto.randomUUID();
      localStorage.setItem('user', uuid);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTodos(): void {
    console.log('🔄 Loading todos from API...');
    
    this._isLoading.set(true);
    this._error.set(null);
    
    const subscription = this.todoService.getTodos().subscribe({
      next: (response) => {
        // ถ้า response มีโครงสร้างพิเศษ ให้แปลงก่อน
        const todos = response.body || response; // ขึ้นอยู่กับ API structure
        this._todos.set(todos);
        console.log('✅ Loaded', todos.length, 'todos');
      },
      error: (error) => {
        console.error('❌ Failed to load todos:', error);
        this._error.set('Failed to load todos. Please try again.');
      },
      complete: () => {
        this._isLoading.set(false);
      }
    });
    
    this.subscriptions.add(subscription);
  }

  refreshTodos(): void {
    console.log('🔄 Refreshing todos...');
    this.loadTodos();
  }

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

    const userName = localStorage.getItem('user') as string;
    const newTodo: Todo = {
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
      createdBy: userName,
    };

    console.log(newTodo);
    this.todoService.createTodo(newTodo).subscribe({
      next: (response) => {
        this._todos.update(current => [...current, response]);
        this.loadTodos();
        this.updateCounts();
      }, 
      error: (error) => {
        console.error('❌ Failed to create todo:', error);
        this._error.set('Failed to create todo. Please try again.');
      }
    });
  }

  onToggleTodo(id: number): void {
    const todo = this.todos().find(t => t.id === id);
    if (!todo) return;

    this.todoService.toggleTodo(id, !todo.completed).subscribe({
      next: (updateTodo) => {
        // Update local state
        console.log(updateTodo);
        this._todos.update(current =>
          current.map(t => t.id === id ? updateTodo : t)
        );
        this.loadTodos();
        this.updateCounts();
      },
      error: (error) => {
        console.error('Failed to toggle todo:', error);
      }
    });
  }

  onDeleteTodo(id: number): void {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        // Remove from local state
        this._todos.update(current => current.filter(t => t.id !== id));
        this.updateCounts();
      },
      error: (error) => {
        console.error('Failed to delete todo:', error);
      }
    });
  }

  onClearCompleted(): void {
    if (!confirm('Are you sure you want to delete all completed todos?')) {
      return;
    }
    
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

  onRefresh(): void {
    this.loadTodos();
  }

  private updateCounts(): void {
    const todos = this.todos();
    const completed = todos.filter(t => t.completed).length;
    const pending = todos.filter(t => !t.completed).length;

    this.completedCount.set(completed);
    this.pendingCount.set(pending);
  }

  getStatusText(): string {
    if (this.isLoading()) return 'Loading...';
    if (this.error()) return 'Error occurred';
    if (this.totalTodos() === 0) return 'No todos';
    return `${this.completedTodos()}/${this.totalTodos()} completed`;
  }

  canPerformActions(): boolean {
    // TODO: สร้าง helper method ตรวจสอบว่าสามารถทำ actions ได้หรือไม่
    return !this.isLoading() && !this.error();
  }

  // TODO: สร้าง method สำหรับ format date
  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

}
```

#### `src/app/components/todo-app/todo-app.component.html`

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
          <div class="bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg">
            <div class="flex items-center justify-between">
              <!-- Left Side: Checkbox + Title -->
              <div class="flex items-center space-x-3 flex-1">
                <!-- Custom Checkbox -->
                <button
                  class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [ngClass]="todo.completed
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300 hover:border-blue-400'"
                  (click)="onToggleTodo(todo.id!)"
                >
                  @if (todo.completed) {
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd">
                      </path>
                    </svg>
                  }
                </button>

                <!-- Title -->
                <span
                  class="flex-1 transition-all duration-200"
                  [class.line-through]="todo.completed"
                  [class.text-gray-500]="todo.completed"
                  [class.text-gray-900]="!todo.completed">
                  {{ todo.title }}
                </span>

                <div class="text-xs text-gray-400 mr-2">
                  {{ todo.createdAt | date:'shortDate' }}
                </div>
              </div>

              <!-- Right Side: Delete Button -->
              <button
                title="Delete todo"
                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                (click)="onDeleteTodo(todo.id!)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        }
      }
    </div>
    
  </div>
</div>
```

#### `src/app/components/todo-app/todo-app.component.css`

```css
/* Component-specific styles */

/* Smooth animations */
.todo-item {
  transition: all 0.3s ease;
}

/* Custom checkbox animation */
.checkbox-button {
  transition: all 0.2s ease;
}

.checkbox-button:hover {
  transform: scale(1.1);
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.5s ease-in-out;
}

/* Hover effects */
.todo-card:hover {
  transform: translateY(-1px);
}

/* Focus states */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

## 🔗 อัพเดท App Component

แก้ไข `src/app/app.component.html`:

```html
<app-todo-app></app-todo-app>
```

แก้ไข `src/app/app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { TodoAppComponent } from './components/todo-app/todo-app.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoAppComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'todo-app';
}
```

## 🧠 เข้าใจ Angular 18 Features

### 1. Signals

```typescript
// Private signal
private _todos = signal<Todo[]>([]);

// Public readonly signal  
todos = this._todos.asReadonly();

// Computed signal
totalTodos = computed(() => this._todos().length);

// Update signal
this._todos.set([]);                    // Replace
this._todos.update(current => [...current, newTodo]); // Update
```

### 2. New Control Flow

```html
<!-- @if directive -->
@if (condition) {
  <div>Show when true</div>
} @else {
  <div>Show when false</div>
}

<!-- @for directive -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```

### 3. Standalone Components

```typescript
@Component({
  standalone: true,           // No need for NgModule
  imports: [CommonModule],    // Import what you need
  // ...
})
```

## ✅ ตรวจสอบผลลัพธ์

- [ ] TodoAppComponent สร้างเสร็จ
- [ ] Signals ทำงานได้ (reactive updates)
- [ ] Service integration ทำงานได้
- [ ] Angular 18 Control Flow ทำงานได้
- [ ] Tailwind CSS styling ทำงานได้
- [ ] Error handling แสดงผลได้
- [ ] Loading states ทำงานได้

## 🔧 การทดสอบ

1. **รัน JSON Server**: `npm run api`
2. **รัน Angular App**: `npm run dev`
3. **ทดสอบ Features**:
   - ✅ แสดงรายการ todos
   - ✅ เพิ่ม todo ใหม่
   - ✅ ทำเครื่องหมายเสร็จ/ยังไม่เสร็จ
   - ✅ ลบ todo
   - ✅ แสดงสถิติ
   - ✅ Refresh ข้อมูล

## 🔗 ขั้นตอนถัดไป

✅ **สำเร็จแล้ว?** ไปต่อที่ [Step 4: Forms](./step-4-forms.md)

---

<div align="center">
  <a href="./step-2-services.md">⬅️ Step 2: Services</a> | 
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a> | 
  <a href="./step-4-forms.md">➡️ Step 4: Forms</a>
</div>
