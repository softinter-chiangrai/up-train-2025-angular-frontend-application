# Step 2: Todo Service

🎯 **เป้าหมาย**: สร้าง service สำหรับจัดการข้อมูล Todo และเชื่อมต่อ API

## 📋 สิ่งที่จะทำใน Step นี้

- [ ] สร้าง TodoService
- [ ] ตั้งค่า HttpClient
- [ ] สร้าง methods สำหรับ CRUD operations
- [ ] จัดการ error handling
- [ ] ใช้ RxJS Observables

## 🛠️ ตั้งค่า HttpClient

### 1. เพิ่ม HttpClient ใน app.config.ts

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()) // 👈 เพิ่มบรรทัดนี้
  ]
};
```

## 🔧 สร้าง TodoService

### 1. สร้างโฟลเดอร์ services

```bash
mkdir src/app/services
```

### 2. แก้ไขไฟล์ `src/app/services/todo.service.ts`

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, tap, map } from 'rxjs';
import { Todo, UpdateTodoRequest, ApiResponse } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:8000'; // Server URL
  
  // Signals สำหรับ loading และ error states
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {}

  // ============================================
  // HTTP Headers Configuration
  // ============================================
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      observe: 'response' as 'response'
    };
  }

  // ============================================
  // GET: ดึง Todos ทั้งหมด
  // ============================================
  getTodos(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.get<any>(`${this.apiUrl}/todos`, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    );
  }

  // ============================================
  // GET: ดึง Todo ตาม ID
  // ============================================
  getTodoById(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.get<any>(`${this.apiUrl}/todos/${id}`, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    )
  }

  // ============================================
  // POST: สร้าง Todo ใหม่
  // ============================================
  createTodo(todo: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.post<any>(`${this.apiUrl}/todos`, todo, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    )
  }

  // ============================================
  // PUT: อัพเดท Todo
  // ============================================
  updateTodo(id: number, updateData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.put<any>(`${this.apiUrl}/todos/${id}`, updateData, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    );
  }

  // ============================================
  // PATCH: Toggle Todo status (shortcut method)
  // ============================================
  toggleTodo(id: number, completed: boolean): Observable<any> {
    let data = {
      'completed': completed
    }
    return this.http.put<any>(`${this.apiUrl}/todos/${id}`, data).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    )
  }

  // ============================================
  // DELETE: ลบ Todo
  // ============================================
  deleteTodo(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.delete<any>(`${this.apiUrl}/todos/${id}`, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    );
  }

  // ============================================
  // Error Handling
  // ============================================
  private handleError(error: any): Observable<never> {
    this._isLoading.set(false);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // สร้างข้อความ error ที่เข้าใจง่าย
      switch (error.status) {
        case 0:
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
          break;
        case 404:
          errorMessage = 'Todo not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
      }
    }

    this._error.set(errorMessage);
    console.error('TodoService Error:', error);
    
    return throwError(() => new Error(errorMessage));
  }

  // ============================================
  // Utility Methods
  // ============================================
  
  // รีเซ็ต error state
  clearError(): void {
    this._error.set(null);
  }

  // ตรวจสอบว่า service กำลัง loading หรือไม่
  get isServiceBusy(): boolean {
    return this._isLoading();
  }
}
```


### 4. รัน Server

```bash
# Terminal: รัน Angular app
npm run start
```

## 📖 เข้าใจ RxJS Operators

### Observable Operators ที่ใช้

```typescript
// map: แปลงข้อมูล
.pipe(
  map(response => response.body)
)

// tap: ทำงานข้างเคียง (side effects)
.pipe(
  tap(() => console.log('Request completed'))
)

// catchError: จัดการ errors
.pipe(
  catchError(error => throwError(() => error))
)

// สามารถใช้ร่วมกันได้
.pipe(
  map(response => response.body),
  tap(data => console.log(data)),
  catchError(error => this.handleError(error))
)
```

## 💡 Best Practices

### 1. Error Handling

```typescript
// ✅ ดี - มี error handling ที่ครอบคลุม
private handleError(error: any): Observable<never> {
  // Log error
  console.error('Service Error:', error);
  
  // แปลงเป็นข้อความที่ user เข้าใจ
  const userMessage = this.getUserFriendlyMessage(error);
  
  // Update error state
  this._error.set(userMessage);
  
  return throwError(() => new Error(userMessage));
}
```

### 2. Loading States

```typescript
// ✅ ดี - จัดการ loading state
getTodos(): Observable<Todo[]> {
  this._isLoading.set(true);  // เริ่ม loading

  return this.http.get<Todo[]>(...).pipe(
    tap(() => this._isLoading.set(false)),  // หยุด loading เมื่อสำเร็จ
    catchError(error => {
      this._isLoading.set(false);  // หยุด loading เมื่อ error
      return this.handleError(error);
  return this.http.get<Todo[]>(...).pipe(
    tap(() => this._isLoading.set(false)),  // หยุด loading เมื่อสำเร็จ
    catchError(error => {
      this._isLoading.set(false);  // หยุด loading เมื่อ error
      return this.handleError(error);
    })
  );
}
```

### 3. Type Safety

```typescript
// ✅ ดี - ใช้ types ที่ถูกต้อง
createTodo(todo: Omit<Todo, 'id'>): Observable<Todo>

// ❌ ไม่ดี - ใช้ any
createTodo(todo: any): Observable<any>
```

## ✅ ตรวจสอบผลลัพธ์

- [ ] TodoService สร้างเสร็จ
- [ ] HttpClient config เรียบร้อย
- [ ] JSON Server ทำงานได้
- [ ] มี methods ครบ: GET, POST, PUT, DELETE
- [ ] Error handling ทำงานได้
- [ ] Loading states ทำงานได้

## 🔗 ขั้นตอนถัดไป

✅ **สำเร็จแล้ว?** ไปต่อที่ [Step 3: Components](./step-3-components.md)

---

<div align="center">
  <a href="./step-1-models.md">⬅️ Step 1: Models</a> | 
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a> | 
  <a href="./step-3-components.md">➡️ Step 3: Components</a>
</div>
