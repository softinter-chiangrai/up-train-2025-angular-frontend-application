# Step 3.3: Service Integration กับ Todo Components

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การ**เชื่อมต่อ HTTP Service** กับ Todo Components ที่มีอยู่แล้ว

---

## 📚 สิ่งที่จะได้เรียนรู้
- Service Integration Patterns
- Observable Subscription Management
- Optimistic Updates
- Error Handling in Components
- Loading State Management

---

## 📋 Prerequisites
- ✅ Step 3.1-3.2 เสร็จแล้ว (HTTP Service + Mock API)
- ✅ มี Todo Components จาก Step 2.x แล้ว

---

## 📝 Task: Integrate HTTP Service กับ Components

### 1. Update TodoApp Component สำหรับ HTTP Service

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.ts`:

```typescript
import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent implements OnInit, OnDestroy {
  // TODO: Inject TodoService และสร้าง subscription management
  private readonly todoService = inject(TodoService);
  private subscriptions = new Subscription();
  
  // TODO: สร้าง Local State (Signals)
  private readonly _todos = signal<Todo[]>([]);
  private readonly _lastUpdated = signal<Date | null>(null);
  
  // Public Read-only Signals
  readonly todos = this._todos.asReadonly();
  readonly lastUpdated = this._lastUpdated.asReadonly();
  
  // TODO: สร้าง Computed Signals สำหรับ Statistics
  readonly totalTodos = computed(() => this._todos().length);
  readonly completedTodos = computed(() => 
    this._todos().filter(todo => todo.completed).length
  );
  readonly pendingTodos = computed(() => 
    this._todos().filter(todo => !todo.completed).length
  );
  
  // TODO: สร้าง Computed Signal สำหรับ completion percentage
  readonly completionPercentage = computed(() => {
    const total = this.totalTodos();
    if (total === 0) return 0;
    return Math.round((this.completedTodos() / total) * 100);
  });

  // Service State Access
  readonly isLoading = this.todoService.isLoading;
  readonly error = this.todoService.error;

  // ============================================
  // Lifecycle Methods
  // ============================================

  ngOnInit(): void {
    // TODO: โหลด todos เมื่อ component เริ่มต้น
    this.loadTodos();
  }

  ngOnDestroy(): void {
    // TODO: cleanup subscriptions
    this.subscriptions.unsubscribe();
  }

  // ============================================
  // Public Methods - Data Loading
  // ============================================

  loadTodos(): void {
    // TODO: เขียน method สำหรับโหลด todos จาก service
    // 1. call todoService.getTodos()
    // 2. subscribe และอัพเดท _todos signal
    // 3. จัดการ error
    // 4. เพิ่ม subscription ใน subscriptions

    console.log('🔄 Loading todos from http://localhost:8000...');
    
    const subscription = this.todoService.getTodos().subscribe({
      next: (todos) => {
        // เขียนโค้ดตรงนี้
        this._todos.set(todos);
        this._lastUpdated.set(new Date());
        console.log('✅ Todos loaded:', todos.length);
      },
      error: (error) => {
        // เขียนโค้ดตรงนี้
        console.error('❌ Failed to load todos:', error);
        // Error จะถูกจัดการโดย service แล้ว
      }
    });

    this.subscriptions.add(subscription);
  }

  refreshTodos(): void {
    // TODO: สร้าง method สำหรับ refresh data
    console.log('🔄 Refreshing todos from API...');
    this.loadTodos();
  }

  // ============================================
  // Public Methods - CRUD Operations
  // ============================================

  onTodoAdded(todoData: CreateTodoRequest): void {
    // TODO: เขียน method สำหรับเพิ่ม todo ใหม่
    // 1. call todoService.createTodo()
    // 2. อัพเดท local state (optimistic update)
    // 3. จัดการ error และ rollback ถ้าจำเป็น

    console.log('➕ Creating todo via API:', todoData);

    const subscription = this.todoService.createTodo(todoData).subscribe({
      next: (newTodo) => {
        // เขียนโค้ดตรงนี้ - Optimistic update
        this._todos.update(current => [...current, newTodo]);
        this._lastUpdated.set(new Date());
        console.log('✅ Todo created:', newTodo.title);
      },
      error: (error) => {
        // เขียนโค้ดตรงนี้ - Error handling
        console.error('❌ Failed to create todo:', error);
        // อาจจะต้อง rollback optimistic update
      }
    });

    this.subscriptions.add(subscription);
  }

  onToggleTodo(id: number): void {
    // TODO: เขียน method สำหรับ toggle todo completed status
    // 1. หา todo ที่ต้องการ toggle
    // 2. สร้าง optimistic update
    // 3. call service
    // 4. rollback ถ้า error

    console.log('🔄 Toggling todo:', id);

    const todo = this._todos().find(t => t.id === id);
    if (!todo) {
      console.error('❌ Todo not found:', id);
      return;
    }

    // Optimistic update
    const updatedTodo = { ...todo, completed: !todo.completed };
    this._todos.update(current =>
      current.map(t => t.id === id ? updatedTodo : t)
    );

    // API call
    const updateData: UpdateTodoRequest = { completed: !todo.completed };
    const subscription = this.todoService.updateTodo(id, updateData).subscribe({
      next: (serverTodo) => {
        // เขียนโค้ดตรงนี้ - Sync with server response
        this._todos.update(current =>
          current.map(t => t.id === id ? serverTodo : t)
        );
        this._lastUpdated.set(new Date());
        console.log('✅ Todo toggled:', serverTodo.title);
      },
      error: (error) => {
        // เขียนโค้ดตรงนี้ - Rollback optimistic update
        console.error('❌ Failed to toggle todo:', error);
        this._todos.update(current =>
          current.map(t => t.id === id ? todo : t)
        );
      }
    });

    this.subscriptions.add(subscription);
  }

  onEditTodo(id: number, newTitle: string): void {
    // TODO: เขียน method สำหรับแก้ไข todo title
    // Pattern เดียวกับ toggle แต่อัพเดท title

    console.log('✏️ Editing todo:', id, newTitle);

    const todo = this._todos().find(t => t.id === id);
    if (!todo || !newTitle.trim()) {
      console.error('❌ Invalid edit data');
      return;
    }

    // Optimistic update
    const updatedTodo = { ...todo, title: newTitle.trim() };
    this._todos.update(current =>
      current.map(t => t.id === id ? updatedTodo : t)
    );

    // API call
    const updateData: UpdateTodoRequest = { title: newTitle.trim() };
    const subscription = this.todoService.updateTodo(id, updateData).subscribe({
      next: (serverTodo) => {
        // เขียนโค้ดตรงนี้
      },
      error: (error) => {
        // เขียนโค้ดตรงนี้ - rollback
      }
    });

    this.subscriptions.add(subscription);
  }

  onDeleteTodo(id: number): void {
    // TODO: เขียน method สำหรับลบ todo
    // 1. แสดง confirmation
    // 2. optimistic remove
    // 3. call service
    // 4. rollback ถ้า error

    const todo = this._todos().find(t => t.id === id);
    if (!todo) return;

    if (!confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      return;
    }

    console.log('🗑️ Deleting todo:', id);

    // Optimistic removal
    const originalTodos = this._todos();
    this._todos.update(current => current.filter(t => t.id !== id));

    // API call
    const subscription = this.todoService.deleteTodo(id).subscribe({
      next: () => {
        // เขียนโค้ดตรงนี้ - Success
        this._lastUpdated.set(new Date());
        console.log('✅ Todo deleted');
      },
      error: (error) => {
        // เขียนโค้ดตรงนี้ - Rollback
        console.error('❌ Failed to delete todo:', error);
        this._todos.set(originalTodos);
      }
    });

    this.subscriptions.add(subscription);
  }

  // ============================================
  // Public Methods - Bulk Operations
  // ============================================

  onClearCompleted(): void {
    // TODO: เขียน method สำหรับลบ todos ที่เสร็จแล้วทั้งหมด
    const completedTodos = this._todos().filter(t => t.completed);
    
    if (completedTodos.length === 0) {
      return;
    }

    if (!confirm(`Are you sure you want to delete ${completedTodos.length} completed todos?`)) {
      return;
    }

    console.log('🧹 Clearing completed todos...');

    // TODO: วิธีที่ 1 - ใช้ bulk delete (ถ้า API รองรับ)
    // TODO: วิธีที่ 2 - ลบทีละตัว
    
    // สำหรับตอนนี้ใช้วิธีลบทีละตัว
    const deletePromises = completedTodos.map(todo => 
      this.todoService.deleteTodo(todo.id).toPromise()
    );

    // Optimistic removal
    this._todos.update(current => current.filter(t => !t.completed));

    Promise.all(deletePromises).then(
      () => {
        console.log('✅ All completed todos deleted');
        this._lastUpdated.set(new Date());
      }
    ).catch(
      (error) => {
        console.error('❌ Failed to delete some todos:', error);
        // TODO: Partial rollback หรือ reload data
        this.loadTodos();
      }
    );
  }

  onClearAll(): void {
    // TODO: เขียน method สำหรับลบ todos ทั้งหมด
    if (this._todos().length === 0) return;

    if (!confirm('Are you sure you want to delete ALL todos? This cannot be undone.')) {
      return;
    }

    console.log('🧹 Clearing all todos...');

    // Optimistic clear
    const originalTodos = this._todos();
    this._todos.set([]);

    // Delete all todos
    const deletePromises = originalTodos.map(todo => 
      this.todoService.deleteTodo(todo.id).toPromise()
    );

    Promise.all(deletePromises).then(
      () => {
        console.log('✅ All todos deleted');
        this._lastUpdated.set(new Date());
      }
    ).catch(
      (error) => {
        console.error('❌ Failed to delete all todos:', error);
        this._todos.set(originalTodos);
      }
    );
  }

  // ============================================
  // Helper Methods
  // ============================================

  getStatusText(): string {
    // TODO: สร้าง helper method สำหรับ status text
    if (this.isLoading()) return 'Loading...';
    if (this.error()) return 'Error occurred';
    if (this.totalTodos() === 0) return 'No todos';
    return `${this.completedTodos()}/${this.totalTodos()} completed`;
  }

  canPerformActions(): boolean {
    // TODO: สร้าง helper method ตรวจสอบว่าสามารถทำ actions ได้หรือไม่
    return !this.isLoading() && !this.error();
  }
}
```

### 2. Update TodoApp Template สำหรับ HTTP Integration

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.html`:

```html
<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-2xl mx-auto px-4">
    
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        📝 Todo App with HTTP Service
      </h1>
      <p class="text-gray-600">Real-time data synchronization</p>
    </div>

    <!-- Global Loading -->
    @if (isLoading()) {
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <span class="text-blue-800">{{ getStatusText() }}</span>
        </div>
      </div>
    }

    <!-- Global Error -->
    @if (error()) {
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-800">{{ error() }}</span>
          </div>
          <button 
            (click)="refreshTodos()"
            class="text-red-600 hover:text-red-800 underline">
            Retry
          </button>
        </div>
      </div>
    }

    <!-- Add Todo Form -->
    <app-todo-form 
      (todoAdded)="onTodoAdded($event)"
      [disabled]="!canPerformActions()"
      class="mb-6 block">
    </app-todo-form>

    <!-- Statistics Dashboard -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <!-- TODO: สร้าง statistics cards -->
      
      <!-- Total -->
      <div class="bg-white rounded-lg shadow-md p-4 text-center">
        <div class="text-2xl font-bold text-blue-600 mb-1">
          {{ totalTodos() }}
        </div>
        <div class="text-sm text-gray-600">Total</div>
      </div>

      <!-- Completed -->
      <div class="bg-white rounded-lg shadow-md p-4 text-center">
        <div class="text-2xl font-bold text-green-600 mb-1">
          {{ completedTodos() }}
        </div>
        <div class="text-sm text-gray-600">Completed</div>
      </div>

      <!-- Pending -->
      <div class="bg-white rounded-lg shadow-md p-4 text-center">
        <div class="text-2xl font-bold text-orange-600 mb-1">
          {{ pendingTodos() }}
        </div>
        <div class="text-sm text-gray-600">Pending</div>
      </div>

      <!-- Progress -->
      <div class="bg-white rounded-lg shadow-md p-4 text-center">
        <div class="text-2xl font-bold text-purple-600 mb-1">
          {{ completionPercentage() }}%
        </div>
        <div class="text-sm text-gray-600">Progress</div>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="bg-white rounded-lg shadow-md p-3 mb-6 flex items-center justify-between">
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        @if (lastUpdated()) {
          <span>Last updated: {{ lastUpdated() | date:'short' }}</span>
        } @else {
          <span>No data loaded</span>
        }
      </div>
      
      <button 
        (click)="refreshTodos()"
        [disabled]="isLoading()"
        class="flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Todo List -->
    <div class="space-y-3">
      @if (todos().length === 0 && !isLoading()) {
        <!-- Empty State -->
        <div class="bg-white rounded-lg shadow-md p-12 text-center">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            No todos yet!
          </h3>
          <p class="text-gray-500 mb-4">
            Create your first todo to get started
          </p>
          <button 
            (click)="refreshTodos()"
            class="text-blue-600 hover:text-blue-800 underline">
            Refresh to check for updates
          </button>
        </div>
      } @else {
        <!-- Todo Items -->
        @for (todo of todos(); track todo.id; let i = $index) {
          <app-todo-item
            [todo]="todo"
            [index]="i"
            [disabled]="!canPerformActions()"
            (toggleCompleted)="onToggleTodo($event)"
            (deleteClicked)="onDeleteTodo($event)"
            (editClicked)="onEditTodo($event.id, $event.title)">
          </app-todo-item>
        }
      }
    </div>

    <!-- Bulk Actions -->
    @if (todos().length > 0 && canPerformActions()) {
      <div class="mt-8 space-y-3">
        
        <!-- Progress Bar -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Overall Progress</span>
            <span class="text-sm text-gray-500">{{ completionPercentage() }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-green-500 h-2 rounded-full transition-all duration-300"
              [style.width.%]="completionPercentage()">
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            (click)="onClearCompleted()"
            [disabled]="completedTodos() === 0"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                   hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors duration-200 flex items-center justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear Completed ({{ completedTodos() }})
          </button>
          
          <button
            (click)="onClearAll()"
            class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium
                   hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Clear All
          </button>
        </div>
      </div>
    }

  </div>
</div>
```

### 3. Update TodoForm Component สำหรับ Integration

แก้ไขไฟล์ `src/app/components/todo-form/todo-form.component.ts`:

```typescript
// เพิ่ม Input สำหรับ disabled state
@Input() disabled = false;

// แก้ไข onSubmit method
onSubmit(): void {
  if (this.todoForm.valid && !this.isSubmitting() && !this.disabled) {
    this._isSubmitting.set(true);
    
    const formData: CreateTodoRequest = {
      title: this.todoForm.get('title')?.value.trim(),
      completed: false // Default to false
    };
    
    // TODO: เพิ่ม validation ก่อนส่ง
    if (!formData.title || formData.title.length < 3) {
      this._isSubmitting.set(false);
      return;
    }
    
    // Emit the data
    this.todoAdded.emit(formData);
    
    // Reset form after delay
    setTimeout(() => {
      this.todoForm.reset();
      this._isSubmitting.set(false);
    }, 1000);
  }
}
```

แก้ไข template เพื่อรองรับ disabled state:

```html
<!-- Submit Button -->
<button
  type="submit"
  [disabled]="todoForm.invalid || isSubmitting() || disabled"
  class="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium
         hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
         transition-colors duration-200">
  @if (isSubmitting()) {
    <span class="flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Creating...
    </span>
  } @else if (disabled) {
    Service Unavailable
  } @else {
    Add Todo
  }
</button>
```

### 4. Update TodoItem Component สำหรับ Edit Functionality

แก้ไขไฟล์ `src/app/components/todo-item/todo-item.component.ts`:

```typescript
// เพิ่ม Inputs และ Outputs
@Input() disabled = false;
@Output() editClicked = new EventEmitter<{id: number, title: string}>();

// Edit state
isEditing = false;
editTitle = '';

// เพิ่ม methods สำหรับ editing
startEdit(): void {
  if (this.disabled) return;
  
  this.isEditing = true;
  this.editTitle = this.todo.title;
}

cancelEdit(): void {
  this.isEditing = false;
  this.editTitle = '';
}

saveEdit(): void {
  if (!this.editTitle.trim() || this.editTitle.trim().length < 3) {
    alert('Title must be at least 3 characters long');
    return;
  }
  
  if (this.editTitle.trim() === this.todo.title) {
    this.cancelEdit();
    return;
  }
  
  this.editClicked.emit({
    id: this.todo.id,
    title: this.editTitle.trim()
  });
  
  this.isEditing = false;
}

onKeyPress(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    this.saveEdit();
  } else if (event.key === 'Escape') {
    this.cancelEdit();
  }
}
```

แก้ไข template เพื่อรองรับ edit functionality:

```html
<div class="bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg"
     [class.opacity-50]="disabled">
  
  @if (!isEditing) {
    <!-- Normal View -->
    <div class="flex items-center justify-between">
      <!-- ... existing checkbox and content ... -->
      
      <!-- Title (Double-click to edit) -->
      <h3 
        class="font-medium transition-all duration-200 cursor-pointer"
        [class]="titleClasses"
        (dblclick)="startEdit()"
        title="Double-click to edit">
        {{ todo.title }}
      </h3>
      
      <!-- Action Buttons -->
      <div class="flex items-center space-x-2">
        <button
          (click)="startEdit()"
          [disabled]="disabled"
          class="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-50"
          title="Edit todo">
          <!-- Edit icon -->
        </button>
        
        <button
          (click)="onDelete()"
          [disabled]="disabled"
          class="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
          title="Delete todo">
          <!-- Delete icon -->
        </button>
      </div>
    </div>
  } @else {
    <!-- Edit View -->
    <div class="flex items-center space-x-3">
      <input 
        type="text"
        [(ngModel)]="editTitle"
        (keypress)="onKeyPress($event)"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        #editInput>

      <div class="flex items-center space-x-2">
        <button
          (click)="saveEdit()"
          class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
          Save
        </button>
        <button
          (click)="cancelEdit()"
          class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
          Cancel
        </button>
      </div>
    </div>
  }
</div>
```

### 5. Add Auto-focus Directive สำหรับ Edit Input

สร้างไฟล์ `src/app/directives/auto-focus.directive.ts`:

```typescript
import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[autoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    // TODO: เขียน logic สำหรับ auto-focus
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();
    }, 100);
  }
}
```

เพิ่มใน TodoItem template:

```html
<input 
  type="text"
  [(ngModel)]="editTitle"
  (keypress)="onKeyPress($event)"
  autoFocus
  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  #editInput>
```

อย่าลืม import ใน TodoItem component:

```typescript
import { AutoFocusDirective } from '../../directives/auto-focus.directive';

@Component({
  // ...
  imports: [CommonModule, FormsModule, AutoFocusDirective],
  // ...
})
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Basic Integration

ตรวจสอบว่า:
- ✅ TodoApp component โหลด todos เมื่อเริ่มต้น
- ✅ สร้าง todo ใหม่ได้
- ✅ Toggle completed status ได้
- ✅ ลบ todo ได้

### Test 2: Error Handling

ทดสอบ error scenarios:
- ✅ ปิด JSON Server แล้วทดสอบ
- ✅ Error message แสดงถูกต้อง
- ✅ Retry button ทำงาน
- ✅ Optimistic updates rollback เมื่อ error

### Test 3: Edit Functionality

ทดสอบ edit features:
- ✅ Double-click เพื่อ edit
- ✅ Enter เพื่อ save
- ✅ Escape เพื่อ cancel
- ✅ Auto-focus ใน edit input

### Test 4: Loading States

ทดสอบ loading behaviors:
- ✅ Loading indicator แสดงขณะโหลด
- ✅ Buttons disabled ขณะ loading
- ✅ Form disabled เมื่อ service unavailable

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Fully Integrated Todo App

- ✅ HTTP Service integration
- ✅ Real-time data synchronization
- ✅ Optimistic updates
- ✅ Comprehensive error handling

### 2. Enhanced User Experience

- ✅ Loading states
- ✅ Error recovery
- ✅ Inline editing
- ✅ Bulk operations

### 3. Production-Ready Features

- ✅ Subscription management
- ✅ Memory leak prevention
- ✅ Type-safe operations
- ✅ Responsive design

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ Service Integration Patterns
- Dependency injection
- Observable subscription management
- Component lifecycle management
- Memory leak prevention

### ✅ State Management Strategies
- Optimistic updates
- Error rollback
- Local state synchronization
- Data freshness tracking

### ✅ User Experience Design
- Loading state management
- Error recovery patterns
- Progressive enhancement
- Accessibility considerations

### ✅ Production Best Practices
- Subscription cleanup
- Error boundaries
- Type safety
- Performance optimization

---

## 🔧 Troubleshooting

### ❌ Memory Leaks
**Solution**: ใช้ Subscription management
```typescript
ngOnDestroy(): void {
  this.subscriptions.unsubscribe();
}
```

### ❌ Optimistic Updates ไม่ rollback
**Solution**: เก็บ original state ก่อน update
```typescript
const originalTodos = this._todos();
// perform optimistic update
// if error: this._todos.set(originalTodos);
```

### ❌ Edit mode ไม่ auto-focus
**Solution**: ใช้ setTimeout และ ViewChild
```typescript
setTimeout(() => {
  this.editInput.nativeElement.focus();
}, 0);
```

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 3.4: Advanced HTTP Features](./step-3.4-advanced-http.md)

---

## 💡 เคล็ดลับ

1. **Optimistic Updates**: อัพเดท UI ทันทีแล้วค่อย sync กับ server
2. **Error Recovery**: ให้ user สามารถ retry ได้เสมอ
3. **Loading States**: แสดงสถานะให้ user รู้ว่าระบบทำงาน
4. **Subscription Management**: cleanup subscriptions เพื่อป้องกัน memory leak
5. **Type Safety**: ใช้ TypeScript เต็มที่เพื่อ catch errors ก่อน runtime

---

**🎯 Goal Achieved**: Service Integration กับ Todo Components สำเร็จ!
