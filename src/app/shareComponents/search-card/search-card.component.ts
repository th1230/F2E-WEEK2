import { PageManagerService } from './../../service/page-manager.service';
import { DataMangerService } from './../../service/data-manger.service';
import { DataServiceService } from './../../service/data-service.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { cityName, routeCityName } from 'src/app/service/cityName';
import { Subject, Subscription } from 'rxjs';

const Wkt = require('wicket');

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent implements OnInit {
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private DataService: DataServiceService,
    private DataMangerService: DataMangerService,
    private PageManagerService: PageManagerService
  ) {}

  paramsSub = new Subscription();
  querySub = new Subscription();

  currentRouter: any;
  isCardOpen: boolean = true;
  isCityOpen: boolean = false;
  cityName: { zh: string; en: string }[] = [];

  filterData: { [key: string]: any }[] = [];
  favdata: { food: {}[]; view: {}[] }[] = [];

  selectCity = '縣市';

  value: string = '';

  formdata: {
    inputText: string;
    city: string;
  } = {
    inputText: '',
    city: '',
  };

  ngOnInit(): void {
    this.paramsSub = this.activeRouter.paramMap.subscribe(
      (params: ParamMap) => {
        this.reset();
        this.currentRouter = params.get('id');

        this.isCardOpen = true;
        if (this.currentRouter == 'bike') {
          this.cityName = cityName;
        } else {
          this.cityName = routeCityName;
        }
      }
    );

    this.selectCity = '縣市';

    this.querySub = this.activeRouter.queryParams.subscribe((p) => {
      if (p.city && (p.inputText || p.inputText == '')) {
        console.log(p);
        this.formdata.inputText = p.inputText;
        this.formdata.city = p.city;
        this.value = p.inputText;

        this.cityName.forEach((c) => {
          if (c.en == this.formdata.city) {
            this.selectCity = c.zh;
          }
        });
        this.send();
      }
    });
  }

  selectedCity(e: Event) {
    this.isCityOpen = false;
    this.cityName.forEach((c) => {
      if (c.zh == (e.target as HTMLInputElement).innerText) {
        this.formdata.city = c.en;
        this.selectCity = c.zh;
      }
    });
  }

  toggleCard() {
    this.isCardOpen = !this.isCardOpen;
    this.isCityOpen = false;
  }

  toggleCity() {
    this.isCityOpen = !this.isCityOpen;
  }

  send() {
    if (this.currentRouter == 'bike') {
      this.getBikedata();
    } else {
      this.getRoutedata();
    }

    this.isCardOpen = false;
  }

  getBikedata() {
    this.DataMangerService.sendData('station', []);
    this.formdata.inputText = this.value;
    this.filterData = [];
    if (this.formdata.city != '' && this.formdata.inputText != '') {
      this.DataService.getBikeStation(
        this.formdata.city,
        this.formdata.inputText
      ).subscribe((d) => {
        let data = JSON.parse(d);
        let availdata: any[] = [];

        let sub = new Subject();
        for (let i = 0; i < data.length; i++) {
          this.DataService.getBikeAvailability(
            this.formdata.city,
            data[i].StationUID
          ).subscribe((d) => {
            availdata.push(...JSON.parse(d));
            sub.next(availdata);
          });
        }

        sub.subscribe((d) => {
          if (availdata.length == data.length) {
            for (let i = 0; i < availdata.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (availdata[i].StationUID === data[j].StationUID) {
                  this.filterData.push({
                    StationName: data[j].StationName,
                    StationAddress: data[j].StationAddress,
                    StationPosition: data[j].StationPosition,
                    ...availdata[i],
                  });
                }
              }
            }
            this.DataMangerService.sendData('station', this.filterData);
            this.PageManagerService.setTotalCount(this.filterData.length);
          }
        });
      });
    } else if (this.formdata.city != '' && this.formdata.inputText == '') {
      this.DataService.getBikeStation(
        this.formdata.city,
        this.formdata.inputText
      ).subscribe((d) => {
        let data = JSON.parse(d);
        let availdata;
        this.DataService.getBikeAvailability(this.formdata.city).subscribe(
          (d) => {
            availdata = JSON.parse(d);
            for (let i = 0; i < availdata.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (availdata[i].StationUID === data[j].StationUID) {
                  this.filterData.push({
                    StationName: data[j].StationName,
                    StationAddress: data[j].StationAddress,
                    StationPosition: data[j].StationPosition,
                    ...availdata[i],
                  });
                }
              }
            }
            this.DataMangerService.sendData('station', this.filterData);
            this.PageManagerService.setTotalCount(this.filterData.length);
          }
        );
      });
    }
  }

  getRoutedata() {
    this.DataMangerService.sendData('station', []);
    this.formdata.inputText = this.value;
    this.filterData = [];
    if (this.formdata.city != '') {
      this.DataService.getRoutes(
        this.formdata.city,
        this.formdata.inputText
      ).subscribe((d) => {
        let data = JSON.parse(d);

        var wkt = new Wkt.Wkt();
        for (let i = 0; i < data.length; i++) {
          let geoJSON = wkt.read(data[i].Geometry).toJson();
          this.filterData.push({ ...data[i], Geometry: geoJSON });
        }

        this.getViewAndFood();

        this.DataMangerService.sendData('line', this.filterData);
        this.PageManagerService.setTotalCount(this.filterData.length);
      });
    }
  }

  getViewAndFood() {
    let datasub = new Subject();
    this.favdata = [];

    this.filterData.forEach((d, index) => {
      this.favdata.push({
        food: [],
        view: [],
      });
      for (let i = 0; i < d.Geometry.coordinates.length; i++) {
        let midlat =
          d.Geometry.coordinates[i][
            Math.floor(d.Geometry.coordinates[i].length / 2)
          ][1];
        let midlon =
          d.Geometry.coordinates[i][
            Math.floor(d.Geometry.coordinates[i].length / 2)
          ][0];

        let range = Math.floor(d.CyclingLength / 3.5);
        this.DataService.getViews(midlat, midlon, range).subscribe((v) => {
          let viewdata = JSON.parse(v);

          this.DataService.getFood(midlat, midlon, range).subscribe((f) => {
            let fooddata = JSON.parse(f);
            this.favdata[index].food.push(...fooddata);
            this.favdata[index].view.push(...viewdata);
            if (index == this.filterData.length - 1) {
              datasub.next(this.favdata);
            }
          });
        });
      }
    });

    datasub.subscribe((fav) => {
      this.DataMangerService.sendData('foodAndview', fav);
    });
  }

  reset() {
    this.isCardOpen = true;
    this.isCityOpen = false;
    this.filterData = [];
    this.favdata = [];
    this.selectCity = '縣市';
    this.value = '';
    this.formdata = {
      inputText: '',
      city: '',
    };
  }
}
