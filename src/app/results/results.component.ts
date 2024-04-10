import { Component, OnInit } from '@angular/core';
import { ItemData } from '../interfaces/item.interface';
import { SearchService } from '../services/search.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  items: ItemData[] = [];
  displayItems: ItemData[] = [];
  currentPage: number = 1;
  pagesToShow: number = 3;
  maxPages: number = 10;
  itemsPerPage: number = 50;
  selectedCourse: ItemData | null = null;

  errorMessage: string = '';

  constructor(
    public searchService: SearchService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.searchService.onSearch(query);
      }
    });
  
    this.searchService.onChangeSearchResult.subscribe((newItems: ItemData[]) => {
      this.currentPage = 1;
      this.items = newItems;
      this.maxPages = Math.ceil(this.items.length / this.itemsPerPage);
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

    if (this.displayItems.length > 0) {
      this.selectCourse(this.displayItems[0]);
    }
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

    if (this.displayItems.length > 0) {
      this.selectedCourse = this.displayItems[0];
    }
  }

  selectCourse(course: ItemData) {
    if (this.selectedCourse !== course) {
      this.selectedCourse = course;
    }
  }

  ngOnDestroy() {
    this.searchService.onChangeSearchResult.unsubscribe();
  }
}
