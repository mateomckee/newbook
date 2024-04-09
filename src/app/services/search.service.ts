import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ItemData } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchAPI_URL = 'https://newbook-functions.vercel.app/api/search';
  inputQuery = '';
  public onChangeSearchResult: EventEmitter<any> = new EventEmitter<any>();
  public isLoading: boolean = false;
  private isSearchOnCooldown = false;
  private cooldownTimeMS = 5000;
  public isError: boolean = false;
  private searchInProgress = false;

  constructor(private http: HttpClient, private router: Router) { }

  public resetSearchResults(): void {
    this.onChangeSearchResult.emit(null);
    this.isError = false;
  }

  public onSearch(query: string): void {
    if (!query) return;
    this.isError = false;
    this.isLoading = true;
    this.search(query).subscribe(
      searchResult => {
        this.isLoading = false;
        if (!searchResult) {
          this.isError = true;
        }
        this.onChangeSearchResult.emit(searchResult);
        this.router.navigate(['/results'], { queryParams: { q: query } });
      },
      error => {
        this.isError = true;
        this.isLoading = false;
        console.error('An error occurred during the search:', error);
      }
    );
  }

  public search(searchQuery: string): Observable<ItemData[]> {
    if (!searchQuery) {
      // Return an empty array if the search query is empty
      return of([]);
    }
  
    if (this.searchInProgress) {
      return throwError('Search in progress');
    }
  
    /* to test error page delete for final version */
    if (searchQuery.toLowerCase() === 'error') {
      return throwError('Simulated error for testing');
    }
  
    this.searchInProgress = true;
    this.isLoading = true;
    this.isError = false;
    console.log("Beginning search for", searchQuery);
  
    const url = `${this.searchAPI_URL}?q=${encodeURIComponent(searchQuery)}`;
    const headers = new HttpHeaders();
  
    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        if (response && response.data && Array.isArray(response.data)) {
          return response.data.map((item: any) => ({
            crn: item.crn,
            semester: item.semester,
            section: item.section,
            courselabel: item.courselabel,
            coursetitle: item.coursetitle,
            instructor: item.instructor,
            inseval: item.inseval,
            insevalstudentnum: item.insevalstudentnum,
            creval: item.creval,
            crevalstudentnum: item.crevalstudentnum,
            enrollment: item.enrollment,
            description: item.description,
            timestamp: item.timestamp
          }));
        } else {
          throw new Error('Invalid response data');
        }
      }),
      catchError(error => {
        console.error('An error occurred during the search:', error);
        return throwError(error);
      }),
      map((items: ItemData[]) => {
        this.searchInProgress = false;
        this.isLoading = false;
        return items;
      }),
      catchError(error => {
        this.searchInProgress = false;
        this.isLoading = false;
        this.isError = true;
        return throwError(error);
      })
    );
  }

  private setSearchCooldown() {
    this.isSearchOnCooldown = true;
    setTimeout(() => {
      this.isSearchOnCooldown = false;
    }, this.cooldownTimeMS);
  }
}
