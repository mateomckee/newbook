import { Component, Input } from '@angular/core';
import { ItemData } from 'src/app/interfaces/item.interface';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() data = {} as ItemData;
}
