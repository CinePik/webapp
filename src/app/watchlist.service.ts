import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import {
  AddMovieWatchlistDto,
  AddShowWatchlistDto,
  CreateMovieCommentDto,
  CreateShowCommentDto,
  MovieCommentResponseDto,
  MovieDetailWrapperResponseDto,
  MoviesService,
  ShowCommentResponseDto,
  ShowDetailWrapperResponseDto,
  ShowsService,
} from './api/watchlist';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  public loadingMoviesSubject = new BehaviorSubject<boolean>(false);
  public loadingShowsSubject = new BehaviorSubject<boolean>(false);

  private watchedMoviesSubject = new BehaviorSubject<
    MovieDetailWrapperResponseDto[]
  >([]);
  private watchedShowsSubject = new BehaviorSubject<
    ShowDetailWrapperResponseDto[]
  >([]);
  watchedMovies$: Observable<MovieDetailWrapperResponseDto[]> =
    this.watchedMoviesSubject.asObservable();
  watchedShows$: Observable<ShowDetailWrapperResponseDto[]> =
    this.watchedShowsSubject.asObservable();

  constructor(
    private toastService: ToastService,
    private watchlistMoviesService: MoviesService,
    private watchlistShowsService: ShowsService
  ) {}

  loadWatchedMoviesAndShows(userId: string | undefined) {
    if (!userId) {
      return;
    }
    this.getWatchedMovies(userId);
    this.getWatchedShows(userId);
  }

  getWatchedMovies(userId: string) {
    if (!userId) {
      return;
    }

    this.loadingMoviesSubject.next(true);

    firstValueFrom(
      this.watchlistMoviesService.moviesControllerGetMovieWatchlist(userId)
    )
      .then(data => {
        this.watchedMoviesSubject.next(data);
        this.loadingMoviesSubject.next(false);
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error getting watched movies',
          body: err.message,
          classname: 'bg-danger text-light',
        });
        this.loadingMoviesSubject.next(false);
      });
  }

  getWatchedShows(userId: string) {
    if (!userId) {
      return;
    }

    this.loadingShowsSubject.next(true);

    firstValueFrom(
      this.watchlistShowsService.showsControllerGetShowWatchlist(userId)
    )
      .then(data => {
        this.watchedShowsSubject.next(data);
        this.loadingShowsSubject.next(false);
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error getting watched shows',
          body: err.message,
          classname: 'bg-danger text-light',
        });
        this.loadingShowsSubject.next(false);
      });
  }

  addMovieToWatchlist(userId: string, movieId: number) {
    if (!userId || !movieId) {
      return;
    }

    const data: AddMovieWatchlistDto = {
      userId,
      tmdbMovieId: movieId,
    };

    firstValueFrom(
      this.watchlistMoviesService.moviesControllerAddMovieWatchlist(data)
    )
      .then(() => {
        this.getWatchedMovies(userId);
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error adding movie to watchlist',
          body: err.message,
          classname: 'bg-danger text-light',
        });
      });
  }

  removeMovieFromWatchlist(userId: string, movieId: number) {
    if (!userId || !movieId) {
      return;
    }

    firstValueFrom(
      this.watchlistMoviesService.moviesControllerRemoveMovieWatchlist(
        movieId.toString()
      )
    )
      .then(() => {
        this.getWatchedMovies(userId);
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error removing movie from watchlist',
          body: err.message,
          classname: 'bg-danger text-light',
        });
      });
  }

  addShowToWatchlist(
    userId: string,
    showId: number,
    season: number,
    episode: number
  ) {
    if (!userId || !showId) {
      return;
    }

    const data: AddShowWatchlistDto = {
      userId,
      showId,
      season,
      episode,
    };

    firstValueFrom(
      this.watchlistShowsService.showsControllerAddShowWatchlist(data)
    )
      .then(() => {
        this.getWatchedShows(userId);
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error adding show to watchlist',
          body: err.message,
          classname: 'bg-danger text-light',
        });
      });
  }

  removeShowFromWatchlist(userId: string, showId: number) {
    if (!userId || !showId) {
      return;
    }

    firstValueFrom(
      this.watchlistShowsService.showsControllerRemoveShowWatchlist(
        showId.toString()
      )
    )
      .then(() => {
        this.getWatchedShows(userId);
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error removing show from watchlist',
          body: err.message,
          classname: 'bg-danger text-light',
        });
      });
  }

  // getMovieReviews(movieId: number): Promise<MovieCommentResponseDto[]> {
  //   if (!movieId) {
  //     return Promise.resolve([]);
  //   }

  //   firstValueFrom(
  //     this.watchlistMoviesService.moviesControllerFindAllMovieComments(
  //       movieId.toString()
  //     )
  //   )
  //     .then((reviews: MovieCommentResponseDto[]) => {
  //       console.log(reviews);

  //       return Promise.resolve(reviews);
  //     })
  //     .catch(err => {
  //       this.toastService.show({
  //         header: 'Error getting movie reviews',
  //         body: err.message,
  //         classname: 'bg-danger text-light',
  //       });
  //       return Promise.resolve([]);
  //     });

  //   return Promise.resolve([]);
  // }

  // addMovieReview(
  //   userId: string,
  //   movieId: number,
  //   rating: number,
  //   comment: string
  // ): Promise<MovieCommentResponseDto[]> {
  //   if (!userId || !movieId) {
  //     return Promise.resolve([]);
  //   }

  //   const data: CreateMovieCommentDto = {
  //     userId,
  //     tmdbMovieId: movieId,
  //     rating,
  //     comment,
  //   };

  //   firstValueFrom(
  //     this.watchlistMoviesService.moviesControllerCreateMovieComment(data)
  //   )
  //     .then((reviews: MovieCommentResponseDto[]) => {
  //       return Promise.resolve(reviews);
  //     })
  //     .catch(err => {
  //       this.toastService.show({
  //         header: 'Error reviewing movie',
  //         body: err.message,
  //         classname: 'bg-danger text-light',
  //       });
  //       return Promise.resolve([]);
  //     });

  //   return Promise.resolve([]);
  // }

  // getShowReviews(
  //   userId: string,
  //   showId: number,
  //   season: number,
  //   episode: number
  // ): Promise<ShowCommentResponseDto[]> {
  //   if (!userId || !showId || !season || !episode) {
  //     return Promise.resolve([]);
  //   }

  //   firstValueFrom(
  //     this.watchlistShowsService.showsControllerFindAll(
  //       userId,
  //       showId.toString(),
  //       season.toString(),
  //       episode.toString()
  //     )
  //   )
  //     .then((reviews: ShowCommentResponseDto[]) => {
  //       return Promise.resolve(reviews);
  //     })
  //     .catch(err => {
  //       this.toastService.show({
  //         header: 'Error getting show reviews',
  //         body: err.message,
  //         classname: 'bg-danger text-light',
  //       });
  //       return Promise.resolve([]);
  //     });
  //   return Promise.resolve([]);
  // }

  // addShowReview(
  //   userId: string,
  //   showId: number,
  //   season: number,
  //   episode: number,
  //   rating: number,
  //   comment: string
  // ): Promise<ShowCommentResponseDto[]> {
  //   if (!userId || !showId || !season || !episode) {
  //     return Promise.resolve([]);
  //   }

  //   const data: CreateShowCommentDto = {
  //     userId,
  //     showId,
  //     season,
  //     episode,
  //     rating,
  //     comment,
  //   };

  //   firstValueFrom(this.watchlistShowsService.showsControllerCreate(data))
  //     .then((reviews: ShowCommentResponseDto[]) => {
  //       return Promise.resolve(reviews);
  //     })
  //     .catch(err => {
  //       this.toastService.show({
  //         header: 'Error reviewing show',
  //         body: err.message,
  //         classname: 'bg-danger text-light',
  //       });
  //       return Promise.resolve([]);
  //     });
  //   return Promise.resolve([]);
  // }
}
