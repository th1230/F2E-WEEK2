import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapManagerService {
  currentBikeCard: {
    index: number;
    lat: number;
    lon: number;
  } = {
    index: -1,
    lat: 0,
    lon: 0,
  };

  setViewData: {
    lat: number;
    lon: number;
  } = {
    lat: 0,
    lon: 0,
  };

  currentLineCard!: number;

  bikeCardSub = new Subject<{
    index: number;
    lat: number;
    lon: number;
  }>();

  lineCardSub = new Subject<number>();

  setViewSub = new Subject<{
    lat: number;
    lon: number;
  }>();

  constructor() {}

  bikeCardClick(index: number, lat: number, lon: number) {
    this.currentBikeCard.index = index;
    this.currentBikeCard.lat = lat;
    this.currentBikeCard.lon = lon;

    this.bikeCardSub.next(this.currentBikeCard);
  }

  lineCardClick(index: number) {
    this.currentLineCard = index;
    this.lineCardSub.next(this.currentLineCard);
  }

  setView(lat: number, lon: number) {
    this.setViewData.lat = lat;
    this.setViewData.lon = lon;
    console.log(this.setViewData);

    this.setViewSub.next(this.setViewData);
  }
}
