import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';
import { subjects } from 'src/app/interfaces/auto-complete';

interface FilterOptions {
  instructor: boolean;
  crn: boolean;
  // Add more filter options as needed
}

interface FilterValues {
  instructor: string;
  crn: string;
  // Add more filter values as needed
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  inputQuery: string = '';
  placeholder: string = 'Search; e.g. CS 1714 Fall 2023 Samuel Ang';

  filteredSubjects: string[] = [];
  isFocused: boolean = false;

  filterOptions: FilterOptions = {
    instructor: false,
    crn: false,
    // Initialize more filter options as needed
  };

  filterValues: FilterValues = {
    instructor: '',
    crn: '',
    // Initialize more filter values as needed
  };

  constructor(
    public searchService: SearchService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const searchQuery = params['q'];
      if (searchQuery) {
        this.inputQuery = searchQuery;
        this.onSearch();
      }
    });
  }

  onInputFocus(): void {
    this.isFocused = true;
  }

  onInputBlur(): void {
    this.isFocused = false;
  }

  onSearch(): void {
    const filters: { [key: string]: string } = {};
    const optionsKeys = Object.keys(this.filterOptions) as Array<keyof FilterOptions>;
    optionsKeys.forEach(key => {
      if (this.filterOptions[key] && this.filterValues[key]) {
        filters[key] = this.filterValues[key];
      }
    });

    this.router.navigate(['/results'], {
      queryParams: { q: this.inputQuery.trim(), ...filters }
    });

    this.isFocused = false;
    this.filteredSubjects = [];
  }


  filterSubjects(): void {
    this.isFocused = !!this.inputQuery;
    this.filteredSubjects = this.inputQuery ?
      subjects.filter(subject =>
        subject.toLowerCase().includes(this.inputQuery.toLowerCase())
      ) : [];
  }

  selectSubject(subject: string): void {
    this.inputQuery = subject;
    this.isFocused = false;
    this.filteredSubjects = [];
  }
}
