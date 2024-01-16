/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, catchError, mergeMap, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigInitService {
  private config: any;

  constructor(private httpClient: HttpClient) {}

  public getConfig(): Observable<any> {
    return this.httpClient
      .get(this.getConfigFile(), {
        observe: 'response',
      })
      .pipe(
        catchError(error => {
          console.log(error);
          return of(null);
        }),
        mergeMap(response => {
          if (response && response.body) {
            this.config = response.body;
            return of(this.config);
          } else {
            return of(null);
          }
        })
      );
  }

  private getConfigFile(): string {
    return environment.configFile;
  }
}
