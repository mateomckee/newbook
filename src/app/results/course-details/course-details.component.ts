import { Component, Input } from '@angular/core';
import { ItemData } from 'src/app/interfaces/item.interface';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {
  @Input() course: ItemData | null = null;

  getStrokeDashArray(score: number | null | undefined): number {
    const circleCircumference = 2 * Math.PI * 15.9155; 
    return circleCircumference;
  }

  getStrokeDashOffset(score: number | null | undefined): number {
    const circleCircumference = this.getStrokeDashArray(score);
    if (score === null || score === undefined || score === 0) {
      return circleCircumference; 
    }
    return circleCircumference - (score * circleCircumference);
  }

  getEvaluationScore(score: number | null | undefined): string {
    if (score === null || score === undefined) {
      return 'N/A';
    }
    return `${Math.round(score * 100)}%`;
  }

  openSyllabus(url: string): void {
    window.open(url, '_blank');
  }
  
}
