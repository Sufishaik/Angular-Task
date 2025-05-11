import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Employee, EmployeesService } from '../employees.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, HttpClientModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  sortKey: keyof Employee | '' = '';
  sortDir: 'asc' | 'desc' = 'asc';
  updateStatus = '';

  constructor(private svc: EmployeesService) { }

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.loading = true;
    this.svc.fetchAll().subscribe({
      next: data => { this.employees = data; this.loading = false; },
      error: err => { this.error = err.message; this.loading = false; }
    });
  }

  handleSort(key: keyof Employee) {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  get filteredEmployees(): Employee[] {
    let arr = [...this.employees];
    if (this.sortKey) {
      const key = this.sortKey;
      arr.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        let res = 0;
        if (aVal < bVal) res = -1;
        else if (aVal > bVal) res = 1;
        return this.sortDir === 'asc' ? res : -res;
      });
    }
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      arr = arr.filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.price.toString().includes(term) ||
        e.weight.toString().includes(term)
      );
    }
    return arr;
  }

  drop(event: CdkDragDrop<Employee[]>) {
    if (event.previousIndex === event.currentIndex) return;
    const prev = this.filteredEmployees[event.previousIndex];
    const curr = this.filteredEmployees[event.currentIndex];
    const { id: id1, ...fields1 } = prev;
    const { id: id2, ...fields2 } = curr;
    const upd1 = { id: id1, ...fields2 };
    const upd2 = { id: id2, ...fields1 };
    this.updateStatus = 'Updating positions...';
    Promise.all([
      this.svc.patch(id1, upd1).toPromise(),
      this.svc.patch(id2, upd2).toPromise()
    ]).then(() => {

      moveItemInArray(this.employees, this.employees.findIndex(x => x.id === id1), this.employees.findIndex(x => x.id === id2));
      this.employees = this.employees.map(e => e.id === id1 ? upd1 : e.id === id2 ? upd2 : e);
      this.updateStatus = 'Swapped successfully';
      this.fetchEmployees();
      setTimeout(() => this.updateStatus = '', 2000);
    }).catch(err => {
      console.error(err);
      this.updateStatus = 'Error updating';
    });
  }
}
