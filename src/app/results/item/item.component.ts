import { Component, Input, HostListener } from '@angular/core';
import { ItemData } from 'src/app/interfaces/item.interface';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() data = {} as ItemData;
  @Input() isSelected: boolean = false;
  showInstructor: boolean = true;

  constructor() {
    // Call checkScreenSize when the component is created to set the initial state
    this.checkScreenSize(window.innerWidth);
  }

  @HostListener('window:resize')
  onResize() {
    // Call checkScreenSize when the window is resized
    this.checkScreenSize(window.innerWidth);
  }

  private checkScreenSize(width: number) {
    this.showInstructor = (width > 500 && width <= 768) || width > 950;
  }
}
