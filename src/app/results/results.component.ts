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
  maxPages = 3; // Static value for testing purposes
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
      this.results = this.results.filter(result => result.id <= 13); // 13 is a static value for testing purposes
    }
  }

  navigateToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.maxPages) {
      this.router.navigate(['/results', pageNumber]);
    }
  }
}
