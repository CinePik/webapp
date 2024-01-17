import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ConfigInitService } from './init/config-init.service';
import { ApiModule as ApiModuleCatalog, Configuration } from './api/catalog';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    KeycloakAngularModule,
    HttpClientModule,
    ApiModuleCatalog.forRoot(() => {
      return new Configuration({
        basePath: '/catalog',
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
