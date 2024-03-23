import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { ItemData } from '../interfaces/item.interface'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {

  items: ItemData[] | undefined; //all items received from search API, cached here for later use
  displayItems: ItemData[] | undefined; //items that are displayed on the page

  currentSearchResult: any;

  //page info
  currentPage = 1;
  pagesToShow = 3;
  maxPages = 10;
  itemsPerPage = 10;

  constructor(
    private router: Router,
    private searchService: SearchService
  ) { }

  public onChangeSearchResultEvent(newSearchResult: any) {
    this.currentSearchResult = newSearchResult;
    this.cacheItems();
  }

  private cacheItems() {
    this.items = [];
    const responseItems = this.currentSearchResult.data;
    const numItems = responseItems.length;

    for (var i = 0; i < numItems; i++) {
      const currItem: ItemData = {
        index: 0,
        crn: 0,
        semester: '',
        courseLabel: '',
        courseTitle: '',
        instructor: '',
        description: '',
        enrollment: 0,
        instructorEval: 0,
        instructorEvalStudentNum: 0,
        courseEval: 0,
        courseEvalStudentNum: 0,
        timestamp: new Date()
      }

      //access data from search API
      currItem.index = i;
      currItem.crn = responseItems[i].crn;
      currItem.semester = responseItems[i].semester;
      currItem.courseLabel = responseItems[i].courselabel;
      currItem.courseTitle = responseItems[i].coursetitle;
      currItem.instructor = responseItems[i].instructor;
      currItem.description = responseItems[i].description;
      currItem.enrollment = responseItems[i].enrollment;
      currItem.instructorEval = responseItems[i].instructoreval;
      currItem.courseEval = responseItems[i].courseeval;
      currItem.courseEvalStudentNum = responseItems[i].courseevalstudentNum;
      currItem.instructorEvalStudentNum = responseItems[i].instructorevalstudentnum;
      currItem.timestamp = responseItems[i].timestamp;

      //hardcoded, temporary solution
      if (currItem.description.length >= 200) currItem.description = currItem.description.substring(0, 200) + "...";

      this.items.push(currItem);
    }
    this.maxPages = Math.floor((numItems + this.itemsPerPage - 1) / this.itemsPerPage);
    this.loadDisplayItems();
  }

  private loadDisplayItems() {
    //error case
    if (this.currentPage < 0) {
      this.navigateToPage(0);
      return;
    }

    const lowIndex = ((this.currentPage - 1) * this.itemsPerPage) + 1;
    const highIndex = lowIndex + this.itemsPerPage;

    this.displayItems = this.items?.slice(lowIndex, highIndex);
  }

  //#region Pagination

  get paginationArray() {
    const halfWay = Math.ceil(this.pagesToShow / 2);
    const isStart = this.currentPage <= halfWay;
    const isEnd = this.maxPages - halfWay < this.currentPage;
    const isMiddle = !isStart && !isEnd;

    let start = 1;
    if (isMiddle) {
      start = this.currentPage - halfWay + 1;
    } else if (isEnd) {
      start = this.maxPages - this.pagesToShow + 1;
    }

    return Array.from({ length: Math.min(this.pagesToShow, this.maxPages) }, (_, index) => start + index);
  }

  navigateToFirstPage(): void {
    this.navigateToPage(1);
  }

  navigateToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.navigateToPage(this.currentPage - 1);
    }
  }

  navigateToNextPage(): void {
    if (this.currentPage < this.maxPages) {
      this.navigateToPage(this.currentPage + 1);
    }
  }

  navigateToLastPage(): void {
    this.navigateToPage(this.maxPages);
  }

  navigateToPage(page: number): void {
    this.currentPage = page;
    this.router.navigate(['/results'], { queryParams: { page: page } });
    this.loadDisplayItems();
    window.scrollTo(0, 0);
  }

  //#endregion

  ngOnInit() {
    this.searchService.onChangeSearchResult.subscribe((newSearchResult) => {
      this.onChangeSearchResultEvent(newSearchResult);
    });
  }

  ngOnDestroy() {
  }
}
