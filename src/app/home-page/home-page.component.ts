import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService, HomeResponseDto } from '../api/catalog';
import { Subject, throwError } from 'rxjs';
import { catchError, retry, takeUntil } from 'rxjs/operators';
import { ToastService } from '../toast.service';
import {
  MovieDetailWrapperResponseDto,
  ShowDetailWrapperResponseDto,
} from '../api/watchlist';
import { WatchlistService } from '../watchlist.service';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from '../watchlist-page/watchlist-page.component';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  loading = true;

  userProfile: KeycloakProfile = {};
  data: HomeResponseDto = { sections: [] };
  watchedMovies: MovieDetailWrapperResponseDto[] = [];
  watchedShows: ShowDetailWrapperResponseDto[] = [];

  constructor(
    private keycloak: KeycloakService,
    private catalogCommonService: CommonService,
    private toastService: ToastService,
    private watchlistService: WatchlistService
  ) {}

  async ngOnInit() {
    // get user data
    this.userProfile = await this.keycloak.loadUserProfile();

    // get home data
    this.getHome();

    // get watched movies and shows data
    this.watchlistService.loadWatchedMoviesAndShows(this.userProfile.id);
    this.watchlistService.watchedMovies$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(movies => {
        this.watchedMovies = movies;
      });
    this.watchlistService.watchedShows$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(shows => {
        this.watchedShows = shows;
      });
  }

  getHome() {
    this.catalogCommonService
      .commonControllerHome()
      .pipe(
        retry(2), // Retry the request up to 2 times
        catchError(err => {
          // Handle the error and return a new observable
          this.toastService.show({
            header: 'Error getting home data',
            body: err.message,
            classname: 'bg-danger text-light',
          });
          this.loading = false;
          return throwError(() => new Error(err.message)); // Re-throw the error so that it's caught by the final catchError
        })
      )
      .subscribe({
        next: data => {
          this.data = data;
          this.loading = false;
        },
        error: err => {
          console.error('API call failed after retries:', err);
          // Handle additional error logic here if needed
        },
      });
  }

  checkIfWatched(id: number, contentType: string): boolean {
    let existing;
    if (contentType === 'movie') {
      existing = this.watchedMovies.find(
        movieWrapper => movieWrapper.movie.tmdbId === id
      );
    } else if (contentType === 'show') {
      existing = this.watchedShows.find(
        showWrapper => showWrapper.show.tmdbId === id
      );
    }
    return !!existing;
  }

  private destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
