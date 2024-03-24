import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() isHomePage: boolean = true;
  @Input() searchPrompt: string = 'Get Started By Searching...';

  constructor(
    public searchService: SearchService, 
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const searchQuery = params['q'];
      if (searchQuery) {
        this.searchService.inputQuery = searchQuery;
        this.searchService.onSearch();
      }
    });
  }

  onSearch(): void {
    if (this.searchService.inputQuery) {
      this.router.navigate(['/results'], { queryParams: { q: this.searchService.inputQuery } });
    }
  }
}
