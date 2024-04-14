import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ItemData } from 'src/app/interfaces/item.interface';
import { ResultsComponent } from '../results.component';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {
  @Input() data: ItemData | null = null;
  @ViewChild('instructorCircularChart') instructorCircularChart!: ElementRef<SVGSVGElement>;
  @ViewChild('instructorEvaluationScoreText') instructorEvaluationScoreText!: ElementRef<SVGTextElement>;
  @ViewChild('courseCircularChart') courseCircularChart!: ElementRef<SVGSVGElement>;
  @ViewChild('courseEvaluationScoreText') courseEvaluationScoreText!: ElementRef<SVGTextElement>;

  disableSyllabusButton: boolean = false;
  defaultSyllabusButtonText: string = "Download Syllabus";
  displaySyllabusButtonText: string = "Download Syllabus";

  private syllabusFileName: string = "";

  private syllabiAPI_URL = 'https://newbook-functions.vercel.app/api/syllabi';

  constructor(
    private http: HttpClient,
    private resultsComponent: ResultsComponent
  ) { }


  ngOnInit() {
    this.resultsComponent.onSelectItem.subscribe(() => { this.onSelectItem(); });
  }

  private onSelectItem() {
    this.disableSyllabusButton = false;
    this.displaySyllabusButtonText = this.defaultSyllabusButtonText;
  }

  resizeListener = () => this.adjustTextSize();

  ngAfterViewInit() {
    this.adjustTextSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  private adjustTextSize(): void {
    requestAnimationFrame(() => {
      this.adjustSingleTextSize(this.instructorCircularChart, this.instructorEvaluationScoreText);
      this.adjustSingleTextSize(this.courseCircularChart, this.courseEvaluationScoreText);
    });
  }

  private adjustSingleTextSize(chartElementRef: ElementRef<SVGSVGElement>, textElementRef: ElementRef<SVGTextElement>): void {
    if (chartElementRef && textElementRef) {
      const svgBox = chartElementRef.nativeElement.viewBox.baseVal;
      const svgHeight = svgBox.height;
      const fontSize = svgHeight / 3; // Adjust ratio as needed for your design
      const textYPosition = svgHeight / 2 + svgHeight * 0.05; // Adjust centering as needed
      textElementRef.nativeElement.setAttribute('y', textYPosition.toString());
      textElementRef.nativeElement.style.fontSize = `${fontSize}px`;
    }
  }

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
    this.disableSyllabusButton = true;
    this.displaySyllabusButtonText = "Downloading...";

    const result = await this.getSyllabus();

    //if success
    if (result == 1) {
      this.displaySyllabusButtonText = "Download Syllabus";
      this.disableSyllabusButton = false;
    }
    //if fail, permanently keep button disabled
    else if (result == 0) {
      this.displaySyllabusButtonText = "No Syllabus Exists";
    }
    //if error, enable button again
    else {
      this.displaySyllabusButtonText = "Error - Try Again";
      setTimeout(() => {
        this.displaySyllabusButtonText = this.defaultSyllabusButtonText;
        this.disableSyllabusButton = false;
      }, 2000); //2 seconds
    }
  }

  public async getSyllabus(): Promise<number> {
    this.syllabusFileName = `${this.data?.instructor};${this.data?.crn};${this.data?.courselabel}.${this.data?.section};${this.data?.coursetitle};${this.data?.semester};pdf.pdf`.replaceAll(" ", "_");

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
      console.error("An error occurred while retrieving the syllabus.", error);
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

  //Drop down menu
  showDescription = false;
  toggleDescription(): void {
    this.showDescription = !this.showDescription;
  }
}
