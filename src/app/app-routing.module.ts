import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutUsComponent } from './about-us/about-us.component';

const websiteName = 'Bluebook 2.0';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'about-us', pathMatch: 'full', component: AboutUsComponent},
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent, title: `${websiteName} - 404`}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
