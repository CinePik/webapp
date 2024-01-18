import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './guard/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ConfigInitService } from './init/config-init.service';
import {
  ApiModule as ApiModuleCatalog,
  Configuration as ConfigurationCatalog,
} from './api/catalog';
import {
  ApiModule as ApiModuleWatchlist,
  Configuration as ConfigurationWatchlist,
} from './api/watchlist';
import {
  ApiModule as ApiModuleRecommendationEngine,
  Configuration as ConfigurationRecommendationEngine,
} from './api/recommendation-engine';
import { LoadingComponent } from './loading/loading.component';
import { MovieComponent } from './movie/movie.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastsContainerComponent } from './toasts-container/toasts-container.component';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
import { MoviePageComponent } from './movie-page/movie-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoadingComponent,
    MovieComponent,
    SearchPageComponent,
    ToastsContainerComponent,
    WatchlistPageComponent,
    MoviePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    KeycloakAngularModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ApiModuleCatalog.forRoot(() => {
      return new ConfigurationCatalog({
        basePath: '/api-catalog',
      });
    }),
    ApiModuleWatchlist.forRoot(() => {
      return new ConfigurationWatchlist({
        basePath: '/api-watchlist',
      });
    }),
    ApiModuleRecommendationEngine.forRoot(() => {
      return new ConfigurationRecommendationEngine({
        basePath: '/api-recommendation',
      });
    }),
  ],
  providers: [
    ConfigInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ConfigInitService],
    },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
