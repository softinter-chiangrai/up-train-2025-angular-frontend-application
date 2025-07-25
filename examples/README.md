# 📚 Code Examples

Reference implementations สำหรับ Angular Todo App Workshop

## 📁 โครงสร้างไฟล์

```
examples/
├── components/
│   ├── basic-todo-component.ts      # Component พื้นฐาน
│   ├── advanced-todo-component.ts   # Component ขั้นสูง
│   └── form-examples.ts             # ตอวอย่าง Forms
├── services/
│   ├── simple-todo-service.ts       # Service พื้นฐาน
│   ├── advanced-todo-service.ts     # Service ขั้นสูง
│   └── http-examples.ts             # ตัวอย่าง HTTP
├── models/
│   └── todo-interfaces.ts           # Interface definitions
├── utils/
│   ├── validators.ts                # Custom validators
│   ├── helpers.ts                   # Helper functions
│   └── constants.ts                 # Constants
└── complete-examples/
    ├── minimal-todo-app/            # แอปพื้นฐาน
    ├── full-featured-app/           # แอปครบฟีเจอร์
    └── advanced-patterns/           # Patterns ขั้นสูง
```

## 🧩 Basic Components

### Simple Todo Component

```typescript
// examples/components/basic-todo-component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SimpleTodo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-simple-todo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Simple Todo</h1>
      
      <!-- Add Todo -->
      <div class="mb-4">
        <input 
          #todoInput
          type="text" 
          placeholder="Add todo..."
          class="px-3 py-2 border rounded mr-2"
          (keyup.enter)="addTodo(todoInput.value); todoInput.value = ''"
        >
        <button 
          (click)="addTodo(todoInput.value); todoInput.value = ''"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      <!-- Todo List -->
      <div class="space-y-2">
        @for (todo of todos(); track todo.id) {
          <div class="flex items-center space-x-2 p-2 border rounded">
            <input 
              type="checkbox" 
              [checked]="todo.completed"
              (change)="toggleTodo(todo.id)"
            >
            <span [class.line-through]="todo.completed">
              {{ todo.title }}
            </span>
            <button 
              (click)="deleteTodo(todo.id)"
              class="ml-auto text-red-500"
            >
              Delete
            </button>
          </div>
        }
      </div>

      <!-- Stats -->
      <div class="mt-4 text-sm text-gray-600">
        Total: {{ todos().length }} | 
        Completed: {{ completedCount() }} | 
        Pending: {{ pendingCount() }}
      </div>
    </div>
  `
})
export class SimpleTodoComponent {
  todos = signal<SimpleTodo[]>([
    { id: 1, title: 'Learn Angular', completed: false },
    { id: 2, title: 'Build Todo App', completed: false }
  ]);

  // Computed values
  completedCount = computed(() => 
    this.todos().filter(t => t.completed).length
  );
  
  pendingCount = computed(() => 
    this.todos().filter(t => !t.completed).length
  );

  private nextId = 3;

  addTodo(title: string): void {
    if (!title.trim()) return;
    
    this.todos.update(current => [...current, {
      id: this.nextId++,
      title: title.trim(),
      completed: false
    }]);
  }

  toggleTodo(id: number): void {
    this.todos.update(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  deleteTodo(id: number): void {
    this.todos.update(current =>
      current.filter(todo => todo.id !== id)
    );
  }
}
```

## 🛠️ Service Examples

### Basic Todo Service

```typescript
// examples/services/simple-todo-service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SimpleTodoService {
  private todos = signal<Todo[]>([]);
  private nextId = 1;

  // Mock data
  private mockTodos: Todo[] = [
    {
      id: 1,
      title: 'Learn Angular Signals',
      completed: false,
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Build Todo App',
      completed: true,
      createdAt: new Date()
    }
  ];

  getTodos(): Observable<Todo[]> {
    // Simulate API call with delay
    return of(this.mockTodos).pipe(delay(500));
  }

  addTodo(title: string): Observable<Todo> {
    const newTodo: Todo = {
      id: this.nextId++,
      title,
      completed: false,
      createdAt: new Date()
    };

    this.mockTodos.push(newTodo);
    return of(newTodo).pipe(delay(300));
  }

  toggleTodo(id: number): Observable<Todo> {
    const todo = this.mockTodos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      return of(todo).pipe(delay(200));
    }
    throw new Error('Todo not found');
  }

  deleteTodo(id: number): Observable<void> {
    const index = this.mockTodos.findIndex(t => t.id === id);
    if (index > -1) {
      this.mockTodos.splice(index, 1);
      return of(void 0).pipe(delay(200));
    }
    throw new Error('Todo not found');
  }
}
```

## 📝 Form Examples

### Reactive Form with Validation

```typescript
// examples/components/form-examples.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-form-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="p-4 border rounded">
      <h3 class="text-lg font-semibold mb-4">Add New Todo</h3>
      
      <!-- Title Field -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          formControlName="title"
          class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          [class.border-red-500]="isFieldInvalid('title')"
        >
        @if (isFieldInvalid('title')) {
          <div class="text-red-500 text-sm mt-1">
            @if (todoForm.get('title')?.errors?.['required']) {
              Title is required
            }
            @if (todoForm.get('title')?.errors?.['minlength']) {
              Title must be at least 3 characters
            }
            @if (todoForm.get('title')?.errors?.['maxlength']) {
              Title cannot exceed 100 characters  
            }
          </div>
        }
      </div>

      <!-- Priority Field -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Priority</label>
        <select
          formControlName="priority"
          class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <!-- Description Field -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Description (Optional)</label>
        <textarea
          formControlName="description"
          rows="3"
          class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Due Date Field -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Due Date (Optional)</label>
        <input
          type="date"
          formControlName="dueDate"
          class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        [disabled]="todoForm.invalid || isSubmitting()"
        class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        @if (isSubmitting()) {
          Adding...
        } @else {
          Add Todo
        }
      </button>

      <!-- Form Debug (Development only) -->
      @if (showDebug()) {
        <div class="mt-4 p-3 bg-gray-100 rounded text-xs">
          <strong>Form Debug:</strong><br>
          Valid: {{ todoForm.valid }}<br>
          Value: {{ todoForm.value | json }}<br>
          Errors: {{ todoForm.errors | json }}
        </div>
      }
    </form>
  `
})
export class TodoFormExampleComponent {
  private fb = inject(FormBuilder);
  
  isSubmitting = signal(false);
  showDebug = signal(false); // Toggle for development

  todoForm: FormGroup = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]],
    priority: ['', Validators.required],
    description: [''],
    dueDate: ['']
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.isSubmitting.set(true);
      
      const formValue = this.todoForm.value;
      console.log('Submitting todo:', formValue);
      
      // Simulate API call
      setTimeout(() => {
        // Handle success
        this.todoForm.reset();
        this.isSubmitting.set(false);
        console.log('Todo added successfully!');
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.todoForm.controls).forEach(key => {
        this.todoForm.get(key)?.markAsTouched();
      });
    }
  }

  toggleDebug(): void {
    this.showDebug.update(show => !show);
  }
}
```

## 🔧 Utility Functions

### Custom Validators

```typescript
// examples/utils/validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TodoValidators {
  
  // Validator สำหรับตรวจสอบว่าไม่ใช่ whitespace อย่างเดียว
  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value === 'string') {
      if (control.value.trim().length === 0) {
        return { whitespace: true };
      }
    }
    return null;
  }

  // Validator สำหรับตรวจสอบคำที่ห้ามใช้
  static forbiddenWords(forbiddenWords: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toLowerCase();
      const forbidden = forbiddenWords.find(word => 
        value.includes(word.toLowerCase())
      );
      
      return forbidden ? { forbiddenWord: { word: forbidden } } : null;
    };
  }

  // Validator สำหรับตรวจสอบวันที่ในอนาคต
  static futureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate < today ? { pastDate: true } : null;
  }

  // Validator สำหรับ priority
  static validPriority(control: AbstractControl): ValidationErrors | null {
    const validPriorities = ['low', 'medium', 'high'];
    
    if (control.value && !validPriorities.includes(control.value)) {
      return { invalidPriority: true };
    }
    
    return null;
  }
}

// ตัวอย่างการใช้งาน
export function createTodoForm(fb: FormBuilder): FormGroup {
  return fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      TodoValidators.noWhitespace,
      TodoValidators.forbiddenWords(['spam', 'test123'])
    ]],
    priority: ['', [
      Validators.required,
      TodoValidators.validPriority
    ]],
    dueDate: ['', TodoValidators.futureDate],
    description: ['', Validators.maxLength(500)]
  });
}
```

### Helper Functions

```typescript
// examples/utils/helpers.ts

export class TodoHelpers {
  
  // Format วันที่แบบ relative (เช่น "2 hours ago")
  static formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  // สร้าง ID แบบ unique
  static generateId(): number {
    return Date.now() + Math.random();
  }

  // ตรวจสอบว่า todo เกินกำหนดหรือไม่
  static isOverdue(todo: { completed: boolean; dueDate?: Date }): boolean {
    if (todo.completed || !todo.dueDate) return false;
    return new Date(todo.dueDate) < new Date();
  }

  // คำนวณ priority score สำหรับการเรียงลำดับ
  static getPriorityScore(priority: string): number {
    const scores = { high: 3, medium: 2, low: 1 };
    return scores[priority as keyof typeof scores] || 0;
  }

  // Filter todos ตาม criteria ต่างๆ
  static filterTodos<T extends {
    title: string;
    completed: boolean;
    priority?: string;
    category?: string;
  }>(todos: T[], filters: {
    search?: string;
    status?: 'all' | 'pending' | 'completed';
    priority?: string;
    category?: string;
  }): T[] {
    let filtered = [...todos];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(todo =>
        filters.status === 'completed' ? todo.completed : !todo.completed
      );
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(todo => todo.priority === filters.priority);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(todo => todo.category === filters.category);
    }

    return filtered;
  }

  // เรียงลำดับ todos
  static sortTodos<T extends {
    title: string;
    createdAt: Date;
    priority?: string;
    dueDate?: Date;
  }>(todos: T[], sortBy: string, order: 'asc' | 'desc' = 'desc'): T[] {
    const sorted = [...todos].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'priority':
          const scoreA = this.getPriorityScore(a.priority || '');
          const scoreB = this.getPriorityScore(b.priority || '');
          comparison = scoreA - scoreB;
          break;
        case 'dueDate':
          const dateA = a.dueDate ? a.dueDate.getTime() : Infinity;
          const dateB = b.dueDate ? b.dueDate.getTime() : Infinity;
          comparison = dateA - dateB;
          break;
        default:
          comparison = 0;
      }

      return order === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }

  // สร้าง CSS classes แบบ conditional
  static getStatusClasses(todo: { completed: boolean; dueDate?: Date }): string {
    const classes = ['todo-item'];
    
    if (todo.completed) {
      classes.push('completed');
    } else {
      classes.push('pending');
      if (this.isOverdue(todo)) {
        classes.push('overdue');
      }
    }
    
    return classes.join(' ');
  }

  // Export data เป็น JSON
  static exportToJSON(data: any[], filename: string): void {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }

  // Import data จาก JSON file
  static async importFromJSON<T>(file: File): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(Array.isArray(data) ? data : [data]);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

// ตัวอย่างการใช้งาน
/*
const todos = [
  { id: 1, title: 'Learn Angular', completed: false, priority: 'high', createdAt: new Date() },
  { id: 2, title: 'Build App', completed: true, priority: 'medium', createdAt: new Date() }
];

// Filter
const filtered = TodoHelpers.filterTodos(todos, { 
  search: 'angular', 
  status: 'pending' 
});

// Sort
const sorted = TodoHelpers.sortTodos(todos, 'priority', 'desc');

// Format date
const formattedDate = TodoHelpers.formatRelativeDate(new Date());

// Export
TodoHelpers.exportToJSON(todos, 'my-todos.json');
*/
```

## 🎯 Complete Minimal Example

```typescript
// examples/complete-examples/minimal-todo-app/app.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-center mb-6">📝 Todo App</h1>
      
      <!-- Add Todo -->
      <div class="flex mb-4">
        <input
          [(ngModel)]="newTodoTitle"
          (keyup.enter)="addTodo()"
          placeholder="Add a new todo..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <button
          (click)="addTodo()"
          [disabled]="!newTodoTitle.trim()"
          class="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <!-- Stats -->
      <div class="text-center mb-4 text-sm text-gray-600">
        {{ completedCount() }} of {{ totalCount() }} completed
      </div>

      <!-- Todo List -->
      <div class="space-y-2">
        @for (todo of todos(); track todo.id) {
          <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              [checked]="todo.completed"
              (change)="toggleTodo(todo.id)"
              class="mr-3"
            >
            <span
              [class.line-through]="todo.completed"
              [class.text-gray-500]="todo.completed"
              class="flex-1"
            >
              {{ todo.title }}
            </span>
            <button
              (click)="deleteTodo(todo.id)"
              class="text-red-500 hover:text-red-700 ml-2"
            >
              ✕
            </button>
          </div>
        } @empty {
          <div class="text-center py-8 text-gray-500">
            No todos yet. Add one above! 👆
          </div>
        }
      </div>

      <!-- Actions -->
      @if (totalCount() > 0) {
        <div class="mt-4 flex justify-between">
          <button
            (click)="clearCompleted()"
            [disabled]="completedCount() === 0"
            class="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Clear Completed ({{ completedCount() }})
          </button>
          <button
            (click)="clearAll()"
            class="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
        </div>
      }
    </div>
  `
})
export class AppComponent {
  todos = signal<Todo[]>([]);
  newTodoTitle = '';
  private nextId = 1;

  // Computed values
  totalCount = computed(() => this.todos().length);
  completedCount = computed(() => this.todos().filter(t => t.completed).length);

  addTodo(): void {
    const title = this.newTodoTitle.trim();
    if (!title) return;

    this.todos.update(current => [...current, {
      id: this.nextId++,
      title,
      completed: false
    }]);

    this.newTodoTitle = '';
  }

  toggleTodo(id: number): void {
    this.todos.update(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  deleteTodo(id: number): void {
    this.todos.update(current =>
      current.filter(todo => todo.id !== id)
    );
  }

  clearCompleted(): void {
    this.todos.update(current =>
      current.filter(todo => !todo.completed)
    );
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear all todos?')) {
      this.todos.set([]);
      this.nextId = 1;
    }
  }
}
```

---

<div align="center">
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a>
</div>
