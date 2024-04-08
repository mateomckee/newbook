import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { subjects } from 'src/app/interfaces/auto-complete';

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

  constructor(public searchService: SearchService) { }

  ngOnInit() { }

  onInputFocus(): void {
    this.isFocused = true;
  }

  onInputBlur(): void {
    this.isFocused = false;
  }

  onSearch(): void {
    this.searchService.onSearch(this.inputQuery.trim());
    this.isFocused = false;
    this.filteredSubjects = [];
  }

  filterSubjects(): void {
    this.isFocused = !!this.inputQuery;
    this.filteredSubjects = this.inputQuery ? subjects.filter(subject =>
      subject.toLowerCase().includes(this.inputQuery.toLowerCase())
    ) : [];
  }

  selectSubject(subject: string): void {
    this.inputQuery = subject;
    this.isFocused = false;
    this.filteredSubjects = [];
  }
}