import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, catchError, retry, takeUntil, throwError } from 'rxjs';
import {
  MovieDetailWrapperResponseDto,
  MoviesService,
  ShowDetailWrapperResponseDto,
  ShowsService,
} from '../api/catalog';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrl: './movie-page.component.scss',
})
export class MoviePageComponent implements OnInit, OnDestroy {
  id: string | null = null;
  contentType: string | null = null;

  loading = true;
  movieData: MovieDetailWrapperResponseDto | null = null;
  showData: ShowDetailWrapperResponseDto | null = null;

  get isShow() {
    return this.contentType === 'show';
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

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private catalogMoviesService: MoviesService,
    private catalogShowsService: ShowsService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.id = params['id'];
    });

    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: Params) => {
        this.contentType = params['contentType'];
        this.getData();
      });
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
      .moviesControllerFindOne(this.id)
      .pipe(
        retry(2), // Retry the request up to 2 times
        catchError(err => {
          // Handle the error and return a new observable
          this.toastService.show({
            header: 'Error',
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
      .showsControllerFindOne(this.id)
      .pipe(
        retry(2), // Retry the request up to 2 times
        catchError(err => {
          // Handle the error and return a new observable
          this.toastService.show({
            header: 'Error',
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
          this.showData = data as ShowDetailWrapperResponseDto;
          this.loading = false;
        },
        error: err => {
          console.error('API call failed after retries:', err);
          // Handle additional error logic here if needed
        },
      });
  }

  private destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
