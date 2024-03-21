import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../services/search.service';

interface Result {
  title: string;
  id: number;
  text: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {
  results: Result[] = [];
  currentPage = 1;
  pagesToShow = 3;// The number of page links to show at any time
  maxPages = 10; // Static value for testing purposes
  searchQuery = ''; // Holds the current search input value
  private searchSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchService.searchObservable.subscribe(searchTerm => {
      this.searchQuery = searchTerm;
      this.loadResults();
    });

    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadResults();
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearch(searchTerm: string) {
    this.router.navigate(['/results'], { queryParams: { search: searchTerm, page: 1 } });
  }

  loadResults() {
    const resultsPerPage = 5;
    const startIndex = (this.currentPage - 1) * resultsPerPage;
    this.results = Array.from({ length: resultsPerPage }, (_, i) => ({
      title: `${this.searchQuery} Result ${startIndex + i + 1}`, 
      id: startIndex + i + 1, 
      text: `Blah Blah Blah ${this.searchQuery} # ${startIndex + i + 1}`
    }));

    if (this.currentPage === this.maxPages) {
      this.results = this.results.filter(result => result.id <= 47); // Adjust this to your total results
    }
  }
  
  /////////////////////////// PAGINATION /////////////////////////////////
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
    this.loadResults();
    window.scrollTo(0, 0);
  }
}
