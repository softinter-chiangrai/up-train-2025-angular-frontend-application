# Step 6: API Integration

🎯 **เป้าหมาย**: เชื่อมต่อกับ REST API และจัดการ HTTP operations

## 📋 สิ่งที่จะทำใน Step นี้

- [ ] ตั้งค่า JSON Server เป็น mock API
- [ ] ปรับปรุง error handling
- [ ] เพิ่ม retry logic
- [ ] ใช้ HTTP interceptors
- [ ] จัดการ offline scenarios

## 🔧 ตั้งค่า JSON Server

### 1. ติดตั้ง JSON Server

```bash
npm install -D json-server concurrently
```

### 2. สร้างไฟล์ Mock Data

สร้าง `api/db.json`:

```json
{
  "todos": [
    {
      "id": 1,
      "title": "Learn Angular 18 Signals",
      "completed": false,
      "createdAt": "2024-01-15T08:00:00.000Z",
      "priority": "high",
      "category": "learning"
    },
    {
      "id": 2,
      "title": "Setup Tailwind CSS",
      "completed": true,
      "createdAt": "2024-01-15T09:00:00.000Z",
      "priority": "medium",
      "category": "setup"
    },
    {
      "id": 3,
      "title": "Build Todo Components",
      "completed": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "priority": "high",
      "category": "development"
    },
    {
      "id": 4,
      "title": "Write Unit Tests",
      "completed": false,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "priority": "low",
      "category": "testing"
    },
    {
      "id": 5,
      "title": "Deploy to Production",
      "completed": false,
      "createdAt": "2024-01-15T12:00:00.000Z",
      "priority": "medium",
      "category": "deployment"
    }
  ],
  "categories": [
    { "id": "learning", "name": "Learning", "color": "#3b82f6" },
    { "id": "setup", "name": "Setup", "color": "#10b981" },
    { "id": "development", "name": "Development", "color": "#f59e0b" },
    { "id": "testing", "name": "Testing", "color": "#ef4444" },
    { "id": "deployment", "name": "Deployment", "color": "#8b5cf6" }
  ],
  "settings": {
    "theme": "light",
    "autoRefresh": true,
    "notificationsEnabled": true
  }
}
```

### 3. สร้างไฟล์ JSON Server Config

สร้าง `api/routes.json`:

```json
{
  "/api/*": "/$1",
  "/todos/:id/toggle": "/todos/:id"
}
```

สร้าง `api/server.js`:

```javascript
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('api/db.json');
const middlewares = jsonServer.defaults();

// Add custom middleware
server.use(middlewares);

// Add delay to simulate real API
server.use((req, res, next) => {
  setTimeout(next, 500); // 500ms delay
});

// Custom routes
server.post('/api/todos/:id/toggle', (req, res) => {
  const todoId = parseInt(req.params.id);
  const db = router.db; // lowdb instance
  const todo = db.get('todos').find({ id: todoId }).value();
  
  if (todo) {
    const updatedTodo = db.get('todos')
      .find({ id: todoId })
      .assign({ completed: !todo.completed })
      .write();
    
    res.json(updatedTodo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Use default router
server.use('/api', router);

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 JSON Server is running on http://localhost:${port}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET    /api/todos`);
  console.log(`   POST   /api/todos`);
  console.log(`   GET    /api/todos/:id`);
  console.log(`   PUT    /api/todos/:id`);
  console.log(`   DELETE /api/todos/:id`);
  console.log(`   POST   /api/todos/:id/toggle`);
});
```

### 4. อัพเดท package.json Scripts

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "api": "node api/server.js",
    "dev": "concurrently \"npm run api\" \"ng serve\" --names \"API,APP\" --prefix-colors \"blue,green\"",
    "dev:api": "nodemon api/server.js",
    "dev:full": "concurrently \"npm run dev:api\" \"ng serve\" --names \"API,APP\" --prefix-colors \"blue,green\""
  }
}
```

## 🔧 HTTP Interceptors

### 1. สร้าง Error Interceptor

สร้าง `src/app/interceptors/error.interceptor.ts`:

```typescript
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
            break;
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'You are not authorized to perform this action.';
            break;
          case 403:
            errorMessage = 'Access forbidden.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please try again later.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage = `Server Error (${error.status}): ${error.message}`;
        }
      }

      // Show user-friendly notification
      notificationService.showError(errorMessage);

      // Log detailed error for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        url: req.url,
        method: req.method,
        error: error
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
```

### 2. สร้าง Loading Interceptor

สร้าง `src/app/interceptors/loading.interceptor.ts`:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Don't show loading for certain requests
  if (req.url.includes('notifications') || req.headers.get('X-Skip-Loading') === 'true') {
    return next(req);
  }

  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};
```

### 3. สร้าง Retry Interceptor

สร้าง `src/app/interceptors/retry.interceptor.ts`:

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, timer, mergeMap, throwError } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  return next(req).pipe(
    retry({
      count: maxRetries,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Only retry on network errors or 5xx server errors
        if (error.status === 0 || (error.status >= 500 && error.status < 600)) {
          console.log(`Retrying request (${retryCount}/${maxRetries})...`);
          return timer(retryDelay * retryCount); // Exponential backoff
        }
        
        // Don't retry for client errors (4xx)
        return throwError(() => error);
      }
    })
  );
};
```

## 🚀 Enhanced TodoService

### 1. อัพเดท TodoService

แก้ไข `src/app/services/todo.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { catchError, map, tap, switchMap, shareReplay } from 'rxjs';
import { Todo, UpdateTodoRequest } from '../models/todo.model';

interface TodoFilters {
  status?: 'all' | 'pending' | 'completed';
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:3000/api';
  
  // Cache
  private todosCache$ = new BehaviorSubject<Todo[] | null>(null);
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private lastFetchTime = 0;

  // Signals
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _isOnline = signal<boolean>(navigator.onLine);

  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isOnline = this._isOnline.asReadonly();

  constructor(private http: HttpClient) {
    this.setupOnlineStatusDetection();
  }

  private setupOnlineStatusDetection(): void {
    window.addEventListener('online', () => {
      this._isOnline.set(true);
      console.log('🌐 Back online - syncing data...');
      this.refreshCache();
    });

    window.addEventListener('offline', () => {
      this._isOnline.set(false);
      console.log('📴 Gone offline - using cached data');
    });
  }

  private getHttpOptions(options: { skipCache?: boolean } = {}) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (options.skipCache) {
      headers = headers.set('Cache-Control', 'no-cache');
    }

    return { headers };
  }

  // ============================================
  // GET: Todos with caching and filtering
  // ============================================
  getTodos(filters: TodoFilters = {}): Observable<Todo[]> {
    // Check cache first
    if (this.shouldUseCache() && this.todosCache$.value) {
      return of(this.filterTodos(this.todosCache$.value, filters));
    }

    this._isLoading.set(true);
    this._error.set(null);

    let params = new HttpParams();
    
    // Add filters to query params
    if (filters.status && filters.status !== 'all') {
      params = params.set('completed', filters.status === 'completed');
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.priority) {
      params = params.set('priority', filters.priority);
    }

    return this.http.get<Todo[]>(`${this.apiUrl}/todos`, { 
      ...this.getHttpOptions(), 
      params 
    }).pipe(
      map(todos => todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }))),
      tap(todos => {
        this.todosCache$.next(todos);
        this.lastFetchTime = Date.now();
        this._isLoading.set(false);
      }),
      map(todos => this.filterTodos(todos, filters)),
      shareReplay(1),
      catchError(error => this.handleError(error))
    );
  }

  private filterTodos(todos: Todo[], filters: TodoFilters): Todo[] {
    let filtered = [...todos];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  private shouldUseCache(): boolean {
    const now = Date.now();
    return this.lastFetchTime > 0 && (now - this.lastFetchTime) < this.cacheTimeout;
  }

  private refreshCache(): void {
    this.todosCache$.next(null);
    this.lastFetchTime = 0;
  }

  // ============================================
  // POST: Create Todo with optimistic updates
  // ============================================
  createTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    const tempId = Date.now();
    const optimisticTodo: Todo = {
      ...todo,
      id: tempId,
      createdAt: new Date()
    };

    // Optimistic update
    if (this.todosCache$.value) {
      this.todosCache$.next([...this.todosCache$.value, optimisticTodo]);
    }

    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<Todo>(`${this.apiUrl}/todos`, {
      ...todo,
      createdAt: new Date().toISOString()
    }, this.getHttpOptions()).pipe(
      map(createdTodo => ({
        ...createdTodo,
        createdAt: new Date(createdTodo.createdAt)
      })),
      tap(createdTodo => {
        // Replace optimistic update with real data
        if (this.todosCache$.value) {
          const todos = this.todosCache$.value.map(t => 
            t.id === tempId ? createdTodo : t
          );
          this.todosCache$.next(todos);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        // Rollback optimistic update
        if (this.todosCache$.value) {
          const todos = this.todosCache$.value.filter(t => t.id !== tempId);
          this.todosCache$.next(todos);
        }
        return this.handleError(error);
      })
    );
  }

  // ============================================
  // PUT: Update Todo
  // ============================================
  updateTodo(id: number, updates: UpdateTodoRequest): Observable<Todo> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<Todo>(`${this.apiUrl}/todos/${id}`, updates, this.getHttpOptions()).pipe(
      map(updatedTodo => ({
        ...updatedTodo,
        createdAt: new Date(updatedTodo.createdAt)
      })),
      tap(updatedTodo => {
        // Update cache
        if (this.todosCache$.value) {
          const todos = this.todosCache$.value.map(t => 
            t.id === id ? updatedTodo : t
          );
          this.todosCache$.next(todos);
        }
        this._isLoading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ============================================
  // POST: Toggle Todo (custom endpoint)
  // ============================================
  toggleTodo(id: number): Observable<Todo> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<Todo>(`${this.apiUrl}/todos/${id}/toggle`, {}, this.getHttpOptions()).pipe(
      map(updatedTodo => ({
        ...updatedTodo,
        createdAt: new Date(updatedTodo.createdAt)
      })),
      tap(updatedTodo => {
        // Update cache
        if (this.todosCache$.value) {
          const todos = this.todosCache$.value.map(t => 
            t.id === id ? updatedTodo : t
          );
          this.todosCache$.next(todos);
        }
        this._isLoading.set(false);
      }),
      catchError(error => this.handleError(error))
    );
  }

  // ============================================
  // DELETE: Delete Todo
  // ============================================
  deleteTodo(id: number): Observable<void> {
    // Optimistic update
    let removedTodo: Todo | null = null;
    if (this.todosCache$.value) {
      removedTodo = this.todosCache$.value.find(t => t.id === id) || null;
      const todos = this.todosCache$.value.filter(t => t.id !== id);
      this.todosCache$.next(todos);
    }

    this._isLoading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.apiUrl}/todos/${id}`, this.getHttpOptions()).pipe(
      tap(() => this._isLoading.set(false)),
      catchError(error => {
        // Rollback optimistic update
        if (removedTodo && this.todosCache$.value) {
          const todos = [...this.todosCache$.value, removedTodo].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          this.todosCache$.next(todos);
        }
        return this.handleError(error);
      })
    );
  }

  // ============================================
  // Error Handling
  // ============================================
  private handleError(error: any): Observable<never> {
    this._isLoading.set(false);
    
    let errorMessage = 'An unknown error occurred';
    
    if (!navigator.onLine) {
      errorMessage = 'You are offline. Please check your internet connection.';
    } else if (error.status === 0) {
      errorMessage = 'Cannot connect to server. Please try again later.';
    } else {
      errorMessage = error.message || `HTTP Error ${error.status}`;
    }

    this._error.set(errorMessage);
    console.error('TodoService Error:', error);
    
    return throwError(() => new Error(errorMessage));
  }

  // ============================================
  // Utility Methods
  // ============================================
  clearError(): void {
    this._error.set(null);
  }

  forceRefresh(): Observable<Todo[]> {
    this.refreshCache();
    return this.getTodos();
  }

  clearCache(): void {
    this.todosCache$.next(null);
    this.lastFetchTime = 0;
  }
}
```

## 🔔 สร้าง Supporting Services

### 1. Notification Service

สร้าง `src/app/services/notification.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  notifications = this._notifications.asReadonly();

  show(notification: Omit<Notification, 'id'>): void {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    this._notifications.update(current => [...current, newNotification]);

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }
  }

  showSuccess(title: string, message?: string): void {
    this.show({ type: 'success', title, message });
  }

  showError(title: string, message?: string): void {
    this.show({ type: 'error', title, message, duration: 0 }); // Don't auto-remove errors
  }

  showWarning(title: string, message?: string): void {
    this.show({ type: 'warning', title, message });
  }

  showInfo(title: string, message?: string): void {
    this.show({ type: 'info', title, message });
  }

  remove(id: string): void {
    this._notifications.update(current => current.filter(n => n.id !== id));
  }

  clear(): void {
    this._notifications.set([]);
  }
}
```

### 2. Loading Service

สร้าง `src/app/services/loading.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _loadingCount = signal<number>(0);
  private readonly _isLoading = signal<boolean>(false);

  isLoading = this._isLoading.asReadonly();

  show(): void {
    this._loadingCount.update(count => count + 1);
    this._isLoading.set(true);
  }

  hide(): void {
    this._loadingCount.update(count => {
      const newCount = Math.max(0, count - 1);
      this._isLoading.set(newCount > 0);
      return newCount;
    });
  }

  forceHide(): void {
    this._loadingCount.set(0);
    this._isLoading.set(false);
  }
}
```

## 🔧 อัพเดท App Config

แก้ไข `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from './interceptors/error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { retryInterceptor } from './interceptors/retry.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        retryInterceptor,
        loadingInterceptor,
        errorInterceptor
      ])
    )
  ]
};
```

## ✅ ตรวจสอบผลลัพธ์

- [ ] JSON Server ทำงานได้
- [ ] HTTP Interceptors ใช้งานได้
- [ ] Error handling ทำงานได้
- [ ] Retry logic ทำงานได้
- [ ] Caching ทำงานได้
- [ ] Offline detection ทำงานได้
- [ ] Optimistic updates ทำงานได้

## 🔧 การทดสอบ

1. **API Connection**: `npm run dev`
2. **Error Handling**: ปิด JSON Server แล้วลองใช้งาน
3. **Offline Mode**: ปิด internet แล้วลองใช้งาน
4. **Retry Logic**: ดู network tab ใน DevTools
5. **Caching**: Refresh หน้าและสังเกตความเร็ว

## 🔗 ขั้นตอนถัดไป

✅ **สำเร็จแล้ว?** ไปต่อที่ [Step 7: Enhancements](./step-7-enhancement.md)

---

<div align="center">
  <a href="./step-5-styling.md">⬅️ Step 5: Styling</a> | 
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a> | 
  <a href="./step-7-enhancement.md">➡️ Step 7: Enhancements</a>
</div>
