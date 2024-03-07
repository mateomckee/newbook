import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
export class ResultsComponent implements OnInit {
  imageUrl = 'assets/images/UTSA_Logo.png';
  currentPage = 1;
  pagesToShow = 3; // The number of page links to show at any time
  maxPages = 10; // Static value for testing purposes
  results: Result[] = []; // This will hold the results for the current page
  searchQuery: string = ''; // Holds the current search query

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.currentPage = parseInt(params['page'], 10) || 1;
      this.loadResults();
    });
  }

  onSearch(searchTerm: string) {
    console.trace('Where is this being called from?', searchTerm);
    this.router.navigate(['/results'], { queryParams: { search: searchTerm, page: 1 } });
  }
  
  loadResults() {
    const resultsPerPage = 5;
    const startIndex = (this.currentPage - 1) * resultsPerPage;
    this.results = Array.from({ length: resultsPerPage }, (_, i) => ({
      title: `${this.searchQuery} Result`, 
      id: startIndex + i + 1, 
      text: `${this.searchQuery} Blah Blah Blah # ${startIndex + i + 1}`
    }));

    // If we're on the last page, adjust the results count
    if (this.currentPage === this.maxPages) {
      this.results = this.results.filter(result => result.id <= 47); // Adjust this to your total results
    }
  }

  navigateToPage(pageNumber: number) {
    this.router.navigate(['/results'], { queryParams: { search: this.searchQuery, page: pageNumber } });
    //Scroll to the top of the page every time you click on a new page, just uncoomment/comment next line to test it out
    window.scrollTo(0, 0);
  }

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

  navigateToFirstPage() {
    this.navigateToPage(1);
  }

  navigateToLastPage() {
    this.navigateToPage(this.maxPages);
  }
}