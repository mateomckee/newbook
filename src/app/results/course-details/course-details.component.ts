import { Component, Input } from '@angular/core';
import { ItemData } from 'src/app/interfaces/item.interface';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {
  @Input() course: ItemData | null = null;
}