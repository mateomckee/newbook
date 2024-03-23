import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() isHomePage: boolean = true;
  @Input() searchPrompt: string = 'Get Started By Searching...';

  constructor(public searchService: SearchService) { }
}

