import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<string>();

  todoForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      this.isSubmitting = true;

      const title = this.todoForm.get('title')?.value;

      // Simulate loading delay
      setTimeout(() => {
        this.todoAdded.emit(title);
        this.todoForm.reset();
        this.isSubmitting = false;
      }, 500);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }


}
