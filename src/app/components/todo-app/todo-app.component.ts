import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, DatePipe],
  templateUrl: './todo-app.component.html',
  styleUrl: './todo-app.component.css'
})
export class TodoAppComponent implements OnInit, OnDestroy {

  private readonly todoService = inject(TodoService);
  private subscriptions = new Subscription();

  private _todos = signal<Todo[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  todos = this._todos.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  // Computed Signals
  readonly completedCount = signal(0);
  readonly pendingCount = signal(0);

  private _nextId = 4;

  ngOnInit(): void {
    this.loadTodos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTodos(): void {
    console.log('🔄 Loading todos from API...');
    
    this._isLoading.set(true);
    this._error.set(null);
    
    const subscription = this.todoService.getTodos().subscribe({
      next: (response) => {
        // ถ้า response มีโครงสร้างพิเศษ ให้แปลงก่อน
        const todos = response.body || response; // ขึ้นอยู่กับ API structure
        this._todos.set(todos);
        console.log('✅ Loaded', todos.length, 'todos');
      },
      error: (error) => {
        console.error('❌ Failed to load todos:', error);
        this._error.set('Failed to load todos. Please try again.');
      },
      complete: () => {
        this._isLoading.set(false);
      }
    });
    
    this.subscriptions.add(subscription);
  }

  refreshTodos(): void {
    console.log('🔄 Refreshing todos...');
    this.loadTodos();
  }

  // Computed Signals for Statistics
  totalTodos = computed(() => this._todos().length);
  completedTodos = computed(() =>
    this._todos().filter(todo => todo.completed).length
  );
  pendingTodos = computed(() =>
    this._todos().filter(todo => !todo.completed).length
  );

  // Event Handlers

  onTodoAdded(title: string): void {
    if (!title.trim()) return;

    const newTodo: Todo = {
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };

    this.todoService.createTodo(newTodo).subscribe({
      next: (response) => {
        this._todos.update(current => [...current, response]);
        this.loadTodos();
        this.updateCounts();
      }, 
      error: (error) => {
        console.error('❌ Failed to create todo:', error);
        this._error.set('Failed to create todo. Please try again.');
      }
    });
  }

  onToggleTodo(id: number): void {
    const todo = this.todos().find(t => t.id === id);
    if (!todo) return;

    this.todoService.toggleTodo(id, !todo.completed).subscribe({
      next: (updateTodo) => {
        // Update local state
        console.log(updateTodo);
        this._todos.update(current =>
          current.map(t => t.id === id ? updateTodo : t)
        );
        this.loadTodos();
        this.updateCounts();
      },
      error: (error) => {
        console.error('Failed to toggle todo:', error);
      }
    });
  }

  onDeleteTodo(id: number): void {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        // Remove from local state
        this._todos.update(current => current.filter(t => t.id !== id));
        this.updateCounts();
      },
      error: (error) => {
        console.error('Failed to delete todo:', error);
      }
    });
  }

  onClearCompleted(): void {
    if (!confirm('Are you sure you want to delete all completed todos?')) {
      return;
    }
    
    this._todos.update(current =>
      current.filter(todo => !todo.completed)
    );
  }

  onClearAll(): void {
    if (confirm('Are you sure you want to clear all todos?')) {
      this._todos.set([]);
      this._nextId = 1;
    }
  }

  onRefresh(): void {
    this.loadTodos();
  }

  private updateCounts(): void {
    const todos = this.todos();
    const completed = todos.filter(t => t.completed).length;
    const pending = todos.filter(t => !t.completed).length;

    this.completedCount.set(completed);
    this.pendingCount.set(pending);
  }

  getStatusText(): string {
    if (this.isLoading()) return 'Loading...';
    if (this.error()) return 'Error occurred';
    if (this.totalTodos() === 0) return 'No todos';
    return `${this.completedTodos()}/${this.totalTodos()} completed`;
  }

  canPerformActions(): boolean {
    // TODO: สร้าง helper method ตรวจสอบว่าสามารถทำ actions ได้หรือไม่
    return !this.isLoading() && !this.error();
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

}
