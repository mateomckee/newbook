import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');
  public searchObservable = this.searchSubject.asObservable();

  constructor() { }

  performSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
