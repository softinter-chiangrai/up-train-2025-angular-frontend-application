import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Todo, UpdateTodoRequest } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
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

  get checkboxClasse(): string {
    return this.todo.completed 
      ? 'bg-blue-500 border-blue-500' 
      : 'border-gray-300 hover:border-blue-400';
  }

  get titleClasses(): string {
    return this.todo.completed
      ? 'line-through text-gray-500'
      : 'text-gray-900';
  }

  get priorityClass(): string {
    // TODO: เพิ่ม priority logic ในอนาคต
    return '';
  }

  // TODO: สร้าง method สำหรับ toggle completion ด้วย HTTP service
  onToggle(): void {
    if (this.isLoading() || !this.todo.id) return;

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
    if (this.isLoading() || !this.todo.id) return;

    const confirmed = confirm(`Delete "${this.todo.title}"?`);
    if (!confirmed) return;

    this.todoService.deleteTodo(this.todo.id).subscribe({
      next: () => {
        this.todoDeleted.emit(this.todo.id!);
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
    if (!this.editTitle.trim() || this.isLoading() || !this.todo.id) return;

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

