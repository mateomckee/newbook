import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'results/:page', component: ResultsComponent },
  { path: '**', component: PageNotFoundComponent }
=======
import { AboutUsComponent } from './about-us/about-us.component';

const websiteName = 'Bluebook 2.0';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'about-us', pathMatch: 'full', component: AboutUsComponent},
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent, title: `${websiteName} - 404`}
>>>>>>> bc2a73b37e350b4b67fb9924ea8195decb5d07a9
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
