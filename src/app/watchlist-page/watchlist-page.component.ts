import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { MoviesService, ShowsService } from '../api/watchlist';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrl: './watchlist-page.component.scss',
})
export class WatchlistPageComponent implements OnInit {
  loadingMovies = true;
  loadingShows = true;

  userProfile: KeycloakProfile = {};
  watchedMovies: any[] = [];
  watchedShows: any[] = [];

  constructor(
    private keycloak: KeycloakService,
    private toastService: ToastService,
    private watchlistMoviesService: MoviesService,
    private watchlistShowsService: ShowsService
  ) {}

  async ngOnInit() {
    this.userProfile = await this.keycloak.loadUserProfile();
  }

  getWatchedMovies() {
    if (!this.userProfile.id) {
      return;
    }

    firstValueFrom(
      this.watchlistMoviesService.moviesControllerGetMovieWatchlist(
        this.userProfile.id
      )
    )
      .then(data => {
        this.watchedMovies = data;
        this.loadingMovies = false;
        console.log(data);
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error',
          body: err.message,
          classname: 'bg-danger text-light',
        });
        this.loadingMovies = false;
      });
  }
}

interface KeycloakProfile {
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
