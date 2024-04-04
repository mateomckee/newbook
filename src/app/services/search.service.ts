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

  constructor(private http: HttpClient, private router: Router) { }

  public onSearch(): void {
    if (this.inputQuery == '') return;
    if (this.isSearchOnCooldown) return;

    if (this.router.url != '/results') {
      this.router.navigate(['/results']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.setSearchCooldown();
    this.isLoading = true;

    const searchQuery = this.inputQuery;

    this.search(searchQuery, {})
      .then(searchResult => {
        this.isLoading = false;

        this.searchResult = searchResult;
        this.onChangeSearchResult.emit(this.searchResult);

        console.log(this.searchResult);
      })
      .catch(error => {
        this.isLoading = false;
        console.error('An error occurred during the search:', error);
        throw new Error('An error occurred during the search.');
      });
  }

  public async search(searchQuery: string, filters: any): Promise<ItemData[] | null> {
    console.log("Beginning search for", searchQuery);

    // Simulating an error for testing purposes
     if (searchQuery.toLowerCase() === 'error') {
      throw new Error('Simulated error for testing');
    }

    const url = new URL(`${this.searchAPI_URL}`);
  
    if (searchQuery) {
      url.searchParams.append('q', searchQuery);
    }
  
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        url.searchParams.append(key, filters[key]);
      }
    });

    const headers = new HttpHeaders();
    
    try {
      const response: any = await this.http.get<any>(url.toString(), { headers }).toPromise();
      if (response && response.data && Array.isArray(response.data)) {
        const itemData: ItemData[] = response.data.map((item: any) => ({
          crn: item.crn,
          semester: item.semester,
          courselabel: item.courselabel,
          instructor: item.instructor,
          coursetitle: item.coursetitle,
          inseval: item.inseval,
          insevalstudentnum: item.insevalstudentnum,
          creval: item.creval,
          crevalstudentnum: item.crevalstudentnum,
          enrollment: item.enrollment,
          description: item.description,
          timestamp: item.timestamp
        }));
        return itemData;
      } else {
        console.error('Unexpected response format:', response);
        return null;
      }
    } catch (error) {
      console.error("An error occurred during the search.", error);
      throw error;
    }
  }

  private setSearchCooldown() {
    this.isSearchOnCooldown = true;
    setTimeout(() => {
      this.isSearchOnCooldown = false;
    }, this.cooldownTimeMS);
  }
}
