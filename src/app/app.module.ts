import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchCardComponent } from './shareComponents/search-card/search-card.component';
import { MapComponent } from './components/search/map/map.component';
import { RouteCardComponent } from './components/search/route-card/route-card.component';
import { ViewFoodCardComponent } from './components/search/view-food-card/view-food-card.component';
import { ViewFoodDetailComponent } from './components/search/view-food-detail/view-food-detail.component';
import { BikeCardComponent } from './components/search/bike-card/bike-card.component';

import { ApiKeyHeaderInterceptor } from './interceptor/api-key-header.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    HeaderComponent,
    SearchCardComponent,
    MapComponent,
    RouteCardComponent,
    ViewFoodCardComponent,
    ViewFoodDetailComponent,
    BikeCardComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiKeyHeaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
