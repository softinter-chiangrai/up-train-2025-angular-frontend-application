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
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class TodoFormComponent {
  
  // ============================================
  // Dependency Injection
  // ============================================
  private readonly formBuilder = inject(FormBuilder);

  // ============================================
  // Outputs (Events)
  // ============================================
  @Output() todoAdded = new EventEmitter<string>();

  // ============================================
  // Signals
  // ============================================
  private _isSubmitting = signal<boolean>(false);
  private _submitAttempted = signal<boolean>(false);

  // Public readonly signals
  isSubmitting = this._isSubmitting.asReadonly();
  submitAttempted = this._submitAttempted.asReadonly();

  // ============================================
  // Form Configuration
  // ============================================
  todoForm: FormGroup = this.formBuilder.group({
    title: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100),
      this.noWhitespaceValidator
    ]]
  });

  // ============================================
  // Custom Validators
  // ============================================
  
  // Validator สำหรับตรวจสอบว่าไม่ใช่ whitespace อย่างเดียว
  private noWhitespaceValidator(control: any) {
    const value = control.value;
    if (value && typeof value === 'string' && value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  // ============================================
  // Form Submission
  // ============================================
  onSubmit(): void {
    this._submitAttempted.set(true);

    if (this.todoForm.invalid) {
      console.warn('⚠️ Form is invalid');
      this.markAllFieldsAsTouched();
      return;
    }

    const title = this.todoForm.get('title')?.value?.trim();
    
    if (!title) {
      console.warn('⚠️ Title is empty after trim');
      return;
    }

    console.log('📝 Submitting todo:', title);
    this._isSubmitting.set(true);

    // Simulate submission delay
    setTimeout(() => {
      try {
        // Emit the todo to parent component
        this.todoAdded.emit(title);
        
        // Reset form after successful submission
        this.resetForm();
        
        console.log('✅ Todo submitted successfully');
      } catch (error) {
        console.error('❌ Error submitting todo:', error);
      } finally {
        this._isSubmitting.set(false);
      }
    }, 300); // Small delay for UX
  }

  // ============================================
  // Form Management
  // ============================================
  
  resetForm(): void {
    this.todoForm.reset();
    this._submitAttempted.set(false);
    console.log('🔄 Form reset');
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.todoForm.controls).forEach(key => {
      this.todoForm.get(key)?.markAsTouched();
    });
  }

  // ============================================
  // Validation Helpers
  // ============================================
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitAttempted()));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.todoForm.get(fieldName);
    
    if (!field || !this.isFieldInvalid(fieldName)) {
      return null;
    }

    const errors = field.errors;
    if (!errors) return null;

    // Return user-friendly error messages
    if (errors['required']) {
      return 'Todo title is required';
    }
    
    if (errors['minlength']) {
      return 'Todo title must be at least 1 character';
    }
    
    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `Todo title cannot exceed ${maxLength} characters`;
    }
    
    if (errors['whitespace']) {
      return 'Todo title cannot be only whitespace';
    }

    return 'Invalid input';
  }

  // ============================================
  // UI State Helpers
  // ============================================
  
  getFieldClass(fieldName: string): string {
    const baseClass = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors';
    
    if (this.isFieldInvalid(fieldName)) {
      return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
    }
    
    return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  }

  getSubmitButtonClass(): string {
    const baseClass = 'px-6 py-3 rounded-lg font-medium transition-all duration-200';
    
    if (this.isSubmitting()) {
      return `${baseClass} bg-gray-400 text-white cursor-not-allowed`;
    }
    
    if (this.todoForm.valid) {
      return `${baseClass} bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg`;
    }
    
    return `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
  }

  // ============================================
  // Character Count Helper
  // ============================================
  
  getCurrentLength(): number {
    return this.todoForm.get('title')?.value?.length || 0;
  }

  getMaxLength(): number {
    return 100; // จาก Validators.maxLength(100)
  }

  getRemainingCharacters(): number {
    return this.getMaxLength() - this.getCurrentLength();
  }

  isNearMaxLength(): boolean {
    return this.getRemainingCharacters() <= 10;
  }
}
```

#### `src/app/components/todo-form/todo-form.component.html`

```html
<div class="bg-white rounded-lg shadow-md p-6">
  
  <!-- Form Header -->
  <div class="mb-4">
    <h2 class="text-lg font-semibold text-gray-800 mb-1">Add New Todo</h2>
    <p class="text-sm text-gray-600">What would you like to accomplish today?</p>
  </div>

  <!-- Form -->
  <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" novalidate>
    
    <!-- Title Input -->
    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
        Todo Title
      </label>
      
      <div class="relative">
        <input
          id="title"
          type="text"
          formControlName="title"
          placeholder="Enter your todo here..."
          [class]="getFieldClass('title')"
          [disabled]="isSubmitting()"
          autocomplete="off"
        >
        
        <!-- Loading spinner inside input -->
        @if (isSubmitting()) {
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        }
      </div>

      <!-- Character Counter -->
      <div class="flex justify-between items-center mt-1">
        <!-- Error Message -->
        <div class="min-h-[1.25rem]">
          @if (getFieldError('title')) {
            <p class="text-sm text-red-600 flex items-center">
              <span class="mr-1">⚠️</span>
              {{ getFieldError('title') }}
            </p>
          }
        </div>
        
        <!-- Character Count -->
        <div class="text-xs text-gray-500">
          <span [class.text-red-500]="isNearMaxLength()">
            {{ getCurrentLength() }}
          </span>
          / {{ getMaxLength() }}
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex gap-3">
      
      <!-- Submit Button -->
      <button
        type="submit"
        [class]="getSubmitButtonClass()"
        [disabled]="isSubmitting() || !todoForm.valid"
      >
        @if (isSubmitting()) {
          <span class="flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Adding...
          </span>
        } @else {
          <span class="flex items-center">
            <span class="mr-2">➕</span>
            Add Todo
          </span>
        }
      </button>

      <!-- Reset Button -->
      <button
        type="button"
        (click)="resetForm()"
        [disabled]="isSubmitting() || todoForm.pristine"
        class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Reset
      </button>
    </div>

    <!-- Form Debug Info (เฉพาะ development) -->
    <!-- Uncomment for debugging -->
    <!--
    <div class="mt-4 p-3 bg-gray-100 rounded text-xs">
      <strong>Debug Info:</strong><br>
      Form Valid: {{ todoForm.valid }}<br>
      Form Value: {{ todoForm.value | json }}<br>
      Form Errors: {{ todoForm.errors | json }}<br>
      Title Errors: {{ todoForm.get('title')?.errors | json }}
    </div>
    -->
  </form>

  <!-- Form Tips -->
  <div class="mt-4 p-3 bg-blue-50 rounded-lg">
    <h4 class="text-sm font-medium text-blue-800 mb-1">💡 Tips:</h4>
    <ul class="text-xs text-blue-700 space-y-1">
      <li>• Press Enter to quickly add a todo</li>
      <li>• Keep titles between 1-100 characters</li>
      <li>• Be specific for better productivity</li>
    </ul>
  </div>

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
- [ ] Character counter ทำงานได้
- [ ] Loading states ทำงานได้
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
