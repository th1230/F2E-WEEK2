import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataMangerService {
  constructor(private activeRouter: ActivatedRoute) {}

  stationData: any;
  lineData: any;
  foodAndviewData: { food: any[]; view: any[] }[] = [];
  currentRouter: any;
  paramsSubscription = new Subscription();

  stateSub = new Subject();
  lineSub = new Subject();
  favSub = new Subject();

  ngOnInit(): void {
    this.activeRouter.paramMap.subscribe((params: ParamMap) => {
      this.currentRouter = params.get('id');
      this.stationData = undefined;
      this.lineData = undefined;
      this.foodAndviewData = [];
    });
  }

  sendData(type: string, data: any) {
    if (type == 'station') {
      this.stationData = data;
      this.stateSub.next(this.stationData);
    } else if (type == 'line') {
      this.lineData = data;
      this.lineSub.next(this.lineData);
    } else if (type == 'foodAndview') {
      this.foodAndviewData = data;
      this.favSub.next(this.foodAndviewData);
    }
  }
}
