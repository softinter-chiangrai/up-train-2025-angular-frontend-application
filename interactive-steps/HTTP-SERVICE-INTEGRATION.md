# HTTP Service Integration Guide

## 🎯 การเปลี่ยนแปลงที่สำคัญ

ในการปรับแก้ไฟล์ step ต่างๆ เพื่อใช้ HTTP service แทน local data:

---

## 📋 สิ่งที่เปลี่ยนแปลง

### 1. **Environment Configuration**
- `src/environments/environment.ts` กำหนด API URL เป็น `http://localhost:8000/api`
- ใช้สำหรับเชื่อมต่อกับ Backend API

### 2. **Todo Model Extensions**
- เพิ่ม API Request/Response types:
  - `CreateTodoRequest`
  - `UpdateTodoRequest` 
  - `TodoApiResponse`
  - `ApiResponse<T>`
  - `ApiError`
- เพิ่ม helper functions:
  - `mapApiResponseToTodo()`
  - `mapTodoToApiRequest()`

### 3. **TodoService HTTP Methods**
- `getTodos()` - GET /api/todos
- `getTodoById(id)` - GET /api/todos/{id}
- `createTodo(data)` - POST /api/todos
- `updateTodo(id, data)` - PUT /api/todos/{id}
- `deleteTodo(id)` - DELETE /api/todos/{id}

### 4. **Component Updates**

#### **Step 0.3 - Component State**
- เปลี่ยนจาก local data เป็น HTTP service calls
- เพิ่ม `OnInit`, `OnDestroy` lifecycle hooks
- เพิ่ม subscription management
- เพิ่ม loading และ error state handling

#### **Step 2.1 - Basic Form**
- Form emit `CreateTodoRequest` แทน string
- เชื่อมต่อกับ TodoService สำหรับ loading state
- Parent component รับ HTTP responses

#### **Step 4.1 - Todo Item Component**
- ใช้ HTTP service สำหรับ CRUD operations
- เพิ่ม error handling ในแต่ละ operation
- อัพเดท event emitters ให้ส่ง updated data

---

## 🔧 การติดตั้งและใช้งาน

### 1. **Backend API Requirements**
ต้องมี Backend API running ที่ `http://localhost:8000` ที่มี endpoints:

```
GET    /api/todos           - ดึงรายการ todos ทั้งหมด
GET    /api/todos/{id}      - ดึง todo ตาม id
POST   /api/todos           - สร้าง todo ใหม่
PUT    /api/todos/{id}      - อัพเดท todo
DELETE /api/todos/{id}      - ลบ todo
```

### 2. **API Response Format**
Backend ต้อง return ข้อมูลในรูปแบบ:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Learn Angular",
    "completed": false,
    "createdAt": "2025-01-25T10:00:00Z",
    "updatedAt": "2025-01-25T10:00:00Z"
  },
  "message": "Success"
}
```

### 3. **Error Handling**
Service จัดการ errors และแปลงเป็น user-friendly messages:
- 400: Bad Request
- 404: Not Found  
- 500: Server Error

---

## 🔍 การทดสอบ HTTP Service

### 1. **ตรวจสอบ Network Tab**
- เปิด Developer Tools > Network
- ดู HTTP requests ที่ส่งไปยัง API
- ตรวจสอบ request/response data

### 2. **Loading States**
- ปุ่ม Add Todo แสดง "Adding..." ขณะส่งข้อมูล
- Form disable ขณะ loading
- Todo items แสดง loading state ขณะ update/delete

### 3. **Error States**
- แสดง error message เมื่อ API ไม่พร้อมใช้งาน
- Retry mechanism สำหรับ failed requests
- User feedback สำหรับ network errors

---

## 💡 Best Practices

### 1. **Subscription Management**
```typescript
private subscriptions = new Subscription();

ngOnDestroy(): void {
  this.subscriptions.unsubscribe();
}
```

### 2. **Error Handling**
```typescript
this.service.createTodo(data).subscribe({
  next: (result) => { /* success */ },
  error: (error) => { /* handle error */ }
});
```

### 3. **Loading States**
```typescript
readonly isLoading = this.service.isLoading;

// In template
[disabled]="isLoading()"
```

### 4. **Optimistic Updates**
```typescript
// Update UI immediately, rollback on error
this.updateLocalState(newData);
this.service.update(id, data).subscribe({
  error: () => this.rollbackLocalState()
});
```

---

## 🚀 ผลลัพธ์ที่ได้

- ✅ เชื่อมต่อกับ real Backend API
- ✅ ข้อมูล persist หลัง refresh
- ✅ Multiple users สามารถใช้งานร่วมกันได้
- ✅ Error handling ที่ดี
- ✅ Loading states ที่ responsive
- ✅ Production-ready architecture

---

## 🔧 Troubleshooting

### ❌ CORS Error
**Solution**: Backend ต้อง enable CORS สำหรับ `http://localhost:4200`

### ❌ 404 Not Found  
**Solution**: ตรวจสอบ API URL และ endpoints

### ❌ Loading ไม่หยุด
**Solution**: ตรวจสอบ `finalize()` operator ใน HTTP calls

### ❌ Data ไม่อัพเดท
**Solution**: ตรวจสอบ signal updates และ subscription handling

---

**🎯 Result**: Todo App ที่เชื่อมต่อกับ HTTP API แทน local data!
