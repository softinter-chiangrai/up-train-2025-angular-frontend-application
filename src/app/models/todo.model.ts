export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoFormData {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

