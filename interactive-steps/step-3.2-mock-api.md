# Step 3.2: Mock API และ JSON Server

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การสร้าง **Mock API** และการใช้ **JSON Server** สำหรับทดสอบ HTTP Service

---

## 📚 สิ่งที่จะได้เรียนรู้
- JSON Server Setup
- Mock API Data
- HTTP Interceptors
- Development vs Production
- API Testing Strategies

---

## 📋 Prerequisites
- ✅ Step 3.1 เสร็จแล้ว (HTTP Service Setup)
- ✅ Node.js และ npm ติดตั้งแล้ว

---

## 📝 Task: Setup Mock API Environment

### 1. Install JSON Server

```bash
# Install JSON Server globally
npm install -g json-server

# หรือ install ในโปรเจค
npm install --save-dev json-server
```

### 2. Create Mock Data

สร้างไฟล์ `db.json` ใน root directory:

```json
{
  "todos": [
    {
      "id": 1,
      "title": "Learn Angular 18",
      "completed": false,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Build Todo App with HTTP Service",
      "completed": false,
      "createdAt": "2025-01-15T11:30:00.000Z",
      "updatedAt": "2025-01-15T11:30:00.000Z"
    },
    {
      "id": 3,
      "title": "Master RxJS Observables",
      "completed": true,
      "createdAt": "2025-01-14T09:15:00.000Z",
      "updatedAt": "2025-01-15T14:20:00.000Z"
    },
    {
      "id": 4,
      "title": "Learn Tailwind CSS",
      "completed": true,
      "createdAt": "2025-01-13T16:45:00.000Z",
      "updatedAt": "2025-01-14T10:30:00.000Z"
    },
    {
      "id": 5,
      "title": "Deploy to Production",
      "completed": false,
      "createdAt": "2025-01-15T13:00:00.000Z",
      "updatedAt": "2025-01-15T13:00:00.000Z"
    }
  ]
}
```

### 3. Create JSON Server Configuration

สร้างไฟล์ `json-server.json`:

```json
{
  "port": 3000,
  "watch": true,
  "delay": 500,
  "routes": "routes.json"
}
```

สร้างไฟล์ `routes.json`:

```json
{
  "/api/*": "/$1"
}
```

### 4. Add NPM Scripts

แก้ไขไฟล์ `package.json`:

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "api": "json-server --config json-server.json db.json",
    "dev": "concurrently \"npm run api\" \"npm run start\"",
    "api:reset": "git checkout db.json && npm run api"
  },
  "devDependencies": {
    // TODO: เพิ่ม concurrently สำหรับรัน API และ Angular พร้อมกัน
    // "concurrently": "^7.6.0"
  }
}
```

ติดตั้ง concurrently:
```bash
npm install --save-dev concurrently
```

### 5. Update Environment Configuration

แก้ไขไฟล์ `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiVersion: 'v1',
  // TODO: เพิ่ม development specific settings
  mockApi: true,
  enableLogging: true,
  apiDelay: 500 // simulate network delay
};
```

แก้ไขไฟล์ `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  apiVersion: 'v1',
  // TODO: เพิ่ม production specific settings  
  mockApi: false,
  enableLogging: false,
  apiDelay: 0
};
```

### 6. Create HTTP Interceptor for Mock API

สร้างไฟล์ `src/app/interceptors/mock-api.interceptor.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from '../models/todo.model';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  // TODO: สร้าง mock data สำหรับใช้เมื่อไม่มี JSON Server
  private mockTodos: Todo[] = [
    {
      id: 1,
      title: 'Mock Todo 1',
      completed: false,
      createdAt: new Date('2025-01-15T10:00:00.000Z')
    },
    {
      id: 2,
      title: 'Mock Todo 2', 
      completed: true,
      createdAt: new Date('2025-01-15T11:00:00.000Z')
    }
  ];
  
  private nextId = 3;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // TODO: ตรวจสอบว่าต้องใช้ mock API หรือไม่
    if (environment.mockApi && req.url.includes('/api/todos')) {
      console.log('🎭 Mock API intercepted:', req.method, req.url);
      return this.handleMockRequest(req);
    }
    
    // ถ้าไม่ใช่ mock ให้ส่งต่อไปปกติ
    return next.handle(req);
  }

  private handleMockRequest(req: HttpRequest<any>): Observable<any> {
    const { method, url } = req;
    
    // TODO: จัดการ GET /api/todos
    if (method === 'GET' && url.endsWith('/api/todos')) {
      return this.getMockTodos();
    }
    
    // TODO: จัดการ GET /api/todos/{id}
    if (method === 'GET' && url.match(/\/api\/todos\/\d+$/)) {
      const id = this.extractIdFromUrl(url);
      return this.getMockTodoById(id);
    }
    
    // TODO: จัดการ POST /api/todos
    if (method === 'POST' && url.endsWith('/api/todos')) {
      return this.createMockTodo(req.body);
    }
    
    // TODO: จัดการ PUT /api/todos/{id}
    if (method === 'PUT' && url.match(/\/api\/todos\/\d+$/)) {
      const id = this.extractIdFromUrl(url);
      return this.updateMockTodo(id, req.body);
    }
    
    // TODO: จัดการ DELETE /api/todos/{id}
    if (method === 'DELETE' && url.match(/\/api\/todos\/\d+$/)) {
      const id = this.extractIdFromUrl(url);
      return this.deleteMockTodo(id);
    }
    
    // ถ้าไม่ match return 404
    return this.mockError('Not Found', 404);
  }

  // TODO: สร้าง method สำหรับ GET all todos
  private getMockTodos(): Observable<HttpResponse<ApiResponse<Todo[]>>> {
    // เขียนโค้ดตรงนี้:
    // 1. สร้าง response ตาม ApiResponse format
    // 2. ใส่ mockTodos ใน data
    // 3. return HttpResponse with delay
    
    const response = new HttpResponse({
      status: 200,
      body: {
        success: true,
        data: this.mockTodos,
        message: 'Todos retrieved successfully'
      }
    });
    
    return of(response).pipe(delay(environment.apiDelay));
  }

  // TODO: สร้าง method สำหรับ GET todo by ID
  private getMockTodoById(id: number): Observable<HttpResponse<ApiResponse<Todo>>> {
    // เขียนโค้ดตรงนี้:
    // 1. หา todo ที่มี id ตรงกัน
    // 2. ถ้าไม่เจอ return 404 error
    // 3. ถ้าเจอ return todo data
    
    const todo = this.mockTodos.find(t => t.id === id);
    
    if (!todo) {
      return this.mockError(`Todo with id ${id} not found`, 404);
    }
    
    const response = new HttpResponse({
      status: 200,
      body: {
        success: true,
        data: todo,
        message: 'Todo retrieved successfully'
      }
    });
    
    return of(response).pipe(delay(environment.apiDelay));
  }

  // TODO: สร้าง method สำหรับ CREATE todo
  private createMockTodo(todoData: CreateTodoRequest): Observable<HttpResponse<ApiResponse<Todo>>> {
    // เขียนโค้ดตรงนี้:
    // 1. สร้าง todo ใหม่จาก request data
    // 2. เพิ่ม id, createdAt, updatedAt
    // 3. เพิ่มใน mockTodos array
    // 4. return todo ที่สร้างใหม่
    
    const newTodo: Todo = {
      id: this.nextId++,
      title: todoData.title,
      completed: todoData.completed || false,
      createdAt: new Date()
    };
    
    this.mockTodos.push(newTodo);
    
    const response = new HttpResponse({
      status: 201,
      body: {
        success: true,
        data: newTodo,
        message: 'Todo created successfully'
      }
    });
    
    return of(response).pipe(delay(environment.apiDelay));
  }

  // TODO: สร้าง method สำหรับ UPDATE todo
  private updateMockTodo(id: number, updateData: UpdateTodoRequest): Observable<HttpResponse<ApiResponse<Todo>>> {
    // เขียนโค้ดตรงนี้:
    // 1. หา todo ที่ต้องการ update
    // 2. ถ้าไม่เจอ return 404
    // 3. update properties ที่ส่งมา
    // 4. update updatedAt timestamp
    // 5. return updated todo
    
    const todoIndex = this.mockTodos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return this.mockError(`Todo with id ${id} not found`, 404);
    }
    
    // Update todo
    const updatedTodo = {
      ...this.mockTodos[todoIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    this.mockTodos[todoIndex] = updatedTodo;
    
    const response = new HttpResponse({
      status: 200,
      body: {
        success: true,
        data: updatedTodo,
        message: 'Todo updated successfully'
      }
    });
    
    return of(response).pipe(delay(environment.apiDelay));
  }

  // TODO: สร้าง method สำหรับ DELETE todo
  private deleteMockTodo(id: number): Observable<HttpResponse<ApiResponse<void>>> {
    // เขียนโค้ดตรงนี้:
    // 1. หา todo ที่ต้องการลบ
    // 2. ถ้าไม่เจอ return 404
    // 3. ลบออกจาก array
    // 4. return success response
    
    const todoIndex = this.mockTodos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return this.mockError(`Todo with id ${id} not found`, 404);
    }
    
    this.mockTodos.splice(todoIndex, 1);
    
    const response = new HttpResponse({
      status: 200,
      body: {
        success: true,
        data: undefined,
        message: 'Todo deleted successfully'
      }
    });
    
    return of(response).pipe(delay(environment.apiDelay));
  }

  // Helper Methods
  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  private mockError(message: string, status: number = 500): Observable<never> {
    const error = new HttpErrorResponse({
      error: { success: false, message },
      status,
      statusText: message
    });
    return throwError(() => error).pipe(delay(environment.apiDelay));
  }
}
```

### 7. Register Interceptor

แก้ไขไฟล์ `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockApiInterceptor } from './interceptors/mock-api.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // TODO: เพิ่ม MockApiInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockApiInterceptor,
      multi: true
    }
  ]
};
```

### 8. Update TodoService to Handle API Response Format

แก้ไขไฟล์ `src/app/services/todo.service.ts`:

```typescript
// เพิ่มใน getTodos method
getTodos(): Observable<Todo[]> {
  this.setLoading(true);
  this.clearError();

  return this.http.get<ApiResponse<Todo[]>>(this.apiUrl).pipe(
    // TODO: แก้ไข mapping เพื่อรองรับ API response format
    map(response => {
      console.log('✅ API Response:', response);
      return response.data; // Extract data from API response
    }),
    tap(todos => {
      console.log('✅ Todos loaded:', todos.length);
    }),
    catchError(error => this.handleError(error)),
    finalize(() => this.setLoading(false))
  );
}

// เพิ่มใน createTodo method  
createTodo(todoData: CreateTodoRequest): Observable<Todo> {
  this.setLoading(true);
  this.clearError();

  return this.http.post<ApiResponse<Todo>>(this.apiUrl, todoData).pipe(
    // TODO: แก้ไข mapping
    map(response => {
      console.log('✅ Todo created:', response);
      return response.data;
    }),
    catchError(error => this.handleError(error)),
    finalize(() => this.setLoading(false))
  );
}

// เพิ่ม method สำหรับ toggle ที่ใช้บ่อย
toggleTodo(id: number): Observable<Todo> {
  // TODO: สร้าง convenience method สำหรับ toggle completed status
  // 1. หา todo ปัจจุบัน (ถ้าจำเป็น)
  // 2. call updateTodo พร้อม toggle completed
  
  return this.http.get<ApiResponse<Todo>>(`${this.apiUrl}/${id}`).pipe(
    switchMap(response => {
      const currentTodo = response.data;
      return this.updateTodo(id, { completed: !currentTodo.completed });
    })
  );
}
```

### 9. Create API Documentation Component

สร้างไฟล์ `src/app/components/api-docs/api-docs.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">📚 API Documentation</h1>
      
      <!-- JSON Server Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 class="text-xl font-semibold text-blue-800 mb-2">JSON Server Status</h2>
        <p class="text-blue-700 mb-2">
          Base URL: <code class="bg-white px-2 py-1 rounded">http://localhost:3000/api</code>
        </p>
        <p class="text-blue-700">
          Test connection: 
          <a href="http://localhost:3000/api/todos" target="_blank" 
             class="underline hover:text-blue-900">
            http://localhost:3000/api/todos
          </a>
        </p>
      </div>

      <!-- API Endpoints -->
      <div class="space-y-6">
        
        <!-- GET /todos -->
        <div class="bg-white rounded-lg shadow border p-4">
          <div class="flex items-center mb-3">
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mr-3">GET</span>
            <code class="text-lg font-mono">/todos</code>
          </div>
          <p class="text-gray-600 mb-3">Get all todos</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2">Response:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>{{
getResponseExample
              }}</code></pre>
            </div>
            <div>
              <h4 class="font-medium mb-2">Example:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>// Angular Service
this.todoService.getTodos().subscribe(todos => {
  console.log(todos);
});</code></pre>
            </div>
          </div>
        </div>

        <!-- POST /todos -->
        <div class="bg-white rounded-lg shadow border p-4">
          <div class="flex items-center mb-3">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mr-3">POST</span>
            <code class="text-lg font-mono">/todos</code>
          </div>
          <p class="text-gray-600 mb-3">Create a new todo</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2">Request Body:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>{{
postRequestExample
              }}</code></pre>
            </div>
            <div>
              <h4 class="font-medium mb-2">Example:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>// Angular Service
const newTodo = {
  title: "Learn Angular",
  completed: false
};
this.todoService.createTodo(newTodo);</code></pre>
            </div>
          </div>
        </div>

        <!-- GET /todos/{id} -->
        <div class="bg-white rounded-lg shadow border p-4">
          <div class="flex items-center mb-3">
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mr-3">GET</span>
            <code class="text-lg font-mono">/todos/{id}</code>
          </div>
          <p class="text-gray-600 mb-3">Get a specific todo by ID</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2">Parameters:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>id: number (path parameter)</code></pre>
            </div>
            <div>
              <h4 class="font-medium mb-2">Example:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>// Angular Service
this.todoService.getTodoById(1)
  .subscribe(todo => console.log(todo));</code></pre>
            </div>
          </div>
        </div>

        <!-- PUT /todos/{id} -->
        <div class="bg-white rounded-lg shadow border p-4">
          <div class="flex items-center mb-3">
            <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium mr-3">PUT</span>
            <code class="text-lg font-mono">/todos/{id}</code>
          </div>
          <p class="text-gray-600 mb-3">Update an existing todo</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2">Request Body:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>{{
putRequestExample
              }}</code></pre>
            </div>
            <div>
              <h4 class="font-medium mb-2">Example:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>// Angular Service
const updates = { completed: true };
this.todoService.updateTodo(1, updates);</code></pre>
            </div>
          </div>
        </div>

        <!-- DELETE /todos/{id} -->
        <div class="bg-white rounded-lg shadow border p-4">
          <div class="flex items-center mb-3">
            <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium mr-3">DELETE</span>
            <code class="text-lg font-mono">/todos/{id}</code>
          </div>
          <p class="text-gray-600 mb-3">Delete a todo</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2">Parameters:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>id: number (path parameter)</code></pre>
            </div>
            <div>
              <h4 class="font-medium mb-2">Example:</h4>
              <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>// Angular Service
this.todoService.deleteTodo(1)
  .subscribe(() => console.log('Deleted'));</code></pre>
            </div>
          </div>
        </div>

      </div>

      <!-- Error Responses -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Error Responses</h2>
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <pre class="text-sm"><code>{{
errorResponseExample
          }}</code></pre>
        </div>
      </div>

    </div>
  `
})
export class ApiDocsComponent {
  
  getResponseExample = `{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Learn Angular 18",
      "completed": false,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "message": "Todos retrieved successfully"
}`;

  postRequestExample = `{
  "title": "Learn Angular 18",
  "completed": false
}`;

  putRequestExample = `{
  "title": "Updated title",
  "completed": true
}`;

  errorResponseExample = `{
  "success": false,
  "message": "Todo with id 999 not found",
  "error": "Not Found"
}`;
}
```

### 10. Update App Component Navigation

แก้ไขไฟล์ `src/app/app.component.html`:

```html
<div class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-6xl mx-auto px-4 py-3">
      <div class="flex space-x-6">
        <button 
          (click)="currentView.set('api-docs')"
          class="px-3 py-2 rounded"
          [class]="currentView() === 'api-docs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'">
          📚 API Docs
        </button>
        <button 
          (click)="currentView.set('service-test')"
          class="px-3 py-2 rounded"
          [class]="currentView() === 'service-test' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'">
          🧪 Service Test
        </button>
        <button 
          (click)="currentView.set('todo-app')"
          class="px-3 py-2 rounded"
          [class]="currentView() === 'todo-app' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'">
          📝 Todo App
        </button>
      </div>
    </div>
  </nav>

  <!-- Content -->
  <main class="py-6">
    @if (currentView() === 'api-docs') {
      <app-api-docs></app-api-docs>
    } @else if (currentView() === 'service-test') {
      <app-service-test></app-service-test>
    } @else {
      <app-todo-app></app-todo-app>
    }
  </main>
</div>
```

แก้ไขไฟล์ `src/app/app.component.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { TodoAppComponent } from './components/todo-app/todo-app.component';
import { ServiceTestComponent } from './components/service-test/service-test.component';
import { ApiDocsComponent } from './components/api-docs/api-docs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoAppComponent, ServiceTestComponent, ApiDocsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentView = signal<'api-docs' | 'service-test' | 'todo-app'>('api-docs');
}
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: JSON Server Setup

```bash
# รัน JSON Server
npm run api

# ทดสอบใน browser หรือ Postman
curl http://localhost:3000/api/todos
```

### Test 2: Mock API Interceptor

ตั้งค่า `environment.mockApi = true` และทดสอบว่า:
- ✅ Service Test component ทำงานได้
- ✅ CRUD operations ทำงาน
- ✅ Loading states แสดงถูกต้อง
- ✅ Error handling ทำงาน

### Test 3: Development Workflow

```bash
# รัน Angular + JSON Server พร้อมกัน
npm run dev
```

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Working JSON Server

- ✅ JSON Server รันที่ port 3000
- ✅ API endpoints ทั้ง 5 ตัวทำงาน
- ✅ CORS configured ถูกต้อง
- ✅ Mock data พร้อมใช้งาน

### 2. Mock API Interceptor

- ✅ Interceptor จัดการ API calls ได้
- ✅ Response format ตรงกับ JSON Server
- ✅ Error handling ครบถ้วน
- ✅ Development/Production switching

### 3. API Documentation

- ✅ Complete API documentation
- ✅ Code examples สำหรับแต่ละ endpoint
- ✅ Error response documentation
- ✅ Interactive navigation

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ Mock API Development
- JSON Server setup และ configuration
- Mock data creation และ management
- Development vs Production API handling
- HTTP Interceptors สำหรับ mocking

### ✅ API Testing Strategies
- Local development setup
- API endpoint testing
- Error scenario testing
- Development workflow optimization

### ✅ Development Workflow
- Concurrent development servers
- Environment-based configuration
- API documentation as code
- Testing infrastructure

---

## 🔧 Troubleshooting

### ❌ JSON Server ไม่ start
**Solution**: ตรวจสอบ port และ file paths
```bash
# ตรวจสอบ port 3000 ว่าถูกใช้อยู่หรือไม่
lsof -i :3000

# หรือเปลี่ยน port
json-server --port 3001 db.json
```

### ❌ CORS Error
**Solution**: JSON Server รองรับ CORS โดยอัตโนมัติ แต่ถ้ามีปัญหา:
```bash
json-server --watch db.json --port 3000 --middlewares ./cors.js
```

### ❌ Interceptor ไม่ทำงาน
**Solution**: ตรวจสอบ registration ใน app.config.ts
```typescript
{
  provide: HTTP_INTERCEPTORS,
  useClass: MockApiInterceptor,
  multi: true
}
```

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 3.3: Integration กับ Todo Components](./step-3.3-service-integration.md)

---

## 💡 เคล็ดลับ

1. **JSON Server Benefits**: เหมาะสำหรับ prototyping และ development
2. **Mock Interceptor**: ใช้เมื่อไม่สามารถรัน JSON Server ได้
3. **Environment Switching**: ง่ายต่อการเปลี่ยนระหว่าง mock และ real API
4. **API Documentation**: สร้างเอกสารพร้อมกับการพัฒนา
5. **Development Workflow**: ใช้ concurrently สำหรับรัน multiple services

---

**🎯 Goal Achieved**: สร้าง Mock API Environment สำหรับ Development!
