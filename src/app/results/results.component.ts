import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemData } from '../interfaces/item.interface';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  items: ItemData[] = []; // All items received from search API, cached here for later use
  displayItems: ItemData[] = []; // Items that are displayed on the page
  currentPage: number = 1;
  pagesToShow: number = 3;
  maxPages: number = 10;
  itemsPerPage: number = 10;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private searchService: SearchService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const searchQuery = params['q'];
      if (searchQuery) {
        this.isLoading = true; 
        this.currentPage = 1;
        this.searchService.search(searchQuery).then(results => {
          this.isLoading = false;
          if (results) {
            this.items = results;
            console.log('Items after search:', this.items);
            this.maxPages = Math.ceil(this.items.length / this.itemsPerPage);
            this.updateDisplayItems();
          } else {
            this.items = [];
            console.log('No items found');
          }
        });
      }
    });
  
    this.searchService.onChangeSearchResult.subscribe((newSearchResult: ItemData[]) => {
      this.items = newSearchResult;
      this.updateDisplayItems();
    });
  }

  private updateDisplayItems(): void {
    if (!this.items || this.items.length === 0) {
      console.log('No items to display');
      this.displayItems = [];
      return;
    }
  
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayItems = this.items.slice(startIndex, endIndex);
    console.log('Display items:', this.displayItems);
  }
  

  get paginationArray(): number[] {
    const paginationStart = Math.max(1, this.currentPage - Math.floor(this.pagesToShow / 2));
    const paginationEnd = Math.min(paginationStart + this.pagesToShow - 1, this.maxPages);

    const paginationArray: number[] = [];
    for (let i = paginationStart; i <= paginationEnd; i++) {
      paginationArray.push(i);
    }
    return paginationArray;
  }

  navigateToFirstPage(): void {
    this.navigateToPage(1);
  }

  navigateToPreviousPage(): void {
    this.navigateToPage(Math.max(1, this.currentPage - 1));
  }

  navigateToNextPage(): void {
    this.navigateToPage(Math.min(this.maxPages, this.currentPage + 1));
  }

  navigateToLastPage(): void {
    this.navigateToPage(this.maxPages);
  }

  navigateToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updateDisplayItems();
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.searchService.onChangeSearchResult.unsubscribe();
  }
}
