# 🎯 Angular 18 + HTTP Service - Simplified Workshop for Beginners

## เป้าหมายของ Workshop

เรียนรู้ Angular 18 **HTTP Service** แบบง่ายที่สุด ผ่านการสร้าง Todo App ที่เชื่อมต่อกับ Backend API สำหรับมือใหม่

### ✨ สิ่งที่จะได้เรียนรู้

- ✅ **Angular HTTP Client** การเรียก API
- ✅ **HTTP Service** สร้าง service สำหรับจัดการ API calls
- ✅ **CRUD Operations** Create, Read, Update, Delete
- ✅ **Error Handling** จัดการ error จาก API
- ✅ **Loading States** แสดงสถานะ loading
- ✅ **Observables** การใช้ RxJS กับ HTTP
- ✅ **Environment Variables** ตั้งค่า API URL
- ✅ **Type Safety** การใช้ TypeScript interfaces
- ✅ **Async/Await Pattern** การเขียน async code
- ✅ **Form Integration** เชื่อม forms กับ HTTP service

---

## 📁 โครงสร้างแบบ Simplified

```
src/app/
├── models/
│   └── todo.model.ts           # Todo Interface + API Response Types
├── services/
│   └── todo.service.ts    # HTTP Service สำหรับ API calls
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
└── app.config.ts              # HTTP Client Configuration
```

---

## 🚀 Step 1: Environment Configuration

สร้างไฟล์ `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // JSON Server หรือ Backend API URL
};
```

สร้างไฟล์ `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com/api' // Production API URL
};
```

---

## 🚀 Step 2: Todo Model with API Types

สร้างไฟล์ `src/app/models/todo.model.ts`:

```typescript
// Core Todo Interface
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;    // ISO string from API
  updatedAt: string;    // ISO string from API
}

// Form Data Interface (สำหรับส่งไป API)
export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TodoListResponse {
  todos: Todo[];
  total: number;
  page: number;
  limit: number;
}

// Error Response Interface
export interface ApiError {
  success: false;
  message: string;
  errors?: { [key: string]: string };
}
```

---

## 🚀 Step 3: HTTP Client Configuration

แก้ไข `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()) // เพิ่ม HTTP Client
  ]
};
```

---

## 🚀 Step 4: Todo HTTP Service

สร้างไฟล์ `src/app/services/todo-http.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Todo, 
  CreateTodoRequest, 
  UpdateTodoRequest, 
  ApiResponse, 
  TodoListResponse,
  ApiError 
} from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoHttpService {
  private readonly apiUrl = `${environment.apiUrl}/todos`;
  
  // Loading States (Signals)
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  
  // Public Read-only Signals
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {}

  // ============================================
  // GET: ดึง Todos ทั้งหมด
  // ============================================
  getTodos(): Observable<Todo[]> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<ApiResponse<Todo[]>>(this.apiUrl).pipe(
      tap(response => {
        console.log('✅ Todos loaded:', response.data.length);
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this.setLoading(false))
    ).pipe(
      tap(response => response.data), // Extract data from response
      // Convert to just the todos array
      tap(() => {}) // placeholder for additional side effects
    );
  }

  // ============================================
  // GET: ดึง Todo ตาม ID
  // ============================================
  getTodoById(id: number): Observable<Todo> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<ApiResponse<Todo>>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        console.log('✅ Todo loaded:', response.data.title);
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this.setLoading(false))
    ).pipe(
      tap(response => response.data)
    );
  }

  // ============================================
  // POST: สร้าง Todo ใหม่
  // ============================================
  createTodo(todoData: CreateTodoRequest): Observable<Todo> {
    this.setLoading(true);
    this.clearError();

    const payload = {
      ...todoData,
      completed: false // Default value
    };

    return this.http.post<ApiResponse<Todo>>(this.apiUrl, payload).pipe(
      tap(response => {
        console.log('✅ Todo created:', response.data.title);
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this.setLoading(false))
    ).pipe(
      tap(response => response.data)
    );
  }

  // ============================================
  // PUT: อัปเดต Todo
  // ============================================
  updateTodo(id: number, updateData: UpdateTodoRequest): Observable<Todo> {
    this.setLoading(true);
    this.clearError();

    return this.http.put<ApiResponse<Todo>>(`${this.apiUrl}/${id}`, updateData).pipe(
      tap(response => {
        console.log('✅ Todo updated:', response.data.title);
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this.setLoading(false))
    ).pipe(
      tap(response => response.data)
    );
  }

  // ============================================
  // PATCH: Toggle Todo completed status
  // ============================================
  toggleTodo(id: number, completed: boolean): Observable<Todo> {
    return this.updateTodo(id, { completed });
  }

  // ============================================
  // DELETE: ลบ Todo
  // ============================================
  deleteTodo(id: number): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('✅ Todo deleted:', id);
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this.setLoading(false))
    ).pipe(
      tap(() => {}) // Return void
    );
  }

  // ============================================
  // DELETE: ลบ Todos ที่เสร็จแล้วทั้งหมด
  // ============================================
  deleteCompletedTodos(): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/completed`).pipe(
      tap(() => {
        console.log('✅ Completed todos deleted');
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this.setLoading(false))
    ).pipe(
      tap(() => {})
    );
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  private setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  private clearError(): void {
    this._error.set(null);
  }

  private setError(message: string): void {
    this._error.set(message);
    console.error('❌ API Error:', message);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Server-side error
      const apiError = error.error as ApiError;
      if (apiError?.message) {
        errorMessage = apiError.message;
      } else {
        errorMessage = `Server Error: ${error.status} ${error.statusText}`;
      }
    }

    this.setError(errorMessage);
    throw error; // Re-throw for component to handle
  }
}
```

---

## 🧩 Step 5: Main TodoApp Component with HTTP Service

สร้างไฟล์ `src/app/components/todo-app/todo-app.component.ts`:

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoHttpService } from '../../services/todo-http.service';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo, CreateTodoRequest } from '../../models/todo.model';

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
          <p class="text-gray-600">Angular 18 + HTTP Service</p>
        </div>

        <!-- Global Loading -->
        @if (todoHttpService.isLoading()) {
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span class="text-blue-800">Loading...</span>
            </div>
          </div>
        }

        <!-- Global Error -->
        @if (todoHttpService.error()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-red-800">{{ todoHttpService.error() }}</span>
            </div>
            <button 
              (click)="loadTodos()"
              class="mt-2 text-sm text-red-600 hover:text-red-800 underline">
              Try Again
            </button>
          </div>
        }

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
                {{ todos().length }}
              </div>
              <div class="text-xs text-gray-600">Total</div>
            </div>
            <div>
              <div class="text-xl font-bold text-green-600">
                {{ completedCount() }}
              </div>
              <div class="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div class="text-xl font-bold text-orange-600">
                {{ pendingCount() }}
              </div>
              <div class="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        <!-- Todo List -->
        <div class="space-y-3">
          @if (todos().length === 0 && !todoHttpService.isLoading()) {
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
              [disabled]="completedCount() === 0 || todoHttpService.isLoading()"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                     hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200">
              Clear Completed ({{ completedCount() }})
            </button>
            <button
              (click)="onRefresh()"
              [disabled]="todoHttpService.isLoading()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200">
              🔄 Refresh
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class TodoAppComponent implements OnInit {
  // Inject HTTP Service
  readonly todoHttpService = inject(TodoHttpService);
  
  // Local State (Signals)
  private readonly _todos = signal<Todo[]>([]);
  
  // Public Read-only Signals
  readonly todos = this._todos.asReadonly();
  
  // Computed Signals
  readonly completedCount = signal(0);
  readonly pendingCount = signal(0);

  // ============================================
  // Lifecycle
  // ============================================
  
  ngOnInit(): void {
    this.loadTodos();
  }

  // ============================================
  // Public Methods
  // ============================================

  loadTodos(): void {
    this.todoHttpService.getTodos().subscribe({
      next: (todos) => {
        this._todos.set(todos);
        this.updateCounts();
      },
      error: (error) => {
        console.error('Failed to load todos:', error);
        // Error is already handled by the service
      }
    });
  }

  onTodoAdded(todoData: CreateTodoRequest): void {
    this.todoHttpService.createTodo(todoData).subscribe({
      next: (newTodo) => {
        // Add to local state
        this._todos.update(current => [...current, newTodo]);
        this.updateCounts();
      },
      error: (error) => {
        console.error('Failed to create todo:', error);
        // Error is already handled by the service
      }
    });
  }

  onToggleTodo(id: number): void {
    const todo = this.todos().find(t => t.id === id);
    if (!todo) return;

    this.todoHttpService.toggleTodo(id, !todo.completed).subscribe({
      next: (updatedTodo) => {
        // Update local state
        this._todos.update(current =>
          current.map(t => t.id === id ? updatedTodo : t)
        );
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

    this.todoHttpService.deleteTodo(id).subscribe({
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

    this.todoHttpService.deleteCompletedTodos().subscribe({
      next: () => {
        // Remove completed todos from local state
        this._todos.update(current => current.filter(t => !t.completed));
        this.updateCounts();
      },
      error: (error) => {
        console.error('Failed to clear completed todos:', error);
      }
    });
  }

  onRefresh(): void {
    this.loadTodos();
  }

  // ============================================
  // Private Methods
  // ============================================

  private updateCounts(): void {
    const todos = this.todos();
    const completed = todos.filter(t => t.completed).length;
    const pending = todos.filter(t => !t.completed).length;
    
    this.completedCount.set(completed);
    this.pendingCount.set(pending);
  }
}
```

---

## 📝 Step 6: Todo Form Component (Updated for HTTP Service)

สร้างไฟล์ `src/app/components/todo-form/todo-form.component.ts`:

```typescript
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateTodoRequest } from '../../models/todo.model';

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
                <p>Title must be less than 100 characters</p>
              }
            </div>
          }
        </div>

        <!-- Description Input -->
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
                <p>Description must be less than 500 characters</p>
              }
            </div>
          }
        </div>

        <!-- Priority Select -->
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
            [class.border-red-500]="isFieldInvalid('priority')">
            <option value="">Select priority...</option>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
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
          [disabled]="todoForm.invalid || isSubmitting()"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium
                 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          @if (isSubmitting()) {
            <span class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
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
  @Output() todoAdded = new EventEmitter<CreateTodoRequest>();

  todoForm: FormGroup;
  private readonly _isSubmitting = signal<boolean>(false);
  
  // Public Signal
  readonly isSubmitting = this._isSubmitting.asReadonly();

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.maxLength(500)
      ]],
      priority: ['', [
        Validators.required
      ]]
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid && !this.isSubmitting()) {
      this._isSubmitting.set(true);
      
      const formData: CreateTodoRequest = {
        title: this.todoForm.get('title')?.value.trim(),
        description: this.todoForm.get('description')?.value.trim() || undefined,
        priority: this.todoForm.get('priority')?.value
      };
      
      // Emit the data (parent component will handle the HTTP call)
      this.todoAdded.emit(formData);
      
      // Reset form after a short delay
      setTimeout(() => {
        this.todoForm.reset();
        this._isSubmitting.set(false);
      }, 1000);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return field ? field.valid && (field.dirty || field.touched) : false;
  }
}
```

---

## 📋 Step 7: Todo Item Component (Updated for HTTP Service)

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
            <h3 
              class="font-medium transition-all duration-200"
              [class]="titleClasses">
              {{ todo.title }}
            </h3>
            
            <!-- Description -->
            @if (todo.description) {
              <p 
                class="text-sm text-gray-600 mt-1 transition-all duration-200"
                [class.line-through]="todo.completed">
                {{ todo.description }}
              </p>
            }
            
            <!-- Meta Info -->
            <div class="flex items-center justify-between mt-2">
              <!-- Priority Badge -->
              <span 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                [class]="priorityClasses">
                {{ priorityIcon }} {{ todo.priority.toUpperCase() }}
              </span>
              
              <!-- Created Date -->
              <div class="text-xs text-gray-400">
                {{ formatDate(todo.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Delete Button -->
        <button
          (click)="onDelete()"
          class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ml-3"
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

  get priorityClasses(): string {
    const baseClasses = 'border';
    switch (this.todo.priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800 border-red-200`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800 border-green-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
    }
  }

  get priorityIcon(): string {
    switch (this.todo.priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  onToggle(): void {
    this.toggleCompleted.emit(this.todo.id);
  }

  onDelete(): void {
    this.deleteClicked.emit(this.todo.id);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
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
      month: '2-digit',
      year: '2-digit'
    });
  }
}
```

---

## 🏠 Step 8: Update App Component

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
  title = 'Todo App with HTTP Service';
}
```

---

## 🔧 Step 9: Mock API Setup (ทางเลือก)

### วิธีที่ 1: ใช้ JSON Server (แนะนำสำหรับมือใหม่)

ติดตั้ง JSON Server:
```bash
npm install -g json-server
```

สร้างไฟล์ `db.json` ใน root directory:
```json
{
  "todos": [
    {
      "id": 1,
      "title": "Learn Angular 18",
      "description": "Study Angular 18 features and best practices",
      "completed": false,
      "priority": "high",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Build Todo App",
      "description": "Create a complete todo application with HTTP service",
      "completed": true,
      "priority": "medium",
      "createdAt": "2025-01-14T09:30:00.000Z",
      "updatedAt": "2025-01-15T14:30:00.000Z"
    }
  ]
}
```

รัน JSON Server:
```bash
json-server --watch db.json --port 3000
```

### วิธีที่ 2: ใช้ Angular HTTP Interceptor (Mock)

สร้างไฟล์ `src/app/interceptors/mock-api.interceptor.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Learn Angular 18',
      description: 'Study Angular features',
      completed: false,
      priority: 'high',
      createdAt: '2025-01-15T10:00:00.000Z',
      updatedAt: '2025-01-15T10:00:00.000Z'
    }
  ];
  
  private nextId = 2;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (req.url.includes('/api/todos')) {
      return this.handleTodoRequests(req);
    }
    return next.handle(req);
  }

  private handleTodoRequests(req: HttpRequest<any>): Observable<any> {
    const { method, url } = req;
    
    // GET /api/todos
    if (method === 'GET' && url.endsWith('/api/todos')) {
      const response = new HttpResponse({
        status: 200,
        body: { success: true, data: this.todos }
      });
      return of(response).pipe(delay(500)); // Simulate network delay
    }
    
    // POST /api/todos
    if (method === 'POST' && url.endsWith('/api/todos')) {
      const newTodo: Todo = {
        id: this.nextId++,
        ...req.body,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.todos.push(newTodo);
      
      const response = new HttpResponse({
        status: 201,
        body: { success: true, data: newTodo }
      });
      return of(response).pipe(delay(500));
    }
    
    // เพิ่ม PUT, DELETE methods ตามต้องการ...
    
    return next.handle(req);
  }
}
```

---

## 🎨 สิ่งที่ได้เรียนรู้

### ✅ HTTP Service Features
- **HTTP Client** - การใช้ Angular HttpClient
- **Observable Pattern** - การจัดการ async data streams
- **Error Handling** - การจัดการ errors จาก API
- **Loading States** - การแสดงสถานะ loading
- **Type Safety** - การใช้ TypeScript interfaces กับ API
- **Environment Config** - การตั้งค่า API URLs

### ✅ Architecture & Best Practices
- **Service Layer** - แยก HTTP logic ออกจาก components
- **Single Responsibility** - Service จัดการ API, Component จัดการ UI
- **Error Boundaries** - Global error handling
- **State Management** - Local state + HTTP service
- **Async Patterns** - Observable, async/await
- **RESTful API** - GET, POST, PUT, DELETE operations

### ✅ Form Integration
- **Reactive Forms** - เชื่อมต่อ forms กับ HTTP service
- **Validation** - Client-side validation ก่อนส่ง API
- **Loading States** - แสดงสถานะขณะส่งข้อมูล
- **Error Handling** - จัดการ errors จาก form submission

### ✅ UI/UX Patterns
- **Loading Indicators** - แสดงสถานะกำลังโหลด
- **Error Messages** - แสดง error messages แบบ user-friendly
- **Optimistic Updates** - อัปเดต UI ทันทีแล้วค่อย sync กับ server
- **Confirmation Dialogs** - ยืนยันก่อนดำเนินการที่สำคัญ

---

## 🚀 การรันโปรเจค

```bash
# ติดตั้ง dependencies
npm install

# รัน JSON Server (Terminal 1)
json-server --watch db.json --port 3000

# รัน Angular App (Terminal 2)
npm start

# เปิด browser
http://localhost:4200
```

---

## 🎯 ฟีเจ่อร์ที่ได้

- ✅ เชื่อมต่อกับ Backend API
- ✅ CRUD Operations (Create, Read, Update, Delete)
- ✅ Real-time data synchronization
- ✅ Error handling และ retry mechanism
- ✅ Loading states และ user feedback
- ✅ Form validation ก่อนส่งข้อมูล
- ✅ Optimistic UI updates
- ✅ Priority system (High/Medium/Low)
- ✅ Detailed todo descriptions
- ✅ Responsive design
- ✅ Type-safe API integration

---

## 💡 เคล็ดลับสำหรับมือใหม่

1. **เริ่มจาก Mock Data**: ใช้ JSON Server หรือ Mock Interceptor ก่อน
2. **Error Handling**: จัดการ errors ทุก HTTP request
3. **Loading States**: แสดงสถานะ loading ให้ user รู้
4. **Type Safety**: ใช้ TypeScript interfaces กับ API responses
5. **Environment Config**: แยก API URLs ระหว่าง dev และ production
6. **Observable Pattern**: เรียนรู้ RxJS operators สำหรับจัดการ data streams
7. **Form Validation**: ตรวจสอบข้อมูลก่อนส่งไป API
8. **RESTful Design**: ใช้ HTTP methods อย่างถูกต้อง
9. **Error Retry**: ให้ user สามารถ retry เมื่อเกิด error
10. **Data Synchronization**: เก็บ local state และ sync กับ server

---

## 🏗️ Next Steps

1. **Authentication**: เพิ่ม login/logout functionality
2. **Caching**: ใช้ HTTP interceptors สำหรับ caching
3. **Offline Support**: ใช้ Service Workers
4. **Real-time Updates**: ใช้ WebSockets หรือ Server-Sent Events
5. **Pagination**: เพิ่ม pagination สำหรับ todo list
6. **Search & Filter**: เพิ่มฟีเจ่อร์ค้นหาและกรอง
7. **File Upload**: อัปโหลดไฟล์แนบกับ todos
8. **Push Notifications**: แจ้งเตือนเมื่อมี todos ใกล้ deadline

---

**Happy Coding! 🎯**

เรียนรู้ Angular 18 + HTTP Service แบบง่ายที่สุดสำหรับมือใหม่!
