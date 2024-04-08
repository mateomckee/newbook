import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ItemData } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchAPI_URL = 'https://newbook-functions.vercel.app/api/search';
  inputQuery = '';
  private searchResult: any;
  public onChangeSearchResult: EventEmitter<any> = new EventEmitter<any>();
  public isLoading: boolean = false;
  private isSearchOnCooldown = false;
  private cooldownTimeMS = 5000;
  public isError: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  public resetSearchResults(): void {
    this.searchResult = null;
    this.isError = false;
  }

  public onSearch(query: string): void {
    if (!query) return;
    if (this.isSearchOnCooldown) return;
    this.isError = false;
    this.isLoading = true;
    this.search(query)
      .then(searchResult => {
        this.onChangeSearchResult.emit(searchResult);
        this.isLoading = false;
        if (!searchResult) {
          this.isError = true;
        }
      })
      .catch(error => {
        this.isError = true;
        this.isLoading = false;
        console.error('An error occurred during the search:', error);
      });
    if (this.router.url !== '/results') {
      this.router.navigate(['/results'], { queryParams: { q: query } });
    }
  }

  private searchInProgress = false;
  public async search(searchQuery: string): Promise<ItemData[] | null> {
    if (this.searchInProgress) {
      return null;
    }
    this.searchInProgress = true;
    this.isLoading = true;
    this.isError = false;
    console.log("Beginning search for", searchQuery);

  // Simulating an error for testing purposes REMOVE FOR FINAL VERSION
    if (searchQuery.toLowerCase() === 'error') {
      throw new Error('Simulated error for testing');
    }

    const url = new URL(`${this.searchAPI_URL}`);
    if (searchQuery) {
      url.searchParams.append('q', searchQuery);
    }

    const headers = new HttpHeaders();

    try {
      const response: any = await this.http.get<any>(url.toString(), { headers }).toPromise();
      if (response && response.data && Array.isArray(response.data)) {
        const itemData: ItemData[] = response.data.map((item: any) => ({
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
        this.searchInProgress = false;
        return itemData;
      } else {
        console.error('Unexpected response format:', response);
        this.searchInProgress = false;
        return null;
      }
    } catch (error) {
      console.error("An error occurred during the search.", error);
      this.isError = true;
      this.isLoading = false;
      return null;
    }
  }

  private setSearchCooldown() {
    this.isSearchOnCooldown = true;
    setTimeout(() => {
      this.isSearchOnCooldown = false;
    }, this.cooldownTimeMS);
  }
}