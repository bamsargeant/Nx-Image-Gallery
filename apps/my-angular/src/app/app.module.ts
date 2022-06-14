import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { ENVIRONMENT } from '@stackblitz-nx-angular/web/data-access';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { BannerModule } from '@stackblitz-nx-angular/web/ui/banner';
import { FooterModule } from '@stackblitz-nx-angular/web/ui/footer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BannerModule,
    FooterModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
