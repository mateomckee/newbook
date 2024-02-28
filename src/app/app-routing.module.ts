import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResultsComponent } from './results/results.component';

const websiteName = 'Bluebook 2.0';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'results', pathMatch: 'full', component: ResultsComponent, title: `${websiteName} - Results`},
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent, title: `${websiteName} - 404`}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
