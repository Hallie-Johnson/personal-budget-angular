import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private budgetDataSubject = new BehaviorSubject<any[]>([]);
  budgetData$: Observable<any[]> = this.budgetDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchBudgetData() {
    if (this.budgetDataSubject.getValue().length === 0) {
      this.http.get('http://localhost:3000/budget').subscribe((res: any) => {
        this.budgetDataSubject.next(res.myBudget);
      });
    }
  }
}
