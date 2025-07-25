# Step 2.1: สร้าง Basic Form Component

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การสร้าง **Form Component** แยกต่างหากและการใช้ **Event Emitters**

---

## 📚 สิ่งที่จะได้เรียนรู้
- Component Separation
- Event Emitters (@Output)
- Template Reference Variables
- Basic Form Handling

---

## 📋 Prerequisites
- ✅ Step 0.1-0.3 เสร็จแล้ว (Model, Component, Signals)
- ✅ Step 3.1 เสร็จแล้ว (HTTP Service Setup)
- ✅ มี Backend API running ที่ http://localhost:8000

---

## 📝 Task: สร้าง TodoForm Component

### 1. Generate Form Component

```bash
# สร้าง todo-form component
ng generate component components/todo-form --standalone --skip-tests

# หรือ
ng g c components/todo-form --standalone --skip-tests
```

### 2. สร้าง Form Component Class

แก้ไขไฟล์ `src/app/components/todo-form/todo-form.component.ts`:

```typescript
import { Component, inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { CreateTodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent {
  // TODO: Inject TodoService
  private readonly todoService = inject(TodoService);

  // TODO: สร้าง @Output EventEmitter สำหรับส่งข้อมูล todo ใหม่
  @Output() todoAdded = new EventEmitter<CreateTodoRequest>();

  // TODO: เข้าถึง loading state จาก service
  readonly isLoading = this.todoService.isLoading;

  // TODO: สร้าง method สำหรับจัดการ form submission
  onSubmit(todoTitle: string): void {
    // ตรวจสอบว่า title ไม่ว่าง
    if (!todoTitle.trim() || this.isLoading()) {
      return;
    }

    // สร้าง CreateTodoRequest object
    const todoData: CreateTodoRequest = {
      title: todoTitle.trim(),
      completed: false
    };

    // Emit event ให้ parent component
    this.todoAdded.emit(todoData);
  }

  // TODO: สร้าง method สำหรับ validate input
  validateInput(value: string): boolean {
    return value.trim().length > 0 && value.length <= 50;
  }
}
```

### 3. สร้าง Form Template

แก้ไขไฟล์ `src/app/components/todo-form/todo-form.component.html`:

```html
<div class="form-container">
  <!-- Form Header -->
  <div class="form-header">
    <h2>➕ Add New Todo</h2>
  </div>

  <!-- Form -->
  <form (ngSubmit)="onSubmit(todoInput.value); todoInput.value = ''" class="todo-form">
    <!-- Input Group -->
    <div class="input-group">
      <input 
        #todoInput
        type="text"
        class="todo-input"
        placeholder="Enter todo title..."
        required
        maxlength="50">
      
      <!-- Submit Button -->
      <button 
        type="submit"
        class="submit-button"
        [disabled]="isLoading() || !validateInput(todoInput.value)">
        
        <!-- แสดงข้อความตามสถานะ loading -->
        <span>{{ isLoading() ? 'Adding...' : 'Add Todo' }}</span>
      </button>
    </div>

    <!-- Character Counter -->
    <!-- TODO: แสดงจำนวนตัวอักษรที่เหลือ -->
    <div class="char-counter">
      <small>{{ 50 - todoInput.value.length }} characters remaining</small>
    </div>
  </form>
</div>
```

### 4. เพิ่ม Form Styles

แก้ไขไฟล์ `src/app/components/todo-form/todo-form.component.css`:

```css
.form-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-header h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.todo-form {
  /* TODO: เพิ่ม CSS สำหรับ form */
}

.input-group {
  /* TODO: เพิ่ม CSS สำหรับ input group */
  /* Display flex, gap, align-items stretch */
}

.todo-input {
  /* TODO: เพิ่ม CSS สำหรับ input */
  /* Flex 1, padding, border, border-radius */
  /* Focus styles: outline, border-color */
}

.submit-button {
  /* TODO: เพิ่ม CSS สำหรับ button */
  /* Padding, background, color, border, border-radius */
  /* Hover and disabled states */
}

.submit-button:hover:not(:disabled) {
  /* TODO: เพิ่ม hover effect */
}

.submit-button:disabled {
  /* TODO: เพิ่ม disabled styles */
  /* Background, cursor, opacity */
}

.char-counter {
  /* TODO: เพิ่ม CSS สำหรับ character counter */
  /* Text align, margin-top, color */
}

.char-counter small {
  color: #666;
  font-size: 12px;
}
```

### 5. เชื่อมต่อกับ Parent Component

แก้ไข `src/app/components/todo-app/todo-app.component.ts`:

```typescript
// เพิ่ม import
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, TodoFormComponent], // เพิ่ม TodoFormComponent
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent {
  // existing code...

  // TODO: แก้ไข method ให้รับ CreateTodoRequest จาก event
  onTodoAdded(todoData: CreateTodoRequest): void {
    // เรียกใช้ method ที่มีอยู่แล้วใน parent component
    this.addTodo(todoData.title);
  }
}
```

แก้ไข `src/app/components/todo-app/todo-app.component.html`:

```html
<div class="todo-container">
  <!-- Header -->
  <div class="header">
    <h1>📝 Todo App</h1>
  </div>

  <!-- Add Todo Form Component -->
  <!-- ใช้ HTTP service ผ่าน parent component -->
  <app-todo-form (todoAdded)="onTodoAdded($event)"></app-todo-form>

  <!-- Statistics -->
  <div class="stats">
    <div class="stat-item">
      <span class="stat-number">{{ totalTodos() }}</span>
      <span class="stat-label">Total</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">{{ completedTodos() }}</span>
      <span class="stat-label">Completed</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">{{ pendingTodos() }}</span>
      <span class="stat-label">Pending</span>
    </div>
  </div>

  <!-- Todo List -->
  <div class="todo-list">
    @for (todo of todos(); track todo.id) {
      <div class="todo-item" [class.completed]="todo.completed">
        <input 
          type="checkbox" 
          [checked]="todo.completed"
          (change)="toggleTodo(todo.id)">
        <span class="todo-title">{{ todo.title }}</span>
        <span class="todo-date">{{ todo.createdAt | date:'short' }}</span>
      </div>
    }
  </div>
</div>
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Component Communication

ตรวจสอบว่า:
- ✅ กรอก form และกดปุ่ม Add Todo
- ✅ Todo ใหม่ปรากฏในรายการ
- ✅ Form reset หลังเพิ่ม todo
- ✅ สถิติอัปเดตอัตโนมัติ

### Test 2: Form Validation

ตรวจสอบว่า:
- ✅ ไม่สามารถส่ง form ว่างได้
- ✅ Character counter ทำงาน
- ✅ Button disabled เมื่อ input ว่าง

### Test 3: Loading State

ตรวจสอบว่า:
- ✅ แสดง "Adding..." ขณะส่ง form
- ✅ Button disabled ขณะ loading
- ✅ กลับเป็นปกติหลัง submit

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Working Form Component

```typescript
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<string>();
  isSubmitting = false;

  onSubmit(todoTitle: string): void {
    if (!todoTitle.trim()) return;
    
    this.isSubmitting = true;
    
    setTimeout(() => {
      this.todoAdded.emit(todoTitle.trim());
      this.isSubmitting = false;
    }, 500);
  }

  validateInput(value: string): boolean {
    return value.trim().length > 0 && value.length <= 50;
  }
}
```

### 2. Working Template

- ✅ Form ที่มี validation
- ✅ Loading state ที่ทำงาน
- ✅ Character counter
- ✅ Responsive design

### 3. Parent-Child Communication

- ✅ Event emitter ทำงาน
- ✅ Parent component รับ event
- ✅ State update ใน parent

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ Component Architecture
- Separation of Concerns
- Reusable Components
- Single Responsibility

### ✅ Component Communication
- @Output() และ EventEmitter
- Event Binding `(event)="handler($event)"`
- Parent-Child data flow

### ✅ Template Features
- Template Reference Variables `#variable`
- Form submission handling
- Conditional rendering

### ✅ User Experience
- Loading states
- Form validation
- Visual feedback

---

## 🔧 Troubleshooting

### ❌ Event ไม่ถูกส่ง
**Solution**: ตรวจสอบ EventEmitter และ event binding
```typescript
// Component
@Output() todoAdded = new EventEmitter<string>();

// Template
<app-todo-form (todoAdded)="onTodoAdded($event)"></app-todo-form>
```

### ❌ Form ไม่ reset
**Solution**: ใช้ template reference variable
```html
<form (ngSubmit)="onSubmit(input.value); input.value = ''">
  <input #input type="text">
</form>
```

### ❌ Button ไม่ disable
**Solution**: ตรวจสอบ condition ใน [disabled]
```html
<button [disabled]="isSubmitting || !todoInput.value.trim()">
```

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 2.2: Reactive Forms](./step-2.2-reactive-forms.md)

---

## 💡 เคล็ดลับ

1. **Component Reusability**: แยก form เป็น component ทำให้ใช้ซ้ำได้
2. **Event Driven**: ใช้ events เพื่อ loose coupling
3. **User Feedback**: แสดง loading state เพื่อ UX ที่ดี
4. **Validation**: validate ทั้ง client และ UI level

---

**🎯 Goal Achieved**: สร้าง Form Component และ Event Communication!
