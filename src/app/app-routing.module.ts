import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './guard/auth.guard';
import { SearchPageComponent } from './search-page/search-page.component';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
import { MoviePageComponent } from './movie-page/movie-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchPageComponent, canActivate: [AuthGuard] },
  {
    path: 'watchlist',
    component: WatchlistPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'movie/:id',
    component: MoviePageComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
