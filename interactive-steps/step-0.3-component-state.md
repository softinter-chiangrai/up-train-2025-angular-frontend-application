# Step 0.3: Component State ด้วย Signals

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การใช้ **Angular Signals** สำหรับจัดการ Component State

---

## 📚 สิ่งที่จะได้เรียนรู้
- Angular Signals (ใหม่ใน Angular 18)
- Reactive State Management
- signal(), computed()
- State Updates

---

## 📋 Prerequisites
- ✅ Step 0.1 เสร็จแล้ว (Todo Model Interface)
- ✅ Step 0.2 เสร็จแล้ว (Basic Component)
- ✅ Step 3.1 เสร็จแล้ว (HTTP Service Setup)
- ✅ มี Backend API running ที่ http://localhost:8000

---

## 📝 Task: เพิ่ม Signals ใน TodoApp Component

### 1. Import Todo Model และ Signals

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.ts`:

```typescript
import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../models/todo.model';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent implements OnInit, OnDestroy {
  // TODO: Inject TodoService และสร้าง subscription management
  private readonly todoService = inject(TodoService);
  private subscriptions = new Subscription();

  // TODO: สร้าง signal สำหรับเก็บรายการ todos (เริ่มต้นเป็น array ว่าง)
  private _todos = signal<Todo[]>([]);

  // TODO: สร้าง readonly signal สำหรับให้ template ใช้
  todos = this._todos.asReadonly();

  // TODO: สร้าง computed signal สำหรับนับจำนวน total todos
  totalTodos = computed(() => {
    return this._todos().length;
  });

  // TODO: สร้าง computed signal สำหรับนับจำนวน completed todos
  completedTodos = computed(() => {
    return this._todos().filter(todo => todo.completed).length;
  });

  // TODO: สร้าง computed signal สำหรับนับจำนวน pending todos
  pendingTodos = computed(() => {
    return this._todos().filter(todo => !todo.completed).length;
  });

  // Service State Access
  readonly isLoading = this.todoService.isLoading;
  readonly error = this.todoService.error;

  ngOnInit(): void {
    // TODO: โหลด todos เมื่อ component เริ่มต้น
    this.loadTodos();
  }

  ngOnDestroy(): void {
    // TODO: cleanup subscriptions
    this.subscriptions.unsubscribe();
  }

  // TODO: สร้าง method สำหรับโหลด todos จาก HTTP service
  loadTodos(): void {
    const subscription = this.todoService.getTodos().subscribe({
      next: (todos) => {
        this._todos.set(todos);
      },
      error: (error) => {
        console.error('Failed to load todos:', error);
      }
    });
    this.subscriptions.add(subscription);
  }

  // TODO: สร้าง method สำหรับ toggle todo status
  toggleTodo(id: number): void {
    const todo = this._todos().find(t => t.id === id);
    if (todo) {
      const updateData: UpdateTodoRequest = { completed: !todo.completed };
      
      const subscription = this.todoService.updateTodo(id, updateData).subscribe({
        next: (updatedTodo) => {
          this._todos.update(todos => 
            todos.map(t => t.id === id ? updatedTodo : t)
          );
        },
        error: (error) => {
          console.error('Failed to toggle todo:', error);
        }
      });
      this.subscriptions.add(subscription);
    }
  }

  // TODO: สร้าง method สำหรับเพิ่ม todo ใหม่
  addTodo(title: string): void {
    if (!title.trim()) return;
    
    const todoData: CreateTodoRequest = { title: title.trim() };
    
    const subscription = this.todoService.createTodo(todoData).subscribe({
      next: (newTodo) => {
        this._todos.update(todos => [...todos, newTodo]);
      },
      error: (error) => {
        console.error('Failed to add todo:', error);
      }
    });
    this.subscriptions.add(subscription);
  }
}
```

### 2. แก้ไข Template เพื่อแสดง State

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.html`:

```html
<div class="todo-container">
  <!-- Header -->
  <div class="header">
    <h1>📝 Todo App with Signals</h1>
  </div>

  <!-- Statistics -->
  <div class="stats">
    <!-- TODO: แสดงสถิติ -->
    <!-- Total: {{ totalTodos() }} -->
    <!-- Completed: {{ completedTodos() }} -->
    <!-- Pending: {{ pendingTodos() }} -->
  </div>

  <!-- Add Todo Section -->
  <div class="add-section">
    <input 
      #todoInput 
      type="text" 
      placeholder="Enter new todo..."
      class="todo-input">
    <button 
      (click)="addTodo(todoInput.value); todoInput.value = ''"
      [disabled]="isLoading()"
      class="add-button">
      {{ isLoading() ? 'Adding...' : 'Add Todo' }}
    </button>
  </div>

  <!-- Loading & Error States -->
  <div class="status-messages">
    @if (isLoading()) {
      <div class="loading-message">🔄 Loading todos...</div>
    }
    @if (error()) {
      <div class="error-message">❌ {{ error() }}</div>
    }
  }

  <!-- Todo List -->
  <div class="todo-list">
    <!-- TODO: ใช้ @for loop เพื่อแสดงรายการ todos -->
    <!-- @for (todo of todos(); track todo.id) { -->
      <!-- แสดง todo item -->
    <!-- } -->
  </div>
</div>
```

### 3. เพิ่ม CSS สำหรับ Styling

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.css`:

```css
.todo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  color: #333;
  font-size: 24px;
}

.stats {
  /* TODO: เพิ่ม CSS สำหรับแสดงสถิติ */
  /* Display flex, gap, background, padding, border-radius */
}

.add-section {
  /* TODO: เพิ่ม CSS สำหรับ input section */
  /* Display flex, gap, margin-bottom */
}

.todo-input {
  /* TODO: เพิ่ม CSS สำหรับ input */
  /* Flex 1, padding, border, border-radius */
}

.add-button {
  /* TODO: เพิ่ม CSS สำหรับ button */
  /* Padding, background, color, border, border-radius, cursor */
}

.todo-list {
  /* TODO: เพิ่ม CSS สำหรับ todo list */
}

.todo-item {
  /* TODO: เพิ่ม CSS สำหรับแต่ละ todo item */
  /* Display flex, align-items, justify-content, padding, border, margin-bottom */
}

.todo-item.completed {
  /* TODO: เพิ่ม CSS สำหรับ completed todos */
  /* Opacity, text-decoration */
}
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Signals Working

ตรวจสอบใน Browser Console:
```typescript
// เปิด Developer Tools > Console
// ตรวจสอบว่าไม่มี errors
// ลองกด Add Todo และดูว่าสถิติเปลี่ยนไหม
```

### Test 2: Computed Signals

ตรวจสอบว่า:
- สถิติ Total/Completed/Pending อัปเดตอัตโนมัติ
- เมื่อ toggle todo สถิติเปลี่ยนตาม
- เมื่อเพิ่ม todo ใหม่ Total เพิ่มขึ้น

### Test 3: Template Binding

ตรวจสอบว่า:
- แสดงรายการ todos ได้
- กดปุ่ม Add Todo ทำงาน
- Toggle checkbox ทำงาน

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Working Signals

```typescript
export class TodoAppComponent implements OnInit, OnDestroy {
  private readonly todoService = inject(TodoService);
  private subscriptions = new Subscription();
  
  private _todos = signal<Todo[]>([]);
  todos = this._todos.asReadonly();

  totalTodos = computed(() => this._todos().length);
  completedTodos = computed(() => 
    this._todos().filter(todo => todo.completed).length
  );
  pendingTodos = computed(() => 
    this._todos().filter(todo => !todo.completed).length
  );

  readonly isLoading = this.todoService.isLoading;
  readonly error = this.todoService.error;

  ngOnInit(): void {
    this.loadTodos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTodos(): void {
    const subscription = this.todoService.getTodos().subscribe({
      next: (todos) => this._todos.set(todos),
      error: (error) => console.error('Failed to load todos:', error)
    });
    this.subscriptions.add(subscription);
  }

  toggleTodo(id: number): void {
    const todo = this._todos().find(t => t.id === id);
    if (todo) {
      const updateData = { completed: !todo.completed };
      const subscription = this.todoService.updateTodo(id, updateData).subscribe({
        next: (updatedTodo) => {
          this._todos.update(todos => 
            todos.map(t => t.id === id ? updatedTodo : t)
          );
        },
        error: (error) => console.error('Failed to toggle todo:', error)
      });
      this.subscriptions.add(subscription);
    }
  }

  addTodo(title: string): void {
    if (!title.trim()) return;
    const todoData = { title: title.trim() };
    const subscription = this.todoService.createTodo(todoData).subscribe({
      next: (newTodo) => this._todos.update(todos => [...todos, newTodo]),
      error: (error) => console.error('Failed to add todo:', error)
    });
    this.subscriptions.add(subscription);
  }

  // Methods implemented correctly...
}
```

### 2. Working Template

```html
<div class="stats">
  <div>Total: {{ totalTodos() }}</div>
  <div>Completed: {{ completedTodos() }}</div>
  <div>Pending: {{ pendingTodos() }}</div>
</div>

<!-- Todo List -->
@for (todo of todos(); track todo.id) {
  <div class="todo-item" [class.completed]="todo.completed">
    <input 
      type="checkbox" 
      [checked]="todo.completed"
      (change)="toggleTodo(todo.id)">
    <span>{{ todo.title }}</span>
  </div>
}
```

### 3. Interactive Features

- ✅ เพิ่ม todo ใหม่ได้
- ✅ Toggle completed status ได้
- ✅ สถิติอัปเดตอัตโนมัติ
- ✅ UI responsive และ smooth

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ HTTP Service Integration
- `inject()` สำหรับ dependency injection
- `TodoService` integration
- HTTP calls ด้วย `getTodos()`, `createTodo()`, `updateTodo()`
- Loading และ error state management

### ✅ Reactive Programming
- Automatic re-rendering
- Computed values
- State dependencies

### ✅ Component State Management
- Private vs public signals
- State encapsulation
- Clean state updates

### ✅ Template Syntax
- Signal binding `{{ signal() }}`
- Event binding `(click)`
- Control flow `@for`

---

## 🔧 Troubleshooting

### ❌ Error: "signal is not a function"
**Solution**: ตรวจสอบ import ให้ถูกต้อง
```typescript
import { Component, signal, computed } from '@angular/core';
```

### ❌ Computed ไม่ update
**Solution**: ใช้ `update()` แทน direct assignment
```typescript
// ❌ Wrong
this._todos()[0].completed = true;

// ✅ Correct
this._todos.update(todos => 
  todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
);
```

### ❌ Template ไม่แสดงข้อมูล
**Solution**: ตรวจสอบ signal call `{{ todos() }}` ไม่ใช่ `{{ todos }}`

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 1.1: Main Container Component](./step-1.1-main-container.md)

---

## 💡 เคล็ดลับ

1. **Signal Performance**: Signals มี performance ดีกว่า Zone.js
2. **Immutable Updates**: ใช้ spread operator `...` เพื่อสร้าง new state
3. **Computed Caching**: Computed signals จะ cache ผลลัพธ์
4. **Template Optimization**: ใช้ `track` ใน `@for` เพื่อ performance

---

**🎯 Goal Achieved**: เรียนรู้ Angular Signals สำหรับ State Management!
