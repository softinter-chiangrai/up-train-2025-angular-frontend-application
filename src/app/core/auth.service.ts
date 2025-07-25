import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    const token = localStorage.getItem('access_token') || 'temp';
    console.log('[AuthService] getToken():', token);
    return token;
  }
}
