# Step 4.1: สร้าง Todo Item Component

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การสร้าง **Reusable Todo Item Component** พร้อม Advanced Interactions

---

## 📚 สิ่งที่จะได้เรียนรู้
- Reusable Component Design
- Multiple Event Emitters
- Advanced Property Binding
- Conditional Styling
- Component Composition

---

## 📋 Prerequisites
- ✅ Step 2.1-2.2 เสร็จแล้ว (Form Components)
- ✅ Step 3.1 เสร็จแล้ว (HTTP Service Setup)
- ✅ เข้าใจ @Input และ @Output
- ✅ มี Backend API running ที่ http://localhost:8000

---

## 📝 Task: สร้าง TodoItem Component

### 1. Generate Todo Item Component

```bash
# สร้าง todo-item component
ng generate component components/todo-item --standalone --skip-tests

# หรือ
ng g c components/todo-item --standalone --skip-tests
```

### 2. สร้าง Todo Item Component Class

แก้ไขไฟล์ `src/app/components/todo-item/todo-item.component.ts`:

```typescript
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo, UpdateTodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  // TODO: Inject TodoService สำหรับ HTTP operations
  private readonly todoService = inject(TodoService);

  // TODO: สร้าง @Input สำหรับรับ todo data
  @Input() todo!: Todo;
  
  // TODO: สร้าง @Input สำหรับ index (optional)
  @Input() index?: number;

  // TODO: สร้าง @Output Events สำหรับแจ้ง parent component
  @Output() todoUpdated = new EventEmitter<Todo>();
  @Output() todoDeleted = new EventEmitter<number>();

  // TODO: สร้าง property สำหรับ edit mode
  isEditing = false;
  editTitle = '';

  // TODO: เข้าถึง loading state จาก service
  readonly isLoading = this.todoService.isLoading;

  // TODO: สร้าง getter สำหรับ dynamic classes
  get itemClasses(): string {
    let classes = 'todo-item';
    if (this.todo.completed) classes += ' completed';
    if (this.isEditing) classes += ' editing';
    return classes;
  }

  get priorityClass(): string {
    // TODO: เพิ่ม priority logic ในอนาคต
    return '';
  }

  // TODO: สร้าง method สำหรับ toggle completion ด้วย HTTP service
  onToggle(): void {
    if (this.isLoading()) return;

    const updateData: UpdateTodoRequest = { 
      completed: !this.todo.completed 
    };

    this.todoService.updateTodo(this.todo.id, updateData).subscribe({
      next: (updatedTodo) => {
        this.todoUpdated.emit(updatedTodo);
      },
      error: (error) => {
        console.error('Failed to toggle todo:', error);
      }
    });
  }

  // TODO: สร้าง method สำหรับ delete ด้วย HTTP service
  onDelete(): void {
    if (this.isLoading()) return;

    const confirmed = confirm(`Delete "${this.todo.title}"?`);
    if (!confirmed) return;

    this.todoService.deleteTodo(this.todo.id).subscribe({
      next: () => {
        this.todoDeleted.emit(this.todo.id);
      },
      error: (error) => {
        console.error('Failed to delete todo:', error);
      }
    });
  }

  // TODO: สร้าง method สำหรับ start editing
  startEdit(): void {
    this.isEditing = true;
    this.editTitle = this.todo.title;
  }

  // TODO: สร้าง method สำหรับ cancel editing
  cancelEdit(): void {
    this.isEditing = false;
    this.editTitle = '';
  }

  // TODO: สร้าง method สำหรับ save edit ด้วย HTTP service
  saveEdit(): void {
    if (!this.editTitle.trim() || this.isLoading()) return;

    const updateData: UpdateTodoRequest = { 
      title: this.editTitle.trim() 
    };

    this.todoService.updateTodo(this.todo.id, updateData).subscribe({
      next: (updatedTodo) => {
        this.isEditing = false;
        this.todoUpdated.emit(updatedTodo);
      },
      error: (error) => {
        console.error('Failed to update todo:', error);
      }
    });
  }

  // TODO: สร้าง method สำหรับ format date
  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  // TODO: สร้าง method สำหรับ handle keyboard events
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  // TODO: สร้าง method สำหรับ get word count
  getWordCount(): number {
    return this.todo.title.trim().split(/\s+/).length;
  }

  // TODO: สร้าง method สำหรับ truncate long titles
  getTruncatedTitle(maxLength: number = 50): string {
    if (this.todo.title.length <= maxLength) return this.todo.title;
    return this.todo.title.substring(0, maxLength) + '...';
  }
  }
}
```

### 3. สร้าง Todo Item Template

แก้ไขไฟล์ `src/app/components/todo-item/todo-item.component.html`:

```html
<div [class]="itemClasses" [attr.data-todo-id]="todo.id">
  
  <!-- Normal View -->
  @if (!isEditing) {
    <div class="todo-content">
      
      <!-- Left Section: Checkbox + Content -->
      <div class="left-section">
        <!-- Custom Checkbox -->
        <!-- TODO: สร้าง custom checkbox -->
        <!-- bind (click) กับ onToggle() -->
        <!-- ใช้ [class] binding สำหรับ styling ตาม completed status -->
        <div 
          class="custom-checkbox"
          (click)="onToggle()"
          [class.checked]="">
          
          <!-- Checkmark Icon -->
          @if (todo.completed) {
            <svg class="checkmark-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          }
        </div>

        <!-- Todo Content -->
        <div class="todo-text-section">
          <!-- Title -->
          <!-- TODO: แสดง todo title -->
          <!-- ใช้ conditional classes สำหรับ completed state -->
          <!-- เพิ่ม double-click event สำหรับ start editing -->
          <div 
            class="todo-title"
            [class.completed]=""
            (dblclick)="">
            {{ getTruncatedTitle() }}
          </div>

          <!-- Metadata -->
          <div class="todo-metadata">
            <!-- Creation Date -->
            <span class="date-info">
              📅 {{ formatDate(todo.createdAt) }}
            </span>
            
            <!-- Word Count -->
            <span class="word-count">
              📝 {{ getWordCount() }} words
            </span>

            <!-- Index (if provided) -->
            @if (index !== undefined) {
              <span class="index-info">
                #{{ index + 1 }}
              </span>
            }
          </div>
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="action-section">
        <!-- Edit Button -->
        <!-- TODO: สร้าง edit button -->
        <button 
          class="action-btn edit-btn"
          (click)=""
          title="Edit todo">
          <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <!-- Delete Button -->
        <!-- TODO: สร้าง delete button -->
        <button 
          class="action-btn delete-btn"
          (click)=""
          title="Delete todo">
          <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  }

  <!-- Edit View -->
  @else {
    <div class="edit-content">
      <!-- Edit Input -->
      <!-- TODO: สร้าง edit input -->
      <!-- bind [(ngModel)] กับ editTitle -->
      <!-- เพิ่ม (keypress) event สำหรับ keyboard shortcuts -->
      <!-- auto focus เมื่อเริ่ม edit -->
      <input 
        type="text"
        class="edit-input"
        [(ngModel)]=""
        (keypress)=""
        #editInput>

      <!-- Edit Actions -->
      <div class="edit-actions">
        <!-- Save Button -->
        <button 
          class="edit-action-btn save-btn"
          (click)=""
          [disabled]="">
          Save
        </button>

        <!-- Cancel Button -->
        <button 
          class="edit-action-btn cancel-btn"
          (click)="">
          Cancel
        </button>
      </div>
    </div>
  }

  <!-- Progress/Loading Indicator -->
  @if (false) {
    <!-- TODO: เพิ่ม loading indicator สำหรับ future async operations -->
    <div class="loading-overlay">
      <div class="spinner"></div>
    </div>
  }

</div>
```

### 4. เพิ่ม Advanced CSS Styles

แก้ไขไฟล์ `src/app/components/todo-item/todo-item.component.css`:

```css
.todo-item {
  /* TODO: เพิ่ม CSS สำหรับ todo item container */
  /* Background, border, border-radius, padding, margin */
  /* Display flex, align-items, transition */
}

.todo-item:hover {
  /* TODO: เพิ่ม hover effect */
}

.todo-item.completed {
  /* TODO: เพิ่ม styles สำหรับ completed state */
}

.todo-content {
  /* TODO: เพิ่ม CSS สำหรับ todo content */
  /* Display flex, align-items, justify-content, width 100% */
}

.left-section {
  /* TODO: เพิ่ม CSS สำหรับ left section */
  /* Display flex, align-items, flex 1, gap */
}

.custom-checkbox {
  /* TODO: เพิ่ม CSS สำหรับ custom checkbox */
  /* Width, height, border, border-radius, cursor */
  /* Display flex, align-items, justify-content */
  /* Transition effects */
}

.custom-checkbox:hover {
  /* TODO: เพิ่ม hover effect */
}

.custom-checkbox.checked {
  /* TODO: เพิ่ม checked styles */
  /* Background, border-color */
}

.checkmark-icon {
  /* TODO: เพิ่ม CSS สำหรับ checkmark icon */
  /* Width, height, color */
}

.todo-text-section {
  /* TODO: เพิ่ม CSS สำหรับ text section */
  /* Flex 1, min-width 0 */
}

.todo-title {
  /* TODO: เพิ่ม CSS สำหรับ title */
  /* Font-size, font-weight, color, margin-bottom */
  /* Word-wrap, overflow-wrap */
}

.todo-title.completed {
  /* TODO: เพิ่ม styles สำหรับ completed title */
  /* Text-decoration, color, opacity */
}

.todo-metadata {
  /* TODO: เพิ่ม CSS สำหรับ metadata */
  /* Display flex, gap, flex-wrap, font-size, color */
}

.date-info,
.word-count,
.index-info {
  /* TODO: เพิ่ม CSS สำหรับ metadata items */
  /* Font-size, color, background, padding, border-radius */
}

.action-section {
  /* TODO: เพิ่ม CSS สำหรับ action section */
  /* Display flex, gap, align-items */
}

.action-btn {
  /* TODO: เพิ่ม CSS สำหรับ action buttons */
  /* Padding, border, border-radius, background, cursor */
  /* Display flex, align-items, justify-content */
  /* Transition effects */
}

.action-btn:hover {
  /* TODO: เพิ่ม hover effects */
}

.edit-btn:hover {
  /* TODO: เพิ่ม edit button hover */
}

.delete-btn:hover {
  /* TODO: เพิ่ม delete button hover */
}

.action-icon {
  /* TODO: เพิ่ม CSS สำหรับ action icons */
  /* Width, height */
}

.edit-content {
  /* TODO: เพิ่ม CSS สำหรับ edit content */
  /* Display flex, gap, align-items, width 100% */
}

.edit-input {
  /* TODO: เพิ่ม CSS สำหรับ edit input */
  /* Flex 1, padding, border, border-radius, font-size */
  /* Focus styles */
}

.edit-actions {
  /* TODO: เพิ่ม CSS สำหรับ edit actions */
  /* Display flex, gap */
}

.edit-action-btn {
  /* TODO: เพิ่ม CSS สำหรับ edit action buttons */
  /* Padding, border, border-radius, cursor, font-size */
  /* Background colors สำหรับ save และ cancel */
}

.save-btn {
  /* TODO: เพิ่ม save button styles */
}

.cancel-btn {
  /* TODO: เพิ่ม cancel button styles */
}

.loading-overlay {
  /* TODO: เพิ่ม CSS สำหรับ loading overlay */
  /* Position absolute, top 0, left 0, right 0, bottom 0 */
  /* Background, display flex, align-items, justify-content */
}

.spinner {
  /* TODO: เพิ่ม CSS สำหรับ spinner */
  /* Width, height, border, border-radius, animation */
}

@keyframes spin {
  /* TODO: เพิ่ม keyframes สำหรับ spinner */
}

/* Responsive Styles */
@media (max-width: 768px) {
  .todo-metadata {
    /* TODO: เพิ่ม responsive styles */
  }
  
  .action-section {
    /* TODO: เพิ่ม responsive styles */
  }
}
```

### 5. เพิ่ม FormsModule สำหรับ ngModel

แก้ไข `src/app/components/todo-item/todo-item.component.ts`:

```typescript
// เพิ่ม import
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule], // เพิ่ม FormsModule
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Basic Functionality

ตรวจสอบ component ใน isolation:
- ✅ Component compile ได้ไม่มี error
- ✅ Template render ได้ (แม้ยังไม่มี data)
- ✅ CSS classes ถูก apply

### Test 2: Component Integration

ต้องรอ step ถัดไปเพื่อ integrate กับ parent component

### Test 3: Event Handling

ทดสอบ method calls:
- ✅ onToggle() method
- ✅ onDelete() method
- ✅ startEdit() method

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Complete Component Structure

```typescript
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Input() index?: number;
  
  @Output() toggleCompleted = new EventEmitter<number>();
  @Output() deleteClicked = new EventEmitter<number>();
  @Output() editClicked = new EventEmitter<number>();

  // All methods implemented...
}
```

### 2. Feature-Rich Template

- ✅ Custom checkbox design
- ✅ Conditional rendering (@if/@else)
- ✅ Event bindings
- ✅ Property bindings
- ✅ Edit mode functionality

### 3. Professional Styling

- ✅ Hover effects
- ✅ Transition animations
- ✅ Responsive design
- ✅ State-based styling

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ Advanced Component Design
- Multiple @Input properties
- Multiple @Output events
- Component state management
- Mode switching (view/edit)

### ✅ Enhanced User Interactions
- Double-click editing
- Keyboard shortcuts
- Confirmation dialogs
- Custom checkbox

### ✅ Advanced Template Techniques
- Conditional classes
- Dynamic styling
- Template reference variables
- Event handling

### ✅ CSS Mastery
- Custom components styling
- Hover and transition effects
- Responsive design
- State-based styling

---

## 🔧 Troubleshooting

### ❌ Error: "FormsModule not imported"
**Solution**: เพิ่ม FormsModule ใน imports
```typescript
imports: [CommonModule, FormsModule]
```

### ❌ Template ไม่ compile
**Solution**: ตรวจสอบ @if/@else syntax
```html
@if (condition) {
  <!-- content -->
} @else {
  <!-- other content -->
}
```

### ❌ Events ไม่ทำงาน
**Solution**: ตรวจสอบ method calls ใน template
```html
<button (click)="onDelete()">Delete</button>
```

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 4.2: Integrate Todo Item Component](./step-4.2-integrate-todo-item.md)

---

## 💡 เคล็ดลับ

1. **Component Reusability**: ออกแบบให้ใช้ซ้ำได้ง่าย
2. **Event-Driven**: ใช้ events แทน direct manipulation
3. **User Experience**: เพิ่ม feedback และ confirmation
4. **Accessibility**: เพิ่ม title attributes และ keyboard support

---

**🎯 Goal Achieved**: สร้าง Reusable Todo Item Component ที่ Feature-Rich!
