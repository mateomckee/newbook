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
  pagesToShow = 3; // the number of page links to show at any time
  maxPages = 10; // Static value for testing purposes
  results: Result[] = []; // This will hold the results for the current page

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.loadResults();
    });
  }

  loadResults() {
    const resultsPerPage = 5;
    const startIndex = (this.currentPage - 1) * resultsPerPage;
    this.results = Array.from({ length: resultsPerPage }, (_, i) => ({
      title: `Result `, 
      id: startIndex + i + 1, 
      text: `Blah Blah Blah # ${startIndex + i + 1}`
    }));

    if (this.currentPage === this.maxPages) {
      this.results = this.results.filter(result => result.id <= 47); // 13 is a static value for testing purposes
    }
  }

  navigateToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.maxPages) {
      // Update the currentPage without routing to a new URL
      this.currentPage = pageNumber;
      this.loadResults();
      // Optional: Scroll to the top of the page every time you click on a new page, just uncoomment next line to test it out
      //window.scrollTo(0, 0);
    }
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
