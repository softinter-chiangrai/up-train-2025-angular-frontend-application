import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:8000'; // JSON Server หรือ Backend API URL

  constructor(private http: HttpClient) {}

  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // ============================================
  // GET: ดึง Todos ทั้งหมด
  // ============================================
  getTodos(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.get<any>(`${this.apiUrl}/todos`, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    );
  }


  // ============================================
  // GET: ดึง Todo ตาม ID
  // ============================================
  getTodoById(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.get<any>(`${this.apiUrl}/todos/${id}`, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    )
  }


  // ============================================
  // POST: สร้าง Todo ใหม่
  // ============================================
  createTodo(todo: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.post<any>(`${this.apiUrl}/todos`, todo, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    )
  }


  // ============================================
  // PUT: อัปเดต Todo
  // ============================================
  updateTodo(id: number, updateData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.put<any>(`${this.apiUrl}/todos/${id}`, updateData, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    );
  }


  // ============================================
  // PATCH: Toggle Todo completed status
  // ============================================
  toggleTodo(id: number, completed: boolean): Observable<any> {
    let data = {
      'completed': completed
    }
    return this.http.put<any>(`${this.apiUrl}/todos/${id}`, data).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    )
  }


  // ============================================
  // DELETE: ลบ Todo
  // ============================================
  deleteTodo(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'response',
      params: new HttpParams()
    };

    return this.http.delete<any>(`${this.apiUrl}/todos/${id}`, httpOptions).pipe(
      map((affectRows: any) => {
        return affectRows;
      })
    );
  }

}
