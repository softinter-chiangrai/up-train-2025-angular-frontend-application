# Step 0.1: สร้าง Todo Model Interface

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การสร้าง **TypeScript Interface** สำหรับกำหนดโครงสร้างข้อมูล Todo

---

## 📚 สิ่งที่จะได้เรียนรู้
- TypeScript Interface
- Type Safety ใน Angular
- Data Structure Design

---

## 📝 Task: สร้าง Todo Model

### 1. สร้างไฟล์ Model
สร้างไฟล์ `src/app/models/todo.model.ts`

### 2. เขียน Interface

```typescript
// src/app/models/todo.model.ts

// TODO: สร้าง interface Todo ที่มี properties ดังนี้
// - id: number
// - title: string  
// - completed: boolean
// - createdAt: Date

export interface Todo {
  // เขียนโค้ดตรงนี้
}

// TODO: สร้าง interface TodoFormData สำหรับ form
// - title: string

export interface TodoFormData {
  // เขียนโค้ดตรงนี้
}
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Type Checking
สร้างไฟล์ `test-todo-model.ts` เพื่อทดสอบ:

```typescript
// test-todo-model.ts (ไฟล์ทดสอบ - ลบทิ้งได้ภายหลัง)
import { Todo, TodoFormData } from './src/app/models/todo.model';

// Test 1: สร้าง Todo object
const testTodo: Todo = {
  id: 1,
  title: "Learn Angular",
  completed: false,
  createdAt: new Date()
};

// Test 2: สร้าง TodoFormData object  
const testFormData: TodoFormData = {
  title: "New Todo"
};

console.log('✅ Todo Model Test Passed!');
```

### Test 2: Compilation
รันคำสั่งนี้เพื่อตรวจสอบ TypeScript:

```bash
# ตรวจสอบ TypeScript compilation
npx tsc --noEmit --skipLibCheck src/app/models/todo.model.ts
```

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. ไฟล์ที่สร้าง
- ✅ `src/app/models/todo.model.ts`

### 2. Interface ที่ถูกต้อง
```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoFormData {
  title: string;
}
```

### 3. No TypeScript Errors
- ไม่มี compilation errors
- IntelliSense ใน VS Code ทำงานได้

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ TypeScript Interfaces
- การกำหนด Type Structure
- Type Safety Benefits
- Auto-completion ใน IDE

### ✅ Data Modeling
- การออกแบบ Data Structure
- Separation of Concerns
- Reusable Types

### ✅ File Organization
- Models folder structure
- Export/Import patterns
- Code organization

---

## 🔧 Troubleshooting

### ❌ พบ Error: "Cannot find module"
**Solution**: ตรวจสอบ path ของไฟล์ให้ถูกต้อง

### ❌ พบ Error: "Property 'xxx' does not exist"
**Solution**: ตรวจสอบ property names ให้ตรงกับ interface

### ❌ VS Code ไม่แสดง IntelliSense
**Solution**: Restart TypeScript Language Service
- Ctrl+Shift+P > "TypeScript: Restart TS Server"

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 0.2: สร้าง Basic Component](./step-0.2-basic-component.md)

---

## 💡 เคล็ดลับ

1. **Type Safety**: Interface ช่วยป้องกัน runtime errors
2. **IntelliSense**: ได้ auto-completion ขณะเขียนโค้ด
3. **Documentation**: Interface เป็นเหมือน documentation ของ data structure
4. **Refactoring**: เปลี่ยน interface แล้ว TypeScript จะช่วยหา breaking changes

---

**🎯 Goal Achieved**: สร้าง Type-safe Data Models สำหรับ Todo App!
