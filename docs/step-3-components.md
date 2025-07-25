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
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './todo-app.component.html',
  styleUrl: './todo-app.component.css'
})
export class TodoAppComponent implements OnInit, OnDestroy {
  
  // ============================================
  // Dependency Injection
  // ============================================
  private readonly todoService = inject(TodoService);
  private subscriptions = new Subscription();

  // ============================================
  // Signals - Private State
  // ============================================
  private _todos = signal<Todo[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // ============================================
  // Signals - Public Readonly
  // ============================================
  todos = this._todos.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  // ============================================
  // Computed Signals
  // ============================================
  totalTodos = computed(() => this._todos().length);
  
  completedTodos = computed(() => 
    this._todos().filter(todo => todo.completed).length
  );
  
  pendingTodos = computed(() => 
    this._todos().filter(todo => !todo.completed).length
  );

  // Progress percentage
  progressPercentage = computed(() => {
    const total = this.totalTodos();
    const completed = this.completedTodos();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  // Status text
  statusText = computed(() => {
    if (this.isLoading()) return 'Loading...';
    if (this.error()) return 'Error occurred';
    if (this.totalTodos() === 0) return 'No todos yet';
    return `${this.completedTodos()}/${this.totalTodos()} completed`;
  });

  // ============================================
  // Lifecycle Hooks
  // ============================================
  ngOnInit(): void {
    console.log('🚀 TodoAppComponent initialized');
    this.loadTodos();
  }

  ngOnDestroy(): void {
    console.log('🧹 TodoAppComponent destroyed');
    this.subscriptions.unsubscribe();
  }

  // ============================================
  // Data Loading
  // ============================================
  loadTodos(): void {
    console.log('🔄 Loading todos from API...');
    
    this._isLoading.set(true);
    this._error.set(null);
    
    const subscription = this.todoService.getTodos().subscribe({
      next: (todos) => {
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

  // ============================================
  // Todo Actions
  // ============================================
  addTodo(title: string): void {
    if (!title.trim()) {
      console.warn('⚠️ Cannot add empty todo');
      return;
    }

    console.log('➕ Adding new todo:', title);

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };

    const subscription = this.todoService.createTodo(newTodo).subscribe({
      next: (createdTodo) => {
        // Add to local state
        this._todos.update(current => [...current, createdTodo]);
        console.log('✅ Todo added successfully');
      },
      error: (error) => {
        console.error('❌ Failed to add todo:', error);
        this._error.set('Failed to add todo. Please try again.');
      }
    });

    this.subscriptions.add(subscription);
  }

  toggleTodo(id: number): void {
    const todo = this._todos().find(t => t.id === id);
    if (!todo) {
      console.warn('⚠️ Todo not found:', id);
      return;
    }

    console.log('🔄 Toggling todo:', id, !todo.completed);

    const subscription = this.todoService.toggleTodo(id, !todo.completed).subscribe({
      next: (updatedTodo) => {
        // Update local state
        this._todos.update(current =>
          current.map(t => t.id === id ? updatedTodo : t)
        );
        console.log('✅ Todo toggled successfully');
      },
      error: (error) => {
        console.error('❌ Failed to toggle todo:', error);
        this._error.set('Failed to update todo. Please try again.');
      }
    });

    this.subscriptions.add(subscription);
  }

  deleteTodo(id: number): void {
    const todo = this._todos().find(t => t.id === id);
    if (!todo) {
      console.warn('⚠️ Todo not found:', id);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      return;
    }

    console.log('🗑️ Deleting todo:', id);

    const subscription = this.todoService.deleteTodo(id).subscribe({
      next: () => {
        // Remove from local state
        this._todos.update(current => current.filter(t => t.id !== id));
        console.log('✅ Todo deleted successfully');
      },
      error: (error) => {
        console.error('❌ Failed to delete todo:', error);
        this._error.set('Failed to delete todo. Please try again.');
      }
    });

    this.subscriptions.add(subscription);
  }

  clearCompleted(): void {
    const completedTodos = this._todos().filter(t => t.completed);
    if (completedTodos.length === 0) {
      console.warn('⚠️ No completed todos to clear');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${completedTodos.length} completed todos?`)) {
      return;
    }

    console.log('🧹 Clearing completed todos...');

    // Delete each completed todo
    completedTodos.forEach(todo => {
      if (todo.id) {
        this.deleteTodo(todo.id);
      }
    });
  }

  // ============================================
  // Utility Methods
  // ============================================
  
  // Format date for display
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

  // Check if actions can be performed
  canPerformActions(): boolean {
    return !this.isLoading() && !this.error();
  }

  // Clear error state
  clearError(): void {
    this._error.set(null);
    this.todoService.clearError();
  }

  // Track function for ngFor (จะใช้ใน template)
  trackByTodoId(index: number, todo: Todo): number {
    return todo.id || index;
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
      <p class="text-gray-600">Angular 18 + Signals + Tailwind</p>
    </div>

    <!-- Add Todo Section -->
    <div class="mb-6">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex gap-2">
          <input 
            #todoInput
            type="text" 
            placeholder="Add a new todo..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            (keyup.enter)="addTodo(todoInput.value); todoInput.value = ''"
            [disabled]="!canPerformActions()"
          >
          <button 
            (click)="addTodo(todoInput.value); todoInput.value = ''"
            [disabled]="!canPerformActions()"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm text-gray-500">{{ progressPercentage() }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            [style.width.%]="progressPercentage()"
          ></div>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-xl font-bold text-blue-600">{{ totalTodos() }}</div>
          <div class="text-xs text-gray-600">Total</div>
        </div>
        <div>
          <div class="text-xl font-bold text-green-600">{{ completedTodos() }}</div>
          <div class="text-xs text-gray-600">Completed</div>
        </div>
        <div>
          <div class="text-xl font-bold text-orange-600">{{ pendingTodos() }}</div>
          <div class="text-xs text-gray-600">Pending</div>
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="mb-4 flex justify-between items-center">
      <span class="text-sm text-gray-600">{{ statusText() }}</span>
      <div class="flex gap-2">
        @if (completedTodos() > 0) {
          <button 
            (click)="clearCompleted()"
            [disabled]="!canPerformActions()"
            class="text-xs px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
          >
            Clear Completed
          </button>
        }
        <button 
          (click)="refreshTodos()"
          [disabled]="!canPerformActions()"
          class="text-xs px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 disabled:opacity-50"
        >
          🔄 Refresh
        </button>
      </div>
    </div>

    <!-- Error Message -->
    @if (error()) {
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div class="flex justify-between items-start">
          <div class="text-red-700">
            <strong>Error:</strong> {{ error() }}
          </div>
          <button 
            (click)="clearError()"
            class="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      </div>
    }

    <!-- Loading State -->
    @if (isLoading()) {
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading todos...</p>
      </div>
    }

    <!-- Todo List -->
    @else {
      <div class="space-y-3">
        @if (todos().length === 0 && !error()) {
          <!-- Empty State -->
          <div class="bg-white rounded-lg shadow-md p-8 text-center">
            <div class="text-4xl mb-3">📝</div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">No todos yet!</h3>
            <p class="text-gray-500">Add your first todo to get started.</p>
          </div>
        } @else {
          <!-- Todo Items -->
          @for (todo of todos(); track trackByTodoId($index, todo)) {
            <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div class="flex items-center gap-3">
                <!-- Checkbox -->
                <button 
                  (click)="toggleTodo(todo.id!)"
                  [disabled]="!canPerformActions()"
                  class="flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all disabled:opacity-50"
                  [class.bg-green-500]="todo.completed"
                  [class.border-green-500]="todo.completed"
                  [class.border-gray-300]="!todo.completed"
                  [class.hover:border-green-400]="!todo.completed && canPerformActions()"
                >
                  @if (todo.completed) {
                    <span class="text-white text-sm">✓</span>
                  }
                </button>

                <!-- Todo Content -->
                <div class="flex-1 min-w-0">
                  <div 
                    class="transition-all"
                    [class.line-through]="todo.completed"
                    [class.text-gray-500]="todo.completed"
                    [class.text-gray-800]="!todo.completed"
                  >
                    {{ todo.title }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ formatDate(todo.createdAt) }}
                  </div>
                </div>

                <!-- Delete Button -->
                <button 
                  (click)="deleteTodo(todo.id!)"
                  [disabled]="!canPerformActions()"
                  class="flex-shrink-0 text-red-500 hover:text-red-700 disabled:opacity-50 p-1"
                  title="Delete todo"
                >
                  🗑️
                </button>
              </div>
            </div>
          }
        }
      </div>
    }

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
