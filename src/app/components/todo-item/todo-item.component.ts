import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggleCompleted = new EventEmitter<number>();
  @Output() deleteClicked = new EventEmitter<number>();

  get checkboxClasses(): string {
    return this.todo.completed
      ? 'bg-green-500 border-green-500'
      : 'border-gray-300 hover:border-blue-500';
  }

  get titleClasses(): string {
    return this.todo.completed
      ? 'text-gray-500 line-through'
      : 'text-gray-800';
  }

  onToggle() {
    this.toggleCompleted.emit(this.todo.id);
  }

  onDelete() {
    if (confirm(`Are you sure you want to delete "${this.todo.title}"?`)) {
      this.deleteClicked.emit(this.todo.id);
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

}
