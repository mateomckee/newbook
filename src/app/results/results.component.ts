import { Component, EventEmitter, OnInit } from '@angular/core';
import { ItemData } from '../interfaces/item.interface';
import { SearchService } from '../services/search.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  items: ItemData[] | null = [];
  displayItems: ItemData[] | null = [];
  currentPage: number = 1;
  pagesToShow: number = 3;
  maxPages: number = 10;
  itemsPerPage: number = 50;
  selectedCourse: ItemData | null = null;

  errorMessage: string = 'An error occurred. Please try again.';

  public onSelectItem: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public searchService: SearchService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.searchService.onSearch(query);
      }
    });

    this.searchService.onChangeSearchResult.subscribe((newItems: ItemData[]) => {
      this.onChangeSearchResult(newItems);
    });
  }

  private onChangeSearchResult(newItems: ItemData[] | null) {
    if (newItems == null) {
      this.currentPage = 1;
      this.maxPages = 1;
      this.items = null;
      this.displayItems = null;
      this.selectedCourse = null;
      return;
    }

    this.currentPage = 1;
    this.items = newItems;
    this.maxPages = Math.ceil(this.items.length / this.itemsPerPage);
    this.updateDisplayItems();

    if (newItems.length === 0) {
      this.selectedCourse = null;
    }
  }

  private updateDisplayItems(): void {
    if (!this.items) return;
    if (this.items.length === 0) {
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
    let paginationArray: number[] = [];
    const maxPageToShow = Math.min(this.maxPages, 3); 
    let startPage = this.currentPage - 1 <= 0 ? 1 : this.currentPage - 1;
  
    if (startPage > this.maxPages - 2) {
      startPage = this.maxPages - 2 > 0 ? this.maxPages - 2 : 1;
    }
  
    for (let i = 0; i < 3; i++) { 
      paginationArray.push(startPage + i);
    }
  
    return paginationArray;
  }

  shouldDisablePage(page: number): boolean {
    return page > this.maxPages;
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

    if (this.displayItems && this.displayItems.length > 0) {
      this.selectedCourse = this.displayItems[0];
    }
  }

  selectCourse(course: ItemData) {
    if (this.selectedCourse !== course) {
      this.selectedCourse = course;
      this.onSelectItem.emit();
    }
  }

  ngOnDestroy() {
    this.searchService.onChangeSearchResult.unsubscribe();
  }
}
