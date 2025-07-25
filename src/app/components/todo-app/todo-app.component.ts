import { Component, computed, signal } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  templateUrl: './todo-app.component.html',
  styleUrl: './todo-app.component.css'
})
export class TodoAppComponent {
  // Component State using Signals
  private _todos = signal<Todo[]>([
    {
      id: 1, 
      title: 'Learn Angular 18', 
      completed: false,
      createdAt: new Date('2025-01-01T10:00:00')
    },
    { 
      id: 2, 
      title: 'Learn Tailwind CSS', 
      completed: true,
      createdAt: new Date('2025-01-01T11:00:00')
    },
    { 
      id: 3, 
      title: 'Build Todo App', 
      completed: false,
      createdAt: new Date('2025-01-01T12:00:00')
    }
  ]);

  private _nextId = 4;

  // Public readonly signals
  todos = this._todos.asReadonly();

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
      id: this._nextId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };

    this._todos.update(current => [...current, newTodo]);
  }

  onToggleTodo(id: number): void {
    this._todos.update(current =>
      current.map(todo =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed } 
          : todo
      )
    );
  }

  onDeleteTodo(id: number): void {
    this._todos.update(current =>
      current.filter(todo => todo.id !== id)
    );
  }

  onClearCompleted(): void {
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

}
