import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  takeUntil,
} from 'rxjs';
import { CommonService, SearchResponseDto } from '../api/catalog';
import { FormControl } from '@angular/forms';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit, OnDestroy {
  loading = false;

  searchInput = new FormControl();
  data: SearchResponseDto = { query: '', contents: [] };

  constructor(
    private catalogService: CommonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.searchInput.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(500), // wait 500ms after the last event before emitting last event
        distinctUntilChanged() // only emit if value is different from previous value
      )
      .subscribe(term => {
        this.getSearch(term);
      });
  }

  getSearch(query: string) {
    if (!query) {
      this.data = { query: '', contents: [] };
      return;
    }
    this.loading = true;
    firstValueFrom(this.catalogService.commonControllerSearch(query))
      .then(data => {
        this.data = data;
        this.loading = false;
      })
      .catch(err => {
        this.toastService.show({
          header: 'Error',
          body: err.message,
          classname: 'bg-danger text-light',
        });
        this.loading = false;
      });
  }

  private destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
