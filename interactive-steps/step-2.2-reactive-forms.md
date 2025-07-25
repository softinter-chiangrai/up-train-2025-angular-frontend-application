# Step 2.2: Reactive Forms

## 🎯 เป้าหมายของ Step นี้
เปลี่ยนจาก Template-driven Forms เป็น **Reactive Forms** พร้อม FormBuilder และ Validators

---

## 📚 สิ่งที่จะได้เรียนรู้
- Reactive Forms (FormGroup, FormControl)
- FormBuilder Service
- Built-in Validators
- Custom Validators
- Form State Management

---

## 📋 Prerequisites
- ✅ Step 2.1 เสร็จแล้ว (Basic Form Component)

---

## 📝 Task: เปลี่ยนเป็น Reactive Forms

### 1. แก้ไข TodoForm Component Class

แก้ไขไฟล์ `src/app/components/todo-form/todo-form.component.ts`:

```typescript
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // เพิ่ม ReactiveFormsModule
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<string>();
  
  // TODO: สร้าง FormGroup สำหรับ todo form
  todoForm: FormGroup;
  
  // TODO: สร้าง property สำหรับ loading state
  isSubmitting = false;

  // TODO: ใช้ FormBuilder ใน constructor
  constructor(private fb: FormBuilder) {
    // สร้าง form ด้วย FormBuilder
    this.todoForm = this.fb.group({
      title: ['', [
        // เขียน validators ตรงนี้:
        // - required
        // - maxLength(50)
        // - custom validator สำหรับ whitespace only
      ]]
    });
  }

  // TODO: สร้าง custom validator สำหรับ whitespace
  static noWhitespaceValidator(control: any) {
    // เขียนโค้ดตรงนี้
    // ตรวจสอบว่า value ไม่ใช่ whitespace เท่านั้น
    // return null ถ้า valid, return { whitespace: true } ถ้า invalid
  }

  // TODO: แก้ไข onSubmit method
  onSubmit(): void {
    // ตรวจสอบว่า form valid
    if (this.todoForm.valid) {
      this.isSubmitting = true;
      
      const title = this.todoForm.get('title')?.value;
      
      // Simulate loading delay
      setTimeout(() => {
        // เขียนโค้ดตรงนี้:
        // 1. emit todoAdded event
        // 2. reset form
        // 3. set isSubmitting = false
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      this.todoForm.markAllAsTouched();
    }
  }

  // TODO: สร้าง helper method สำหรับตรวจสอบ field validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    // เขียนโค้ดตรงนี้
    // return true ถ้า field invalid และ (dirty หรือ touched)
    return false;
  }

  // TODO: สร้าง helper method สำหรับดึง error message
  getFieldError(fieldName: string): string {
    const field = this.todoForm.get(fieldName);
    if (!field || !field.errors) return '';

    // เขียนโค้ดตรงนี้
    // ตรวจสอบ error types และ return message ที่เหมาะสม
    if (field.errors['required']) return 'Title is required';
    if (field.errors['maxlength']) return 'Title must be less than 50 characters';
    if (field.errors['whitespace']) return 'Title cannot be only whitespace';
    
    return '';
  }

  // TODO: สร้าง getter สำหรับ title field
  get titleField() {
    return this.todoForm.get('title');
  }

  // TODO: สร้าง method สำหรับนับตัวอักษร
  getCharacterCount(): number {
    // เขียนโค้ดตรงนี้
    return 0;
  }

  // TODO: สร้าง method สำหรับ progress bar
  getProgressPercentage(): number {
    // เขียนโค้ดตรงนี้
    // คำนวณ percentage จาก character count
    return 0;
  }
}
```

### 2. แก้ไข Template สำหรับ Reactive Forms

แก้ไขไฟล์ `src/app/components/todo-form/todo-form.component.html`:

```html
<div class="form-container">
  <!-- Form Header -->
  <div class="form-header">
    <h2>➕ Add New Todo</h2>
    <p class="form-description">Create a new task to add to your todo list</p>
  </div>

  <!-- Form -->
  <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="todo-form">
    
    <!-- Input Group -->
    <div class="input-group">
      <!-- Title Input -->
      <div class="input-wrapper">
        <!-- TODO: สร้าง input field สำหรับ reactive forms -->
        <!-- ใช้ formControlName="title" -->
        <!-- เพิ่ม class สำหรับ error state -->
        <input 
          type="text"
          formControlName="title"
          placeholder="Enter todo title..."
          class="todo-input"
          [class.error]="">
        
        <!-- Submit Button -->
        <!-- TODO: สร้าง submit button -->
        <!-- disabled เมื่อ form invalid หรือ isSubmitting -->
        <button 
          type="submit"
          class="submit-button"
          [disabled]=""
          [class.loading]="isSubmitting">
          
          <!-- Loading Spinner -->
          @if (isSubmitting) {
            <span class="spinner"></span>
            <span>Adding...</span>
          } @else {
            <span>Add Todo</span>
          }
        </button>
      </div>

      <!-- Error Messages -->
      <!-- TODO: แสดง error messages -->
      @if (isFieldInvalid('title')) {
        <div class="error-message">
          {{ getFieldError('title') }}
        </div>
      }
    </div>

    <!-- Progress Bar -->
    <!-- TODO: แสดง progress bar สำหรับ character count -->
    <div class="progress-section">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          [style.width.%]="getProgressPercentage()"
          [class.warning]="getCharacterCount() > 40"
          [class.danger]="getCharacterCount() > 45">
        </div>
      </div>
      <div class="char-info">
        <span class="char-count">{{ getCharacterCount() }}/50</span>
        <span class="char-remaining">{{ 50 - getCharacterCount() }} remaining</span>
      </div>
    </div>

    <!-- Form Status (Debug Info - ลบทิ้งได้ในภายหลัง) -->
    <details class="debug-info">
      <summary>Form Debug Info</summary>
      <pre>{{ todoForm.value | json }}</pre>
      <p>Valid: {{ todoForm.valid }}</p>
      <p>Touched: {{ titleField?.touched }}</p>
      <p>Dirty: {{ titleField?.dirty }}</p>
      <p>Errors: {{ titleField?.errors | json }}</p>
    </details>

  </form>
</div>
```

### 3. เพิ่ม Enhanced CSS Styles

แก้ไขไฟล์ `src/app/components/todo-form/todo-form.component.css`:

```css
.form-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
}

.form-header h2 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

.form-description {
  margin: 0 0 20px 0;
  color: #6b7280;
  font-size: 14px;
}

.todo-form {
  /* TODO: เพิ่ม CSS สำหรับ form */
}

.input-group {
  margin-bottom: 16px;
}

.input-wrapper {
  /* TODO: เพิ่ม CSS สำหรับ input wrapper */
  /* Display flex, gap, align-items stretch */
}

.todo-input {
  /* TODO: เพิ่ม CSS สำหรับ input */
  /* Flex 1, padding, border, border-radius, font-size */
  /* Transition effects, focus styles */
}

.todo-input:focus {
  /* TODO: เพิ่ม focus styles */
  /* Outline, border-color, box-shadow */
}

.todo-input.error {
  /* TODO: เพิ่ม error styles */
  /* Border-color, background-color */
}

.submit-button {
  /* TODO: เพิ่ม CSS สำหรับ button */
  /* Padding, background, color, border, border-radius */
  /* Display flex, align-items, justify-content, gap */
  /* Transition effects */
}

.submit-button:hover:not(:disabled) {
  /* TODO: เพิ่ม hover effect */
}

.submit-button:disabled {
  /* TODO: เพิ่ม disabled styles */
}

.submit-button.loading {
  /* TODO: เพิ่ม loading styles */
}

.spinner {
  /* TODO: เพิ่ม CSS สำหรับ loading spinner */
  /* Width, height, border, border-radius, animation */
}

@keyframes spin {
  /* TODO: เพิ่ม keyframes สำหรับ spinner */
}

.error-message {
  /* TODO: เพิ่ม CSS สำหรับ error message */
  /* Color, font-size, margin-top, padding */
}

.progress-section {
  /* TODO: เพิ่ม CSS สำหรับ progress section */
}

.progress-bar {
  /* TODO: เพิ่ม CSS สำหรับ progress bar */
  /* Background, height, border-radius, overflow hidden */
}

.progress-fill {
  /* TODO: เพิ่ม CSS สำหรับ progress fill */
  /* Height, background, border-radius, transition */
}

.progress-fill.warning {
  /* TODO: เพิ่ม warning color */
}

.progress-fill.danger {
  /* TODO: เพิ่ม danger color */
}

.char-info {
  /* TODO: เพิ่ม CSS สำหรับ character info */
  /* Display flex, justify-content, margin-top, font-size */
}

.char-count {
  /* TODO: เพิ่ม CSS สำหรับ character count */
}

.char-remaining {
  /* TODO: เพิ่ม CSS สำหรับ remaining count */
}

.debug-info {
  /* TODO: เพิ่ม CSS สำหรับ debug info */
  /* Margin-top, padding, background, border-radius, font-size */
}
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Form Validation

ตรวจสอบ validation scenarios:
- ✅ ลองส่ง form ว่าง -> แสดง "Title is required"
- ✅ ลองใส่แต่ space -> แสดง "Title cannot be only whitespace"  
- ✅ ลองใส่เกิน 50 ตัวอักษร -> แสดง "Title must be less than 50 characters"
- ✅ ใส่ข้อมูลถูกต้อง -> ส่งได้ปกติ

### Test 2: Visual Feedback

ตรวจสอบ UI feedback:
- ✅ Progress bar เปลี่ยนสีเมื่อใกล้เต็ม
- ✅ Character counter อัปเดตขณะพิมพ์
- ✅ Error message แสดงใต้ input
- ✅ Input มี error styling เมื่อ invalid

### Test 3: Loading State

ตรวจสอบ loading behavior:
- ✅ แสดง spinner ขณะส่ง form
- ✅ Button disabled ขณะ loading
- ✅ Text เปลี่ยนเป็น "Adding..."

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Working Reactive Form

```typescript
export class TodoFormComponent {
  todoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.maxLength(50),
        TodoFormComponent.noWhitespaceValidator
      ]]
    });
  }

  static noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    return !isWhitespace ? null : { whitespace: true };
  }

  // Other methods implemented...
}
```

### 2. Enhanced Validation

- ✅ Required validation
- ✅ Max length validation  
- ✅ Custom whitespace validation
- ✅ Real-time error messages

### 3. Better UX

- ✅ Progress bar with color coding
- ✅ Character counter
- ✅ Loading spinner
- ✅ Form state indicators

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ Reactive Forms
- FormBuilder และ FormGroup
- FormControl และ Validators
- Built-in Validators (required, maxLength)
- Custom Validators

### ✅ Form State Management
- Form validation states
- Field-level validation
- Touch and dirty states
- Error handling

### ✅ Advanced UI/UX
- Progress indicators
- Real-time feedback
- Loading states
- Error messaging

### ✅ Template Enhancements
- Reactive Forms directives
- Conditional classes
- Form state binding
- Advanced control flow

---

## 🔧 Troubleshooting

### ❌ Error: "ReactiveFormsModule not imported"
**Solution**: เพิ่ม ReactiveFormsModule ใน imports
```typescript
imports: [CommonModule, ReactiveFormsModule]
```

### ❌ Custom validator ไม่ทำงาน
**Solution**: ตรวจสอบ static method และ return value
```typescript
static noWhitespaceValidator(control: AbstractControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  return !isWhitespace ? null : { whitespace: true };
}
```

### ❌ Error messages ไม่แสดง
**Solution**: ตรวจสอบ isFieldInvalid method
```typescript
isFieldInvalid(fieldName: string): boolean {
  const field = this.todoForm.get(fieldName);
  return field ? field.invalid && (field.dirty || field.touched) : false;
}
```

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 2.3: Form Validation Enhancement](./step-2.3-form-validation.md)

---

## 💡 เคล็ดลับ

1. **Reactive Forms Benefits**: Type safety, easier testing, complex validation
2. **Custom Validators**: สร้าง reusable validation logic
3. **UX Design**: ให้ feedback ทันทีเมื่อผู้ใช้พิมพ์
4. **Performance**: Reactive forms มี performance ดีกว่า template-driven

---

**🎯 Goal Achieved**: เรียนรู้ Reactive Forms และ Advanced Validation!
