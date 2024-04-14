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
  private cooldownTimeMS = 2000;

  constructor(private http: HttpClient, private router: Router) { }

  public onSearch(query: string): void {
    if (query == "" || !query) return;
    if (this.isSearchOnCooldown) return;

    this.router.navigate(['/results'], { queryParams: { q: query } });

    if (this.router.url === '/results') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.setSearchCooldown();
    this.isLoading = true;

    // Begin search
    this.search(query).subscribe(
      searchResult => {
        if (!searchResult) searchResult = [];
        this.onChangeSearchResult.emit(searchResult);
        this.isLoading = false;
      },
      error => {
        console.error('onSearch: An error occurred during the search:', error);
        this.onChangeSearchResult.emit(null);
        this.isLoading = false;
      }
    );
  }

  public search(searchQuery: string): Observable<ItemData[]> {
    if (!searchQuery) {
      return of([]);
    }

    console.log("Beginning search for", searchQuery);

    const url = `${this.searchAPI_URL}?q=${encodeURIComponent(searchQuery)}`;
    const headers = new HttpHeaders();

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        if (response && response.data && Array.isArray(response.data)) {
          return response.data.map((item: any, index: number) => ({
            index: index + 1,
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
        throw new Error(error);
      }),
      map((items: ItemData[]) => {
        return items;
      }),
      catchError(error => {
        throw new Error(error);
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
