import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ItemData } from 'src/app/interfaces/item.interface';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {
  @Input() data: ItemData | null = null;

  private syllabusFileName: string = "";

  private syllabiAPI_URL = 'https://newbook-functions.vercel.app/api/syllabi';

  constructor(private http: HttpClient) { }

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

  async tryGetSyllabus() {
    const result = await this.getSyllabus();

    //display result on UI here

    //if no syllabus exists
    if (result == 0) {
      console.log(`No syllabus exists for ${this.data?.courselabel}.${this.data?.section}`);
    }
    //if error occurred
    else if (result == -1) {
      console.error(`An error ocurred while getting syllabus for ${this.data?.courselabel}.${this.data?.section}`);
    }
  }

  public async getSyllabus(): Promise<number> {
    this.syllabusFileName = `${this.data?.instructor};${this.data?.crn};${this.data?.courselabel}.${this.data?.section};${this.data?.coursetitle};${this.data?.semester};pdf.pdf`.replaceAll(" ", "_");
    console.log("Attempting to retrieve syllabus: ", this.syllabusFileName);

    //api parameters
    const url = new URL(`${this.syllabiAPI_URL}`);
    url.searchParams.append('q', this.syllabusFileName);
    const headers = new HttpHeaders();

    try {
      const response: any = await this.http.get<ArrayBuffer>(url.toString(), { headers }).toPromise();
      //success case
      if (response && response.data[0]) {
        const fileData: Uint8Array = new Uint8Array(response.data[0].file_data.data);
        this.downloadPDF(fileData, this.syllabusFileName);
        return 1;
      }
    }
    //error case
    catch (error) { 
      console.error("An error occurred during the search.", error);
      return -1;
    }

    //fail case
    return 0;
  }

  downloadPDF(fileData: Uint8Array, filename: string) {
    //convert byte array to Blob
    const blob = new Blob([fileData], { type: 'application/pdf' });

    //create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    //create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    //append the link to the body
    document.body.appendChild(link);

    //trigger the download
    link.click();

    //clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
