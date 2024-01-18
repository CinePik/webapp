import { Component, Input } from '@angular/core';
import {
  HomeContentResponseDto,
  SimilarMovieDetailResponseDto,
} from '../api/catalog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent {
  @Input() movie:
    | HomeContentResponseDto
    | SimilarMovieDetailResponseDto
    | undefined = undefined;

  @Input() clickable = true;
  @Input() objectHasContent = true;

  constructor(private router: Router) {}

  isHomeContentResponseDto(
    movie: HomeContentResponseDto | SimilarMovieDetailResponseDto
  ): movie is HomeContentResponseDto {
    return movie && this.objectHasContent;
  }

  openMoviePage(event: Event) {
    event.preventDefault();

    if (!this.clickable || !this.movie) {
      return;
    }

    if (this.isHomeContentResponseDto(this.movie)) {
      this.router.navigate(['/movie', this.movie.id], {
        queryParams: { contentType: this.movie.contentType },
      });
    }
  }
}
