# Step 1: Models & Interfaces

🎯 **เป้าหมาย**: สร้าง TypeScript interfaces และ models สำหรับ Todo App

## 📋 สิ่งที่จะทำใน Step นี้

- [ ] สร้าง Todo interface
- [ ] สร้าง interface สำหรับ forms
- [ ] สร้าง interface สำหรับ API requests
- [ ] เข้าใจ TypeScript types

## 🏗️ โครงสร้าง Models

### 1. สร้างโฟลเดอร์ models

```bash
# สร้างโฟลเดอร์ models
mkdir src/app/models
```

### 2. สร้างไฟล์ `src/app/models/todo.model.ts`

```typescript
// Main Todo interface
export interface Todo {
  id?: number;                // Optional เพราะ API จะสร้างให้
  title: string;              // ข้อความของ Todo
  completed: boolean;         // สถานะเสร็จแล้วหรือยัง
  createdAt: Date;           // วันที่สร้าง
  createdBy: string;          // ผู้สร้าง Todo
}

// Interface สำหรับ form data
export interface TodoFormData {
  title: string;
}

```

## 🧩 เข้าใจ TypeScript Features

### Optional Properties

```typescript
interface Todo {
  id?: number;  // Optional - ไม่บังคับต้องมี
  title: string; // Required - บังคับต้องมี
}

// ใช้งานได้ทั้งสองแบบ
const todo1: Todo = { title: "Learn Angular" };
const todo2: Todo = { id: 1, title: "Learn Angular" };
```

### Union Types

```typescript
type TodoFilter = 'all' | 'pending' | 'completed';

// ใช้ได้เฉพาะค่าที่กำหนด
const filter: TodoFilter = 'all';      // ✅ ถูกต้อง
const filter2: TodoFilter = 'active';  // ❌ ผิด - ไม่มีใน union
```

### Generic Types

```typescript
interface ApiResponse<T> {
  data: T;  // T สามารถเป็น type ใดก็ได้
}

// ใช้งาน
const todoResponse: ApiResponse<Todo[]> = {
  success: true,
  data: [{ title: "Test", completed: false, createdAt: new Date() }]
};
```

## 💡 Best Practices

### 1. การตั้งชื่อ Interface

```typescript
// ✅ ดี - ใช้ PascalCase
interface Todo { }
interface TodoFormData { }

// ❌ ไม่ดี
interface todo { }
interface todoFormData { }
```

### 2. การจัดกลุ่ม Interfaces

```typescript
// เก็บไว้ในไฟล์เดียวกันถ้าเกี่ยวข้องกัน
export interface Todo { }
export interface TodoFormData { }
export interface UpdateTodoRequest { }
```

### 3. การใช้ Optional Properties

```typescript
// ใช้ optional สำหรับ field ที่ไม่บังคับ
interface CreateTodoRequest {
  title: string;        // บังคับ
  completed?: boolean;  // ไม่บังคับ (default = false)
}
```


## 📖 เรียนรู้เพิ่มเติม

### TypeScript Features ที่ใช้

1. **Interfaces**: กำหนดโครงสร้างของ object
2. **Optional Properties**: properties ที่ไม่บังคับ
3. **Union Types**: type ที่มีได้หลายค่า
4. **Generic Types**: type ที่ยืดหยุ่น

### ข้อดีของการใช้ TypeScript

- ✅ **Type Safety**: ป้องกัน runtime errors
- ✅ **IntelliSense**: auto-complete ใน IDE
- ✅ **Refactoring**: เปลี่ยนชื่อได้อย่างปลอดภัย
- ✅ **Documentation**: interface เป็น documentation

## ✅ ตรวจสอบผลลัพธ์

- [ ] ไฟล์ `todo.model.ts` สร้างเสร็จ
- [ ] มี interfaces ครบ: Todo, TodoFormData, UpdateTodoRequest
- [ ] ไม่มี TypeScript errors
- [ ] เข้าใจ concept ของ interfaces

## 💻 Code Example

ลองใช้ interfaces ใน component:

```typescript
import { Component } from '@angular/core';
import { Todo, TodoStats } from './models/todo.model';

@Component({
  selector: 'app-root',
  template: `<h1>{{ stats.total }} todos</h1>`
})
export class AppComponent {
  todos: Todo[] = [];
  
  stats: TodoStats = {
    total: 0,
    completed: 0,
    pending: 0
  };
}
```

## 🔗 ขั้นตอนถัดไป

✅ **สำเร็จแล้ว?** ไปต่อที่ [Step 2: Todo Service](./step-2-services.md)

---

<div align="center">
  <a href="./step-0-setup.md">⬅️ Step 0: Setup</a> | 
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a> | 
  <a href="./step-2-services.md">➡️ Step 2: Services</a>
</div>
