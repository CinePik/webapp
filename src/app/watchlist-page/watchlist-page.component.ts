import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import {
  MovieDetailWrapperResponseDto,
  ShowDetailWrapperResponseDto,
} from '../api/watchlist';
import { Subject, takeUntil } from 'rxjs';
import { WatchlistService } from '../watchlist.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrl: './watchlist-page.component.scss',
})
export class WatchlistPageComponent implements OnInit, OnDestroy {
  userProfile: KeycloakProfile = {};
  watchedMovies: MovieDetailWrapperResponseDto[] = [];
  watchedShows: ShowDetailWrapperResponseDto[] = [];

  constructor(
    private keycloak: KeycloakService,
    public watchlistService: WatchlistService
  ) {}

  async ngOnInit() {
    this.userProfile = await this.keycloak.loadUserProfile();

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

  private destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

export interface KeycloakProfile {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  totp?: boolean;
  createdTimestamp?: number;
}
