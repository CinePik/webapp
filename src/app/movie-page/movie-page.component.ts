import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  Subject,
  catchError,
  firstValueFrom,
  retry,
  takeUntil,
  throwError,
} from 'rxjs';
import {
  MovieDetailWrapperResponseDto as CatalogMovieDetailWrapperResponseDto,
  MoviesService as CatalogMoviesService,
  ShowDetailWrapperResponseDto as CatalogShowDetailWrapperResponseDto,
  ShowsService as CatalogShowsService,
} from '../api/catalog';
import { ToastService } from '../toast.service';
import { KeycloakProfile } from '../watchlist-page/watchlist-page.component';
import { KeycloakService } from 'keycloak-angular';
import { WatchlistService } from '../watchlist.service';
import {
  ShowDetailWrapperResponseDto as WatchlistShowDetailWrapperResponseDto,
  MovieDetailWrapperResponseDto as WatchlistMovieDetailWrapperResponseDto,
  MovieCommentResponseDto,
  ShowCommentResponseDto,
  CreateShowCommentDto,
  CreateMovieCommentDto,
  MoviesService as WatchlistMoviesService,
  ShowsService as WatchlistShowsService,
} from '../api/watchlist';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrl: './movie-page.component.scss',
})
export class MoviePageComponent implements OnInit, OnDestroy {
  id: number | null = null;
  contentType: string | null = null;
  userProfile: KeycloakProfile = {};

  loading = true;
  movieData: CatalogMovieDetailWrapperResponseDto | null = null;
  showData: CatalogShowDetailWrapperResponseDto | null = null;

  watchedMovies: WatchlistMovieDetailWrapperResponseDto[] = [];
  watchedShows: WatchlistShowDetailWrapperResponseDto[] = [];

  selectedSeason: number = 1;

  reviewForm = new FormGroup({
    rating: new FormControl(0, Validators.required),
    comment: new FormControl('', Validators.required),
  });
  movieReviews: MovieCommentResponseDto[] = [];
  showReviews: ShowCommentResponseDto[] = [];

  get isShow() {
    return this.contentType === 'show';
  }

  get inWatchlist(): boolean {
    return this.checkIfWatched(this.id, this.contentType);
  }

  get data() {
    if (this.contentType === 'movie') {
      return this.movieData;
    } else if (this.contentType === 'show') {
      return this.showData;
    }
    return null;
  }

  get backdrop_path() {
    if (this.contentType === 'movie') {
      return this.movieData?.movie?.backdrop_path;
    } else if (this.contentType === 'show') {
      return this.showData?.show?.backdrop_path;
    }
    return null;
  }

  get title() {
    if (this.contentType === 'movie') {
      return this.movieData?.movie?.title;
    } else if (this.contentType === 'show') {
      return this.showData?.show?.title;
    }
    return null;
  }

  get release_date() {
    if (this.contentType === 'movie') {
      return this.movieData?.movie?.release_date;
    } else if (this.contentType === 'show') {
      return this.showData?.show?.first_aired;
    }
    return null;
  }

  get vote_average() {
    if (this.contentType === 'movie') {
      return this.movieData?.movie?.vote_average;
    } else if (this.contentType === 'show') {
      return this.showData?.show?.vote_average;
    }
    return null;
  }

  get vote_count() {
    if (this.contentType === 'movie') {
      return this.movieData?.movie?.vote_count;
    } else if (this.contentType === 'show') {
      return this.showData?.show?.vote_count;
    }
    return null;
  }

  get genres() {
    if (this.contentType === 'movie') {
      return this.movieData?.movie?.genres;
    } else if (this.contentType === 'show') {
      return this.showData?.show?.genres;
    }
    return null;
  }

  get overview() {
    if (this.contentType === 'movie') {
      return this.movieData?.movie?.overview;
    } else if (this.contentType === 'show') {
      return this.showData?.show?.overview;
    }
    return null;
  }

  get similar() {
    if (this.contentType === 'movie') {
      return this.movieData?.similarMovies;
    } else if (this.contentType === 'show') {
      return null;
    }
    return null;
  }

  get seasons() {
    if (this.contentType === 'movie') {
      return null;
    } else if (this.contentType === 'show') {
      return this.showData?.seasons;
    }
    return null;
  }

  get episodes() {
    if (this.contentType === 'movie') {
      return null;
    } else if (this.contentType === 'show') {
      const foundSeason = this.showData?.seasons.find(
        season => season.season === +this.selectedSeason
      );
      return foundSeason?.episodes ?? [];
    }
    return null;
  }

  constructor(
    private keycloak: KeycloakService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private catalogMoviesService: CatalogMoviesService,
    private catalogShowsService: CatalogShowsService,
    private watchlistService: WatchlistService,
    private watchlistMoviesService: WatchlistMoviesService,
    private watchlistShowsService: WatchlistShowsService
  ) {}

  async ngOnInit() {
    // get user data
    this.userProfile = await this.keycloak.loadUserProfile();

    // get route movie/show id
    this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.id = +params['id'];
    });

    // get route content type
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: Params) => {
        this.contentType = params['contentType'];
        this.getData();
      });

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

    // get reviews
    this.getReviews();
  }

  getData() {
    if (!this.id || !this.contentType) {
      this.loading = false;
      return;
    }
    if (this.contentType === 'movie') {
      this.getMovie();
    } else if (this.contentType === 'show') {
      this.getShow();
    }
  }

  getMovie() {
    if (!this.id) {
      return;
    }

    this.catalogMoviesService
      .moviesControllerFindOne(this.id.toString())
      .pipe(
        retry(2), // Retry the request up to 2 times
        catchError(err => {
          // Handle the error and return a new observable
          this.toastService.show({
            header: 'Error getting movie data',
            body: err.message,
            classname: 'bg-danger text-light',
          });
          this.loading = false;
          return throwError(() => new Error(err.message)); // Re-throw the error so that it's caught by the final catchError
        })
      )
      .subscribe({
        next: data => {
          this.movieData = data;
          this.loading = false;
        },
        error: err => {
          console.error('API call failed after retries:', err);
          // Handle additional error logic here if needed
        },
      });
  }

  getShow() {
    if (!this.id) {
      return;
    }

    this.catalogShowsService
      .showsControllerFindOne(this.id.toString())
      .pipe(
        retry(2), // Retry the request up to 2 times
        catchError(err => {
          // Handle the error and return a new observable
          this.toastService.show({
            header: 'Error getting show data',
            body: err.message,
            classname: 'bg-danger text-light',
          });
          this.loading = false;
          return throwError(() => new Error(err.message)); // Re-throw the error so that it's caught by the final catchError
        })
      )
      .subscribe({
        next: (data: any) => {
          // TODO: data is defined as array of ShowDetailWrapperResponseDto, probably issue with OpenAPI spec
          this.showData = data as CatalogShowDetailWrapperResponseDto;
          this.loading = false;
        },
        error: err => {
          console.error('API call failed after retries:', err);
          // Handle additional error logic here if needed
        },
      });
  }

  checkIfWatched(
    id: number | null,
    contentType: string | null,
    season_number?: number,
    episode_number?: number
  ): boolean {
    if (!id || !contentType) {
      return false;
    }

    let existing;
    if (contentType === 'movie') {
      existing = this.watchedMovies.find(
        movieWrapper => movieWrapper.movie.tmdbId === id
      );
    } else if (contentType === 'show') {
      existing = this.watchedShows.find(
        showWrapper =>
          showWrapper.show.tmdbId === id &&
          showWrapper.season === season_number &&
          showWrapper.episode === episode_number
      );
    }
    return !!existing;
  }

  addMovieToWatchlist() {
    if (
      !this.userProfile.id ||
      !this.movieData?.movie ||
      !this.contentType ||
      this.inWatchlist
    ) {
      return;
    }
    this.watchlistService.addMovieToWatchlist(
      this.userProfile.id,
      this.movieData.movie.id
    );
  }

  removeMovieFromWatchlist() {
    if (
      !this.userProfile.id ||
      !this.movieData?.movie ||
      !this.contentType ||
      !this.inWatchlist
    ) {
      return;
    }
    this.watchlistService.removeMovieFromWatchlist(
      this.userProfile.id,
      this.movieData.movie.id
    );
  }

  getReviews() {
    if (!this.id || !this.contentType) {
      return;
    }

    if (this.contentType === 'movie') {
      this.getMovieReviews(+this.id);
    } else if (this.contentType === 'show') {
      // this.showReviews = await this.watchlistService.getShowReviews(
      //   this.id.toString()
      // );
    }
  }

  addReview() {
    if (
      !this.userProfile.id ||
      !this.movieData?.movie ||
      !this.reviewForm.valid
    ) {
      return;
    }

    if (this.contentType === 'movie') {
      this.addMovieReview(
        this.userProfile.id,
        this.movieData.movie.id,
        this.reviewForm.value.rating ?? 0,
        this.reviewForm.value.comment ?? ''
      );
    } else if (this.contentType === 'show') {
      // this.watchlistService.addShowReview(
      //   this.userProfile.id,
      //   this.showData?.show?.id,
      //   this.reviewForm.value.rating ?? 0,
      //   this.reviewForm.value.comment ?? ''
      // );
    }
  }

  // REVIEWS
  getMovieReviews(movieId: number) {
    if (!movieId) {
      return;
    }

    firstValueFrom(
      this.watchlistMoviesService.moviesControllerFindAllMovieComments(
        movieId.toString()
      )
    )
      .then((reviews: MovieCommentResponseDto[]) => {
        this.movieReviews = reviews;
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error getting movie reviews',
          body: err.message,
          classname: 'bg-danger text-light',
        });
      });
  }

  addMovieReview(
    userId: string,
    movieId: number,
    rating: number,
    comment: string
  ) {
    if (!userId || !movieId) {
      return;
    }

    const data: CreateMovieCommentDto = {
      userId,
      tmdbMovieId: movieId,
      rating,
      comment,
    };

    firstValueFrom(
      this.watchlistMoviesService.moviesControllerCreateMovieComment(data)
    )
      .then((reviews: MovieCommentResponseDto[]) => {
        this.movieReviews = reviews;
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error reviewing movie',
          body: err.message,
          classname: 'bg-danger text-light',
        });
      });
  }

  getShowReviews(
    userId: string,
    showId: number,
    season: number,
    episode: number
  ) {
    if (!userId || !showId || !season || !episode) {
      return;
    }

    firstValueFrom(
      this.watchlistShowsService.showsControllerFindAll(
        userId,
        showId.toString(),
        season.toString(),
        episode.toString()
      )
    )
      .then((reviews: ShowCommentResponseDto[]) => {
        this.showReviews = reviews;
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error getting show reviews',
          body: err.message,
          classname: 'bg-danger text-light',
        });
      });
  }

  addShowReview(
    userId: string,
    showId: number,
    season: number,
    episode: number,
    rating: number,
    comment: string
  ) {
    if (!userId || !showId || !season || !episode) {
      return;
    }

    const data: CreateShowCommentDto = {
      userId,
      showId,
      season,
      episode,
      rating,
      comment,
    };

    firstValueFrom(this.watchlistShowsService.showsControllerCreate(data))
      .then((reviews: ShowCommentResponseDto[]) => {
        this.showReviews = reviews;
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error reviewing show',
          body: err.message,
          classname: 'bg-danger text-light',
        });
      });
  }

  private destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
