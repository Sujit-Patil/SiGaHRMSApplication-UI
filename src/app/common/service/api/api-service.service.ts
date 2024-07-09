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

  getAll(route: string) {
    return this.http.get<any>(`http://localhost:5238/api/${route}`);
  }

  get(route: string,id:number) {
    return this.http.get<any>(`http://localhost:5238/api/${route}/${id}`);
  }

  post(route: string,TimeSheetdata:any){
    return this.http.post<any>(`http://localhost:5238/api/${route}`,TimeSheetdata)
  }

  update(route: string,body:any){
    return this.http.put<any>(`http://localhost:5238/api/${route}`,body)
  }
  // ---------------------------------------------------------------------


  getUsingEmail(route: string,email:any) {
    return this.http.get<any>(`http://localhost:5238/api/${route}/getByEmail/${email}`,);
  }

  getByDate(route: string,body:any){
    return this.http.post<any>(`http://localhost:5238/api/${route}/ByDate`,body)
  }
  
}
