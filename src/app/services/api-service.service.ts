import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> { 
    const loginData = { email, password };
    return this.http.post<any>('http://localhost:5238/api/auth/login', loginData);
  }
  
}
