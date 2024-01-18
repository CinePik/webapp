import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService, HomeResponseDto } from '../api/catalog';
import { Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  loading = true;

  data: HomeResponseDto = { sections: [] };

  constructor(
    private catalogCommonService: CommonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getHome();
  }

  getHome() {
    this.catalogCommonService
      .commonControllerHome()
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
          this.data = data;
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
