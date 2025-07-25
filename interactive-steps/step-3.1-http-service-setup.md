# Step 3.1: HTTP Service Setup

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การสร้าง **Angular HTTP Service** สำหรับเชื่อมต่อกับ Backend API

---

## 📚 สิ่งที่จะได้เรียนรู้
- Angular HTTP Client
- Service Architecture
- Environment Configuration
- API Response Types
- Error Handling Basics

---

## 📋 Prerequisites
- ✅ Step 2.1-2.3 เสร็จแล้ว (Form Components)
- ✅ เข้าใจ TypeScript Interfaces
- ✅ เข้าใจ Angular Services พื้นฐาน

---

## 📝 Task: Setup HTTP Service Foundation

### 1. Configure HTTP Client in App Config

แก้ไขไฟล์ `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // TODO: เพิ่ม HTTP Client provider
    provideHttpClient(withInterceptorsFromDi())
  ]
};
```

### 2. Create Environment Configuration

สร้างไฟล์ `src/environments/environment.ts`:

```typescript
// TODO: สร้าง environment configuration
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  apiVersion: 'v1'
};
```

สร้างไฟล์ `src/environments/environment.prod.ts`:

```typescript
// TODO: สร้าง production environment
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8000/api',
  apiVersion: 'v1'
};
```

### 3. Extended Todo Model for API

แก้ไขไฟล์ `src/app/models/todo.model.ts`:

```typescript
// Core Todo Interface (สำหรับแสดงผลใน UI)
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// TODO: เพิ่ม API Request/Response Types

// API Request Types
export interface CreateTodoRequest {
  title: string;
  completed?: boolean; // optional, default false
}

export interface UpdateTodoRequest {
  title?: string; // optional
  completed?: boolean; // optional
}

// API Response Types
export interface TodoApiResponse {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string; // ISO string from API
  updatedAt: string; // ISO string from API
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string; // optional
}

export interface ApiError {
  success: false;
  message: string;
  error?: any; // optional
}

// TODO: สร้าง helper function แปลง API response เป็น Todo
export function mapApiResponseToTodo(apiTodo: TodoApiResponse): Todo {
  return {
    id: apiTodo.id,
    title: apiTodo.title,
    completed: apiTodo.completed,
    createdAt: new Date(apiTodo.createdAt)
  };
}

// TODO: สร้าง helper function แปลง Todo เป็น API request
export function mapTodoToApiRequest(todo: Partial<Todo>): CreateTodoRequest | UpdateTodoRequest {
  return {
    title: todo.title || '',
    completed: todo.completed
  };
}
```

### 4. Create Basic HTTP Service

สร้างไฟล์ `src/app/services/todo.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  Todo, 
  CreateTodoRequest, 
  UpdateTodoRequest,
  TodoApiResponse,
  ApiResponse,
  ApiError,
  mapApiResponseToTodo 
} from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // TODO: สร้าง private readonly properties
  private readonly apiUrl = `${environment.apiUrl}/todos`;
  
  // TODO: สร้าง signals สำหรับ loading และ error states
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  
  // TODO: สร้าง public readonly signals
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // TODO: inject HttpClient ใน constructor
  constructor(private http: HttpClient) {}

  // ============================================
  // Public API Methods
  // ============================================

  // TODO: สร้าง method getTodos()
  getTodos(): Observable<Todo[]> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.get<ApiResponse<TodoApiResponse[]>>(this.apiUrl).pipe(
      map(response => response.data.map(mapApiResponseToTodo)),
      tap(() => console.log('Todos loaded successfully')),
      catchError(this.handleError.bind(this)),
      finalize(() => this.setLoading(false))
    );
  }

  // TODO: สร้าง method getTodoById()
  getTodoById(id: number): Observable<Todo> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.get<ApiResponse<TodoApiResponse>>(`${this.apiUrl}/${id}`).pipe(
      map(response => mapApiResponseToTodo(response.data)),
      catchError(this.handleError.bind(this)),
      finalize(() => this.setLoading(false))
    );
  }

  // TODO: สร้าง method createTodo()
  createTodo(todoData: CreateTodoRequest): Observable<Todo> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.post<ApiResponse<TodoApiResponse>>(this.apiUrl, todoData).pipe(
      map(response => mapApiResponseToTodo(response.data)),
      tap(todo => console.log('Todo created:', todo.title)),
      catchError(this.handleError.bind(this)),
      finalize(() => this.setLoading(false))
    );
  }

  // TODO: สร้าง method updateTodo()
  updateTodo(id: number, updateData: UpdateTodoRequest): Observable<Todo> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.put<ApiResponse<TodoApiResponse>>(`${this.apiUrl}/${id}`, updateData).pipe(
      map(response => mapApiResponseToTodo(response.data)),
      tap(todo => console.log('Todo updated:', todo.title)),
      catchError(this.handleError.bind(this)),
      finalize(() => this.setLoading(false))
    );
  }

  // TODO: สร้าง method deleteTodo()
  deleteTodo(id: number): Observable<void> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      tap(() => console.log('Todo deleted:', id)),
      catchError(this.handleError.bind(this)),
      finalize(() => this.setLoading(false))
    );
  }

  // ============================================
  // Helper Methods
  // ============================================

  // TODO: สร้าง private method สำหรับ set loading state
  private setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  // TODO: สร้าง private method สำหรับ clear error
  private clearError(): void {
    this._error.set(null);
  }

  // TODO: สร้าง private method สำหรับ set error
  private setError(message: string): void {
    this._error.set(message);
    console.error('TodoService Error:', message);
  }

  // TODO: สร้าง private method สำหรับ handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Invalid data provided';
          break;
        case 404:
          errorMessage = 'Not Found: Todo does not exist';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    this.setError(errorMessage);
    return throwError(() => error);
  }
}
```

### 5. Create Service Test Component

สร้างไฟล์ `src/app/components/service-test/service-test.component.ts`:

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo, CreateTodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-service-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Todo Service Test</h1>
      
      <!-- Service Status -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <h2 class="text-xl font-semibold mb-4">Service Status</h2>
        
        <!-- Loading State -->
        @if (todoService.isLoading()) {
          <div class="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span class="text-blue-800">Loading...</span>
            </div>
          </div>
        }
        
        <!-- Error State -->
        @if (todoService.error()) {
          <div class="bg-red-50 border border-red-200 rounded p-3 mb-3">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-red-800">{{ todoService.error() }}</span>
            </div>
          </div>
        }
      </div>
      
      <!-- Test Actions -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <h2 class="text-xl font-semibold mb-4">Test Actions</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <!-- TODO: สร้าง test buttons -->
          <button 
            (click)="testGetTodos()"
            [disabled]="todoService.isLoading()"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
            Get All Todos
          </button>
          
          <button 
            (click)="testCreateTodo()"
            [disabled]="todoService.isLoading()"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400">
            Create Test Todo
          </button>
          
          <button 
            (click)="testGetTodoById()"
            [disabled]="todoService.isLoading() || todos().length === 0"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400">
            Get First Todo
          </button>
          
          <button 
            (click)="testUpdateTodo()"
            [disabled]="todoService.isLoading() || todos().length === 0"
            class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400">
            Update First Todo
          </button>
          
          <button 
            (click)="testDeleteTodo()"
            [disabled]="todoService.isLoading() || todos().length === 0"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400">
            Delete Last Todo
          </button>
        </div>
      </div>
      
      <!-- Results -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-xl font-semibold mb-4">Results ({{ todos().length }} todos)</h2>
        
        @if (todos().length === 0) {
          <p class="text-gray-500">No todos found. Try "Get All Todos" first.</p>
        } @else {
          <div class="space-y-2">
            @for (todo of todos(); track todo.id) {
              <div class="border rounded p-3 flex items-center justify-between">
                <div>
                  <h3 class="font-medium" [class.line-through]="todo.completed">
                    {{ todo.title }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    ID: {{ todo.id }} | Created: {{ todo.createdAt | date:'short' }}
                  </p>
                </div>
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  [class]="todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                  {{ todo.completed ? 'Completed' : 'Pending' }}
                </span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class ServiceTestComponent implements OnInit {
  // TODO: inject TodoService
  readonly todoService = inject(TodoService);
  
  // TODO: สร้าง local state สำหรับเก็บ todos
  private readonly _todos = signal<Todo[]>([]);
  readonly todos = this._todos.asReadonly();

  ngOnInit(): void {
    // TODO: load todos เมื่อ component init
    this.testGetTodos();
  }

  // TODO: สร้าง test methods

  testGetTodos(): void {
    // เขียนโค้ดตรงนี้:
    // call todoService.getTodos()
    // subscribe และอัพเดท _todos signal
    console.log('Testing getTodos()...');
  }

  testCreateTodo(): void {
    // เขียนโค้ดตรงนี้:
    // สร้าง test todo data
    // call todoService.createTodo()
    // subscribe และเพิ่ม todo ใหม่ใน _todos
    console.log('Testing createTodo()...');
    
    const testTodo: CreateTodoRequest = {
      title: `Test Todo ${Date.now()}`,
      completed: false
    };
  }

  testGetTodoById(): void {
    // เขียนโค้ดตรงนี้:
    // ใช้ ID ของ todo แรกใน list
    // call todoService.getTodoById()
    // subscribe และ log ผลลัพธ์
    console.log('Testing getTodoById()...');
    
    const firstTodo = this.todos()[0];
    if (firstTodo) {
      // เขียนโค้ดตรงนี้
    }
  }

  testUpdateTodo(): void {
    // เขียนโค้ดตรงนี้:
    // toggle completed status ของ todo แรก
    // call todoService.updateTodo()
    // subscribe และอัพเดท _todos
    console.log('Testing updateTodo()...');
    
    const firstTodo = this.todos()[0];
    if (firstTodo) {
      // เขียนโค้ดตรงนี้
    }
  }

  testDeleteTodo(): void {
    // เขียนโค้ดตรงนี้:
    // ลบ todo ตัวสุดท้าย
    // call todoService.deleteTodo()
    // subscribe และลบออกจาก _todos
    console.log('Testing deleteTodo()...');
    
    const todos = this.todos();
    const lastTodo = todos[todos.length - 1];
    if (lastTodo) {
      // เขียนโค้ดตรงนี้
    }
  }
}
```

### 6. Update App Component for Testing

แก้ไข `src/app/app.component.html`:

```html
<!-- TODO: เพิ่ม service test component สำหรับทดสอบ -->
<div class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-4xl mx-auto px-4 py-3">
      <div class="flex space-x-6">
        <button 
          (click)="currentView.set('service-test')"
          class="px-3 py-2 rounded"
          [class]="currentView() === 'service-test' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'">
          Service Test
        </button>
        <button 
          (click)="currentView.set('todo-app')"
          class="px-3 py-2 rounded"
          [class]="currentView() === 'todo-app' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'">
          Todo App
        </button>
      </div>
    </div>
  </nav>

  <!-- Content -->
  <main class="py-6">
    @if (currentView() === 'service-test') {
      <app-service-test></app-service-test>
    } @else {
      <app-todo-app></app-todo-app>
    }
  </main>
</div>
```

แก้ไข `src/app/app.component.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { ServiceTestComponent } from './components/service-test/service-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoAppComponent, ServiceTestComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // TODO: สร้าง signal สำหรับ current view
  currentView = signal<'service-test' | 'todo-app'>('service-test');
}
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Service Setup

ตรวจสอบว่า:
- ✅ HTTP Client configured ใน app.config.ts
- ✅ Environment files สร้างถูกต้อง
- ✅ Todo model มี API types ครบ
- ✅ TodoService compile ได้ไม่มี error

### Test 2: Service Test Component

ตรวจสอบว่า:
- ✅ Service Test component แสดงผลได้
- ✅ Loading state แสดงขณะทำงาน
- ✅ Error state แสดงเมื่อเกิด error
- ✅ Test buttons ทำงานได้

### Test 3: Mock API Response

สำหรับการทดสอบ ใช้ Mock data:
```typescript
// ใน constructor ของ TodoService
if (!environment.production) {
  console.log('Using mock API for development');
}
```

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Complete Service Structure

```typescript
export class TodoService {
  private readonly apiUrl = `${environment.apiUrl}/todos`;
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // All CRUD methods implemented
}
```

### 2. Working API Types

- ✅ Request/Response interfaces
- ✅ Error handling types
- ✅ Helper mapping functions
- ✅ Type-safe service methods

### 3. Service Test Component

- ✅ Interactive testing interface
- ✅ Loading และ error state display
- ✅ All CRUD operations testable
- ✅ Real-time results display

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ HTTP Service Architecture
- Service layer separation
- HTTP Client configuration
- Environment management
- API response mapping

### ✅ Observable Patterns
- HTTP requests as Observables
- RxJS operators (map, tap, catchError, finalize)
- Error handling with observables
- State management with signals

### ✅ Type Safety
- API request/response types
- Error type definitions
- Generic API responses
- Type mapping functions

### ✅ Error Handling
- HTTP error interception
- User-friendly error messages
- Loading state management
- Retry mechanisms

---

## 🔧 Troubleshooting

### ❌ Error: "HttpClient not provided"
**Solution**: ตรวจสอบ app.config.ts
```typescript
providers: [
  provideHttpClient(withInterceptorsFromDi())
]
```

### ❌ CORS Error
**Solution**: ตั้งค่า development proxy หรือใช้ JSON Server
```json
// angular.json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

### ❌ Environment not found
**Solution**: ตรวจสอบ path และ export
```typescript
import { environment } from '../../environments/environment';
```

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 3.2: Mock API และ JSON Server](./step-3.2-mock-api.md)

---

## 💡 เคล็ดลับ

1. **Start Simple**: เริ่มจาก basic HTTP calls ก่อน
2. **Type Everything**: ใช้ TypeScript interfaces ทุกที่
3. **Handle Errors**: จัดการ error ทุก HTTP request
4. **Loading States**: แสดงสถานะให้ user รู้
5. **Environment Config**: แยก development และ production URLs

---

**🎯 Goal Achieved**: สร้าง HTTP Service Foundation สำหรับ API Integration!
