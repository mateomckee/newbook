import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  searchQuery: string = '';

  // Inside SearchBarComponent
  onSearchSubmit(event: Event) {
    event.preventDefault(); // Stop the form from causing a page reload
    console.log('Search submitted:', this.searchQuery); // Add this to debug
    this.search.emit(this.searchQuery);
  }
}
