import { MapManagerService } from './map-manager.service';
import { DataMangerService } from './../../../service/data-manger.service';
import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  stateSubscription = new Subscription();
  bikeCardSubscription = new Subscription();
  paramsSubscription = new Subscription();

  lineSubscription = new Subscription();
  favSubscription = new Subscription();
  lineCardSubscription = new Subscription();

  setViewSubscription = new Subscription();

  constructor(
    private DataMangerService: DataMangerService,
    private MapManagerService: MapManagerService,
    private activeRouter: ActivatedRoute
  ) {}

  markers: any[] = [];
  lineMarkers: any[] = [];
  lastClickMarker: number = -1;

  map: any;
  markertL: any;
  currentbikeState: any;

  lines: any[] = [];
  currentLines: any;
  currentfavs: any;
  markerClusterGroup = L.markerClusterGroup();

  ngOnInit(): void {
    this.paramsSubscription = this.activeRouter.paramMap.subscribe(
      (params: ParamMap) => {
        this.clearLines();
        this.clearMarkers('markers');
        this.clearMarkers('lineMarkers');
        this.reset();
      }
    );

    this.map = L.map('map', { center: [25.0249211, 121.5075035], zoom: 16 }); //指定欲繪製地圖在id為map的元素中，中心座標為[25.0249211,121.5075035]，縮放程度為16
    const tiles = L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoidG9tc3llaCIsImEiOiJja3czYW43bjMwbGRlMnVuaHRneG5ndXZnIn0.3oJcVh2JLgHZux5t_j6T3Q',
      }
    );

    tiles.addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((g) => {
        this.map.setView([g.coords.latitude, g.coords.longitude], 13);
      });
    }

    this.stateSubscription = this.DataMangerService.stateSub.subscribe((d) => {
      this.currentbikeState = d;
      this.clearMarkers('markers');
      if (this.map) {
        this.map.removeLayer(this.markerClusterGroup);
      }
      this.markerClusterGroup = L.markerClusterGroup();
      for (let i = 0; i < this.currentbikeState.length; i++) {
        this.setMarker('bike', this.currentbikeState[i], i, 'normal');
      }
      if (this.map) {
        this.map.addLayer(this.markerClusterGroup);
      }
    });

    this.bikeCardSubscription = this.MapManagerService.bikeCardSub.subscribe(
      (d) => {
        if (d.index != -1 && d.lat != 0 && d.lon != 0) {
          this.map.setView([d.lat, d.lon], 20);

          let iconActive = L.icon({
            iconUrl: 'assets/images/activeIcon.png',
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -8],
          });

          let iconNormal = L.icon({
            iconUrl: 'assets/images/bikeIcon.png',
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -8],
          });

          let popup = this.markers[d.index].getPopup();
          this.markerClusterGroup.removeLayer(this.markers[d.index]);
          let marker = L.marker([d.lat, d.lon], {
            icon: iconActive,
            zIndexOffset: 1000,
          }).bindPopup(popup);

          this.markers[d.index].remove();
          this.markers.splice(d.index, 1, marker);
          this.markers[d.index].openPopup();
          this.markerClusterGroup.addLayer(marker);

          if (this.lastClickMarker != -1) {
            console.log(this.lastClickMarker);
            let popup = this.markers[this.lastClickMarker].getPopup();

            this.markerClusterGroup.removeLayer(
              this.markers[this.lastClickMarker]
            );
            this.markers[this.lastClickMarker].remove();
            let marker = L.marker([d.lat, d.lon], {
              icon: iconNormal,
            }).bindPopup(popup);
            this.markers.splice(this.lastClickMarker, 1, marker);

            this.markerClusterGroup.addLayer(
              this.markers[this.lastClickMarker]
            );
          }

          this.lastClickMarker = d.index;
        }
      }
    );

    this.lineSubscription = this.DataMangerService.lineSub.subscribe((d) => {
      this.currentLines = d;
      this.clearLines();
      this.clearMarkers('markers');
      this.clearMarkers('lineMarkers');

      for (let i = 0; i < this.currentLines.length; i++) {
        if (i == 0) {
          this.setLine(this.currentLines[i], 'normal', i);
        } else {
          this.setLine(this.currentLines[i], 'normal');
        }
      }
    });

    this.lineCardSubscription = this.MapManagerService.lineCardSub.subscribe(
      (d) => {
        this.clearMarkers('markers');
        this.clearMarkers('lineMarkers');
        this.clearLines();

        this.setLine(this.currentLines[d], 'active', d);
        for (let i = 0; i < this.currentfavs[d].food.length; i++) {
          this.setMarker('food', this.currentfavs[d].food[i], i, 'food');
        }
        for (let i = 0; i < this.currentfavs[d].view.length; i++) {
          this.setMarker('view', this.currentfavs[d].view[i], i, 'view');
        }
      }
    );

    this.favSubscription = this.DataMangerService.favSub.subscribe((d) => {
      this.clearMarkers('markers');
      this.currentfavs = d;

      this.markerClusterGroup = L.markerClusterGroup();

      for (let i = 0; i < this.currentfavs.length; i++) {
        for (let j = 0; j < this.currentfavs[i].food.length; j++) {
          this.setMarker('food', this.currentfavs[i].food[j], j, 'food');
        }
        for (let k = 0; k < this.currentfavs[i].view.length; k++) {
          this.setMarker('view', this.currentfavs[i].view[k], k, 'view');
        }
      }
    });

    this.setViewSubscription = this.MapManagerService.setViewSub.subscribe(
      (d) => {
        console.log(d);
        this.map.setView([d.lat, d.lon], 20);
      }
    );
  }

  status(type: string, value: number, value2?: number) {
    if (type == 'ServiceStatus') {
      if (value == 0) {
        return '正常營運';
      } else if (value == 1) {
        return '暫停營運';
      } else {
        return '停止營運';
      }
    } else if (type == 'AvailableBikes') {
      if (value == 0) {
        return '已無單車';
      } else if (value2 == 0) {
        return '車位已滿';
      } else {
        return '尚有單車';
      }
    }

    return console.log('輸入錯誤');
  }

  setMarker(type: string, data: any, index: number, iconType: string) {
    let iconActive = L.icon({
      iconUrl: 'assets/images/activeIcon.png',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -8],
    });

    let iconNormal = L.icon({
      iconUrl: 'assets/images/bikeIcon.png',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -8],
    });

    let iconFood = L.icon({
      iconUrl: 'assets/images/foodIcon.png',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -8],
    });

    let iconView = L.icon({
      iconUrl: 'assets/images/viewIcon.png',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -8],
    });

    if (type == 'bike') {
      let popupOptions = { className: 'customPopup', maxWidth: 1000 };

      let serviceStatus;
      let availbike;
      let availrent;
      let availreturn;

      if (this.status('ServiceStatus', data.ServiceStatus) == '暫停營運') {
        serviceStatus = 'ban';
      } else if (
        this.status('ServiceStatus', data.ServiceStatus) == '停止營運'
      ) {
        serviceStatus = 'stop';
      } else {
        serviceStatus = '';
      }

      if (
        this.status(
          'AvailableBikes',
          data.AvailableRentBikes,
          data.AvailableReturnBikes
        ) == '已無單車'
      ) {
        availbike = 'ban';
      } else if (
        this.status(
          'AvailableBikes',
          data.AvailableRentBikes,
          data.AvailableReturnBikes
        ) == '車位已滿'
      ) {
        availbike = 'warn';
      } else {
        availbike = '';
      }

      if (data.AvailableRentBikes == 0) {
        availrent = 'ban';
      } else if (isNaN(data.AvailableRentBikes)) {
        availrent = 'stop';
      } else {
        availrent = '';
      }

      if (data.AvailableReturnBikes == 0) {
        availreturn = 'warn';
      } else {
        availreturn = '';
      }

      let str = `<div class="bikedetail">
      <h1>${data.StationName.Zh_tw}</h1>
      <div class="tick">
        <img
          src="assets/images/Subtract.png"
          style="width: 16; height: 20px"
          alt="sub"
        />
        <p>${data.StationAddress.Zh_tw}</p>
      </div>
      <div class="tick">
        <img
          src="assets/images/time.png"
          style="width: 20; height: 20px"
          alt="time"
        />
        <p>${data.SrcUpdateTime}</p>
      </div>
      <div class="bikestate">
<div
  class="type ${serviceStatus}"
>
  ${this.status('ServiceStatus', data.ServiceStatus)}
</div>
<div
  class="type ${availbike}"
>

    ${this.status(
      'AvailableBikes',
      data.AvailableRentBikes,
      data.AvailableReturnBikes
    )}
</div>
</div>

      <div class="status">
        <div class='${availrent}'>
          <h1>可借單車</h1>
          <p>${data.AvailableRentBikes}</p>
        </div>
        <div  class='${availreturn}'>
          <h1>可停空位</h1>
          <p>${data.AvailableReturnBikes}</p>
        </div>
      </div>
    </div>`;
      let icon;

      if (iconType == 'active') {
        icon = iconActive;
      } else {
        icon = iconNormal;
      }

      let marker = L.marker(
        [data.StationPosition.PositionLat, data.StationPosition.PositionLon],
        { riseOnHover: true }
      )
        .setIcon(icon)
        .bindPopup(str, popupOptions);

      this.markerClusterGroup.addLayer(marker);

      if (index == 0 && this.map) {
        this.map.setView(
          [data.StationPosition.PositionLat, data.StationPosition.PositionLon],
          13
        );
      }

      this.markers.push(marker);
    } else if (type == 'food') {
      let marker = L.marker(
        [data.Position.PositionLat, data.Position.PositionLon],
        { riseOnHover: true }
      )
        .setIcon(iconFood)
        .bindPopup(data.Name)
        .on('click', (e) => {
          e.target.zIndexOffset = 1000;
        })
        .off('click', (e) => {
          e.target.zIndexOffset = 0;
        });

      this.markerClusterGroup.addLayer(marker);

      this.markers.push(marker);
    } else if (type == 'view') {
      let marker = L.marker(
        [data.Position.PositionLat, data.Position.PositionLon],
        { riseOnHover: true }
      )
        .setIcon(iconView)
        .on('click', (e) => {
          e.target.zIndexOffset = 1000;
        })
        .off('click', (e) => {
          e.target.zIndexOffset = 0;
        })
        .bindPopup(data.Name);

      this.markerClusterGroup.addLayer(marker);

      this.markers.push(marker);
    }
  }

  clearMarkers(ArrName: string) {
    if (this.markers.length > 0 && ArrName == 'markers') {
      this.markers.forEach((d, index) => {
        this.map.removeLayer(d);
        this.markers[index].remove();
      });
      this.markerClusterGroup = L.markerClusterGroup();
      this.markers = [];
    }

    if (this.lineMarkers.length > 0 && ArrName == 'lineMarkers') {
      this.lineMarkers.forEach((d, index) => {
        this.map.removeLayer(d);
        this.lineMarkers[index].remove();
      });
      this.lineMarkers = [];
    }
  }

  setLine(line: any, iconType: string, index?: number) {
    const myStyle = {
      color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)})`,
      weight: 5,
    };

    const data = L.geoJSON(line.Geometry, {
      style: myStyle,
    })
      .bindPopup(line.RouteName)
      .on('click', (e) => {
        e.target.openPopup();
      })
      .addTo(this.map);
    if (index != undefined) {
      if (iconType == 'normal') {
        this.map.setView(
          [
            line.Geometry.coordinates[0][0][1],
            line.Geometry.coordinates[0][0][0],
          ],
          14
        );
      } else {
        if (iconType == 'active') {
          this.map.setView(
            [
              line.Geometry.coordinates[0][0][1],
              line.Geometry.coordinates[0][0][0],
            ],
            14
          );
        }
      }
    }

    data.addData(line.Geometry);
    this.lines.push(data);

    const iconNormal = L.icon({
      iconUrl: 'assets/images/linebeginIcon.png',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -8],
    });

    let iconActive = L.icon({
      iconUrl: 'assets/images/activeIcon.png',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -8],
    });

    let marker;

    for (let i = 0; i < line.Geometry.coordinates.length; i++) {
      marker = L.marker(
        [
          line.Geometry.coordinates[i][0][1],
          line.Geometry.coordinates[i][0][0],
        ],
        { icon: iconActive }
      )
        .bindPopup(
          `<p>路線起點座標:(${line.Geometry.coordinates[i][0][1]},${line.Geometry.coordinates[i][0][0]})</p>`
        )
        .addTo(this.map);

      this.lineMarkers.push(marker);

      marker = L.marker(
        [
          line.Geometry.coordinates[i][
            line.Geometry.coordinates[i].length - 1
          ][1],
          line.Geometry.coordinates[i][
            line.Geometry.coordinates[i].length - 1
          ][0],
        ],
        { icon: iconNormal }
      )
        .bindPopup(
          `<p>路線終點座標:(${
            line.Geometry.coordinates[i][
              line.Geometry.coordinates[i].length - 1
            ][1]
          },${
            line.Geometry.coordinates[i][
              line.Geometry.coordinates[i].length - 1
            ][0]
          })</p>`
        )
        .addTo(this.map);

      this.lineMarkers.push(marker);
    }
  }

  clearLines() {
    this.lines.forEach((d, index) => {
      this.map.removeLayer(d);
      this.lines[index].remove();
    });

    this.lines = [];
  }

  reset() {
    this.markers = [];
    this.lastClickMarker = -1;
    if (this.map) {
      this.map.removeLayer(this.markerClusterGroup);
    }
    this.markertL = '';
    this.currentbikeState = '';
    this.lines = [];
    this.currentLines = '';
    this.currentfavs = '';
    this.markerClusterGroup = L.markerClusterGroup();
  }
}
