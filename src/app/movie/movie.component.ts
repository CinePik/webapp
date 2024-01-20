import { Component, Input } from '@angular/core';
import {
  HomeContentResponseDto,
  SearchItemResponseDto,
  ShowEpisodeResponseDto,
  SimilarMovieDetailResponseDto,
} from '../api/catalog';
import { Router } from '@angular/router';
import { WatchlistService } from '../watchlist.service';
import { MovieDetailResponseDto } from '../api/watchlist';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent {
  @Input() movie:
    | HomeContentResponseDto
    | SimilarMovieDetailResponseDto
    | SearchItemResponseDto
    | ShowEpisodeResponseDto
    | MovieDetailResponseDto
    | undefined = undefined;

  @Input() userId: string | undefined;
  @Input() clickable = true;
  @Input() objectType: 'home' | 'watchlist' | 'similar' | 'episode' = 'home';
  @Input() contentType = 'movie';
  @Input() inWatchlist = false;
  @Input() watchlistId: number | null = null;
  @Input() isShow = false;

  get imageUrl() {
    if (this.movie && this.isShowEpisodeResponseDto(this.movie)) {
      return this.movie.thumbnail_path;
    }
    if (this.movie && this.isHomeContentResponseDto(this.movie)) {
      return this.movie.poster_path;
    }
    return './assets/placeholder.png';
  }

  constructor(
    private router: Router,
    private watchlistService: WatchlistService
  ) {}

  imageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = './assets/placeholder.png';
  }

  isHomeContentResponseDto(
    movie:
      | HomeContentResponseDto
      | SimilarMovieDetailResponseDto
      | SearchItemResponseDto
      | ShowEpisodeResponseDto
      | MovieDetailResponseDto
  ): movie is HomeContentResponseDto {
    return (
      movie &&
      (this.objectType === 'home' ||
        this.objectType === 'similar' ||
        this.objectType === 'watchlist')
    );
  }

  isShowEpisodeResponseDto(
    movie:
      | HomeContentResponseDto
      | SimilarMovieDetailResponseDto
      | SearchItemResponseDto
      | ShowEpisodeResponseDto
      | MovieDetailResponseDto
  ): movie is ShowEpisodeResponseDto {
    return movie && this.objectType === 'episode';
  }

  isMovieDetailResponseDto(
    movie:
      | HomeContentResponseDto
      | SimilarMovieDetailResponseDto
      | SearchItemResponseDto
      | ShowEpisodeResponseDto
      | MovieDetailResponseDto
  ): movie is MovieDetailResponseDto {
    return movie && this.objectType === 'watchlist';
  }

  openMoviePage(event: Event) {
    event.preventDefault();

    if (!this.clickable || !this.movie) {
      return;
    }

    if (this.isMovieDetailResponseDto(this.movie)) {
      this.router.navigate(['/movie', this.movie.tmdbId], {
        queryParams: { contentType: this.contentType },
      });
    } else if (this.isHomeContentResponseDto(this.movie)) {
      // // Temp: fix issue where clicking on a movie in the watchlist
      // let id = this.movie.id;
      // if (this.movie.id === this.watchlistId) {
      //   id = this.movie.tmdbMovieId;
      // }
      this.router.navigate(['/movie', this.movie.id], {
        queryParams: { contentType: this.movie.contentType },
      });
    }
  }

  addMovieToWatchlist() {
    if (this.inWatchlist || !this.userId || !this.movie) {
      return;
    }
    this.watchlistService.addMovieToWatchlist(this.userId, this.movie.id);
  }

  removeMovieFromWatchlist() {
    if (!this.inWatchlist || !this.userId || !this.movie || !this.watchlistId) {
      return;
    }
    this.watchlistService.removeMovieFromWatchlist(
      this.userId,
      this.watchlistId
    );
  }

  addShowToWatchlist() {
    if (
      this.inWatchlist ||
      !this.userId ||
      !this.movie ||
      !this.isShowEpisodeResponseDto(this.movie)
    ) {
      return;
    }
    this.watchlistService.addShowToWatchlist(
      this.userId,
      this.movie.id,
      this.movie.season_number,
      this.movie.episode_number
    );
  }

  removeShowFromWatchlist() {
    if (!this.inWatchlist || !this.userId || !this.movie) {
      return;
    }
    this.watchlistService.removeShowFromWatchlist(this.userId, this.movie.id);
  }
}
