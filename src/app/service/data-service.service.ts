import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  constructor(private http: HttpClient) {}

  getBikeStation(city: string, stationName: string) {
    if (stationName != '') {
      return this.http.get(
        `${environment.API_URL}/MOTC/v2/Bike/Station/${city}?$filter=contains(StationName/Zh_tw,'${stationName}')&$format=JSON`,
        { responseType: 'text' }
      );
    } else {
      return this.http.get(
        `${environment.API_URL}/MOTC/v2/Bike/Station/${city}?$format=JSON`,
        {
          responseType: 'text',
        }
      );
    }
  }

  getBikeAvailability(city: string, uid?: string) {
    if (uid) {
      return this.http.get(
        `${environment.API_URL}/MOTC/v2/Bike/Availability/${city}?$filter=StationUID eq '${uid}'&$format=JSON`,
        { responseType: 'text' }
      );
    } else {
      return this.http.get(
        `${environment.API_URL}/MOTC/v2/Bike/Availability/${city}?$format=JSON`,
        { responseType: 'text' }
      );
    }
  }

  getRoutes(city: string, stationName: string) {
    if (stationName != '') {
      return this.http.get(
        `${environment.API_URL}/MOTC/v2/Cycling/Shape/${city}?$filter=contains(RouteName,'${stationName}')&$format=JSON`,
        {
          responseType: 'text',
        }
      );
    } else {
      return this.http.get(
        `${environment.API_URL}/MOTC/v2/Cycling/Shape/${city}?$format=JSON`,
        {
          responseType: 'text',
        }
      );
    }
  }

  getViews(lat: number, lon: number, range: number) {
    return this.http.get(
      `${environment.API_URL}/MOTC/v2/Tourism/ScenicSpot?$spatialFilter=nearby(${lat},${lon},${range})&$format=JSON`,
      {
        responseType: 'text',
      }
    );
  }

  getFood(lat: number, lon: number, range: number) {
    return this.http.get(
      `${environment.API_URL}/MOTC/v2/Tourism/Restaurant?$spatialFilter=nearby(${lat},${lon},${range})&$format=JSON`,
      {
        responseType: 'text',
      }
    );
  }
}
