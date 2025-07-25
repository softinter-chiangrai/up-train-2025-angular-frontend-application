# Step 4: Forms

🎯 **เป้าหมาย**: สร้าง TodoForm component ด้วย Reactive Forms และ validation

## 📋 สิ่งที่จะทำใน Step นี้

- [ ] สร้าง TodoFormComponent 
- [ ] ใช้ Reactive Forms
- [ ] เพิ่ม form validation
- [ ] จัดการ form submission
- [ ] ส่งข้อมูลไปยัง parent component

## 🚀 สร้าง TodoFormComponent

### 1. สร้างโฟลเดอร์และไฟล์

```bash
mkdir src/app/components/todo-form
```

### 2. สร้าง TodoFormComponent

#### `src/app/components/todo-form/todo-form.component.ts`

```typescript
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<string>();

  todoForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      this.isSubmitting = true;

      const title = this.todoForm.get('title')?.value;

      // Simulate loading delay
      setTimeout(() => {
        this.todoAdded.emit(title);
        this.todoForm.reset();
        this.isSubmitting = false;
      }, 500);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
```

#### `src/app/components/todo-form/todo-form.component.html`

```html
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
      />
      
      <!-- Error Messages -->
      @if (isFieldInvalid('title')) {
        <div class="mt-1 text-sm text-red-600">
          @if (todoForm.get('title')?.errors?.['required']) {
            <p>Title is required</p>
          }
          @if (todoForm.get('title')?.errors?.['maxlength']) {
            <p>Title must be less than 50 characters</p>
          }
        </div>
      }
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      [disabled]="todoForm.invalid || isSubmitting"
      class="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      @if (isSubmitting) {
        <span class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding...
        </span>
      } @else {
        Add Todo
      }
    </button>
  </form>
</div>
```

#### `src/app/components/todo-form/todo-form.component.css`

```css
/* Form-specific styles */

/* Input focus states */
.form-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Button hover effects */
.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* Loading animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-text {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Error shake animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-shake {
  animation: shake 0.5s ease-in-out;
}

/* Character counter color transitions */
.char-counter {
  transition: color 0.3s ease;
}

/* Disabled state */
.disabled-input {
  background-color: #f9fafb;
  cursor: not-allowed;
}
```

## 🔗 อัพเดท TodoAppComponent

แก้ไข `src/app/components/todo-app/todo-app.component.ts` เพื่อใช้ TodoFormComponent:

```typescript
// เพิ่ม import
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  // ...
  imports: [CommonModule, DatePipe, TodoFormComponent], // เพิ่ม TodoFormComponent
  // ...
})
export class TodoAppComponent {
  // ... existing code ...

  // Method สำหรับรับ event จาก TodoFormComponent
  onTodoAdded(title: string): void {
    this.addTodo(title);
  }
}
```

แก้ไข `src/app/components/todo-app/todo-app.component.html`:

```html
<!-- แทนที่ Add Todo Section เดิมด้วย -->
<app-todo-form 
  (todoAdded)="onTodoAdded($event)"
  class="mb-6 block">
</app-todo-form>

<!-- ส่วนอื่นๆ คงเดิม -->
```

## 🧠 เข้าใจ Reactive Forms

### 1. FormBuilder และ FormGroup

```typescript
// สร้าง form
todoForm: FormGroup = this.formBuilder.group({
  title: ['', [Validators.required]] // [default_value, validators]
});

// เข้าถึง form control
const titleControl = this.todoForm.get('title');
const titleValue = titleControl?.value;
```

### 2. Validators

```typescript
// Built-in validators
Validators.required         // ต้องมีค่า
Validators.minLength(5)     // ความยาวขั้นต่ำ
Validators.maxLength(100)   // ความยาวสูงสุด
Validators.pattern(/regex/) // Pattern matching

// Custom validator
private noWhitespaceValidator(control: any) {
  const value = control.value;
  if (value && value.trim().length === 0) {
    return { whitespace: true }; // Return error object
  }
  return null; // Valid
}
```

### 3. Form States

```typescript
// Form status
this.todoForm.valid    // true/false
this.todoForm.invalid  // true/false
this.todoForm.pristine // ยังไม่ถูกแก้ไข
this.todoForm.dirty    // ถูกแก้ไขแล้ว
this.todoForm.touched  // ถูก focus แล้ว

// Field status
const field = this.todoForm.get('title');
field?.valid
field?.invalid
field?.errors
field?.value
```

## 💡 Form Best Practices

### 1. User Experience

```typescript
// ✅ ดี - แสดง error หลังจาก user interaction
isFieldInvalid(fieldName: string): boolean {
  const field = this.todoForm.get(fieldName);
  return !!(field && field.invalid && (field.dirty || field.touched));
}

// ❌ ไม่ดี - แสดง error ทันที
isFieldInvalid(fieldName: string): boolean {
  const field = this.todoForm.get(fieldName);
  return !!(field && field.invalid);
}
```

### 2. Error Messages

```typescript
// ✅ ดี - ข้อความที่เข้าใจง่าย
getFieldError(fieldName: string): string | null {
  const errors = this.todoForm.get(fieldName)?.errors;
  
  if (errors?.['required']) {
    return 'Todo title is required';
  }
  
  if (errors?.['maxlength']) {
    return `Title cannot exceed ${errors['maxlength'].requiredLength} characters`;
  }
  
  return null;
}
```

### 3. Form Submission

```typescript
// ✅ ดี - ตรวจสอบ validation ก่อน submit
onSubmit(): void {
  if (this.todoForm.invalid) {
    this.markAllFieldsAsTouched();
    return;
  }
  
  // Process valid form
}
```

## 🧪 ทดสอบ Form

### 1. Validation Tests

```typescript
// src/app/components/todo-form/todo-form.component.spec.ts
describe('TodoFormComponent', () => {
  it('should show error for empty title', () => {
    const titleControl = component.todoForm.get('title');
    titleControl?.setValue('');
    titleControl?.markAsTouched();
    
    expect(component.isFieldInvalid('title')).toBe(true);
    expect(component.getFieldError('title')).toBe('Todo title is required');
  });

  it('should emit todoAdded on valid submission', () => {
    spyOn(component.todoAdded, 'emit');
    
    component.todoForm.patchValue({ title: 'Test Todo' });
    component.onSubmit();
    
    expect(component.todoAdded.emit).toHaveBeenCalledWith('Test Todo');
  });
});
```

## ✅ ตรวจสอบผลลัพธ์

- [ ] TodoFormComponent สร้างเสร็จ
- [ ] Reactive Forms ทำงานได้
- [ ] Validation ทำงานได้
- [ ] Error messages แสดงได้
- [ ] Form submission ทำงานได้
- [ ] Integration กับ TodoAppComponent สำเร็จ

## 🔧 การทดสอบ

1. **เพิ่ม Todo**: พิมพ์ข้อความและกด Add
2. **Validation**: ลองส่ง form เปล่า
3. **Character Limit**: พิมพ์เกิน 100 ตัวอักษร
4. **Whitespace**: ลองใส่เฉพาะช่องว่าง
5. **Reset**: ทดสอบปุ่ม Reset

## 🔗 ขั้นตอนถัดไป

✅ **สำเร็จแล้ว?** ไปต่อที่ [Step 5: Styling](./step-5-styling.md)

---

<div align="center">
  <a href="./step-3-components.md">⬅️ Step 3: Components</a> | 
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a> | 
  <a href="./step-5-styling.md">➡️ Step 5: Styling</a>
</div>
