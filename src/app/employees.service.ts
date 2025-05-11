// employees.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  title: string;
  price: number;
  weight: number;
  // any other properties
}

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private api = 'http://localhost:3000/products';
  constructor(private http: HttpClient) { }

  fetchAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.api);
  }

  patch(id: number, data: Partial<Employee>) {
    return this.http.put(`${this.api}/${id}`, data);
  }
}
