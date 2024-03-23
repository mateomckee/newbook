import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  //API info
  private searchAPI_URL = 'https://newbook-functions.vercel.app/api/search';

  //input info
  inputQuery = '';

  //result info
  private searchResult: any;
  public onChangeSearchResult: EventEmitter<any> = new EventEmitter<any>();

  //control info
  public isLoading: boolean = false;
  private isSearchOnCooldown = false;
  private cooldownTimeMS = 5000;

  constructor(private http: HttpClient, private router: Router) { }

  //on search input
  public onSearch(): void {
    if (this.inputQuery == '') return;
    if (this.isSearchOnCooldown) return

    //navigate if necessary
    if (this.router.url != '/results') {
      this.router.navigate(['/results']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    //start cooldown
    this.setSearchCooldown();
    this.isLoading = true;

    //process user input here as needed
    const searchQuery = this.inputQuery;

    this.search(searchQuery)
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

  // main search function
  private async search(searchQuery: string): Promise<any> {
    console.log("Beginning search for", searchQuery);

    const url = `${this.searchAPI_URL}?q=${searchQuery}`;
    const headers = new HttpHeaders({ 'q': searchQuery });

    try {
      return await this.http.get(url, { headers }).toPromise();
    } catch (error) {
      console.error("An error occurred during the search.", error);
      throw new Error('An error occurred during the search.');
    }
  }

  private setSearchCooldown() {
    this.isSearchOnCooldown = true;
    setTimeout(() => {
      this.isSearchOnCooldown = false;
    }, this.cooldownTimeMS); // cooldown time in milliseconds
  }
}
