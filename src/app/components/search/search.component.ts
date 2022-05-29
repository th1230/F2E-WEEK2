import { PageManagerService } from './../../service/page-manager.service';
import { DataMangerService } from './../../service/data-manger.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  advance: { isAdOpen: boolean; dis: boolean; dir: boolean } = {
    isAdOpen: true,
    dis: false,
    dir: false,
  };

  formdata: {
    dis: string;
    dir: string;
  } = {
    dis: '',
    dir: '',
  };
  itemCount: number = 0;

  disType: string = '距離';
  dirType: string = '方向';

  currentRouter: any;
  currentPage: number = 1;
  maxPage: number = 1;
  step: number = 1;

  paramsSubscription = new Subscription();
  stateSubscription = new Subscription();
  lineSubscription = new Subscription();
  favSubscription = new Subscription();

  pageSubscription = new Subscription();
  maxPageSubscription = new Subscription();

  currentbikeState: any = '';
  currentbikeActive: number = -1;

  currentlinedata: any = '';
  currentlineActive: number = -1;
  currentlinefavdata: any = '';
  onelinefav: any = '';
  favdetail: { data: any; type: string } = { data: '', type: '' };

  isdetailClose: boolean = false;

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private DataMangerService: DataMangerService,
    private PageManagerService: PageManagerService
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.activeRouter.paramMap.subscribe(
      (params: ParamMap) => {
        this.currentRouter = params.get('id');
        this.currentPage = 1;
        this.reset();
        if (window.innerWidth <= 450) {
          this.isdetailClose = true;
        }
      }
    );

    this.activeRouter.queryParams.subscribe((p) => {
      this.isdetailClose = false;
      this.router.navigate([], {
        relativeTo: this.activeRouter,
        queryParams: {},
      });
    });

    this.stateSubscription = this.DataMangerService.stateSub.subscribe((d) => {
      this.currentbikeState = d;
    });

    this.lineSubscription = this.DataMangerService.lineSub.subscribe((d) => {
      this.currentlinedata = d;
      this.step = 1;
      this.formdata.dis = '距離';
      this.formdata.dir = '方向';
      this.disType = '距離';
      this.dirType = '方向';
    });

    this.favSubscription = this.DataMangerService.favSub.subscribe((d) => {
      this.currentlinefavdata = d;
    });

    this.pageSubscription = this.PageManagerService.pageSub.subscribe((d) => {
      this.currentPage = d;
    });

    this.maxPageSubscription = this.PageManagerService.maxPageSub.subscribe(
      (d) => {
        this.maxPage = d;
      }
    );

    if (window.innerWidth <= 450) {
      console.log(123);
      this.isdetailClose = true;
    }
  }

  toggleAdvance() {
    this.advance.isAdOpen = !this.advance.isAdOpen;
    if (this.advance.isAdOpen == false) {
      this.advance.dis = false;
      this.advance.dir = false;
    }
  }

  setForm(e: Event, type: string) {
    if (type == 'dis') {
      this.formdata.dis = (e.target as HTMLInputElement).innerText;
      this.disType = this.formdata.dis;
      this.advance.dis = false;
      this.itemCount = 0;
      for (let i = 0; i < this.currentlinedata.length; i++) {
        if (!this.lineCardClose(this.currentlinedata[i])) {
          this.itemCount++;
        }
      }
      this.PageManagerService.setTotalCount(this.itemCount);
    } else {
      this.formdata.dir = (e.target as HTMLInputElement).innerText;
      this.dirType = this.formdata.dir;
      this.advance.dir = false;
      this.itemCount = 0;
      for (let i = 0; i < this.currentlinedata.length; i++) {
        if (!this.lineCardClose(this.currentlinedata[i])) {
          this.itemCount++;
        }
      }
      this.PageManagerService.setTotalCount(this.itemCount);
    }
  }

  lineCardClose(item: any) {
    if (this.dirType != '方向' && this.disType != '距離') {
      if (this.dirType != item.Direction) {
        return true;
      } else {
        if (this.disType == '遠' && item.CyclingLength < 10000) {
          return true;
        } else if (
          this.disType == '中' &&
          (item.CyclingLength >= 10000 || item.CyclingLength < 5000)
        ) {
          return true;
        } else if (this.disType == '近' && item.CyclingLength >= 5000) {
          return true;
        }
      }
    } else if (this.dirType != '方向') {
      if (this.dirType != item.Direction) {
        return true;
      }
    } else {
      if (this.disType == '遠' && item.CyclingLength < 10000) {
        return true;
      } else if (
        this.disType == '中' &&
        (item.CyclingLength >= 10000 || item.CyclingLength < 5000)
      ) {
        return true;
      } else if (this.disType == '近' && item.CyclingLength >= 5000) {
        return true;
      }
    }

    return false;
  }

  toggleSelect(select: string) {
    if (select == 'dis') {
      this.advance.dis = !this.advance.dis;
    } else if (select == 'dir') {
      this.advance.dir = !this.advance.dir;
    }
  }

  setStep(str: string) {
    if (str == 'next') {
      this.step++;
    } else if (str == 'prev') {
      this.step--;
    }
  }

  cardTrigger(index: number, type: string) {
    this.setStep('next');
    if (type == 'selectCard') {
      this.onelinefav = this.currentlinefavdata[index];
      console.log(this.onelinefav);
    } else if (type == 'view') {
      this.favdetail.data = this.onelinefav.view[index];
      this.favdetail.type = 'view';
    } else {
      this.favdetail.data = this.onelinefav.food[index];
      this.favdetail.type = 'food';
    }
  }

  bikeClicked(index: number) {
    this.currentbikeActive = index;
  }

  lineClicked(index: number) {
    this.currentlineActive = index;
  }

  setPage(type: string) {
    this.PageManagerService.setPage(type);
  }

  toggledetail() {
    this.isdetailClose = !this.isdetailClose;
  }

  reset() {
    this.currentPage = 1;
    this.maxPage = 1;
    this.step = 1;
    this.currentbikeState = '';
    this.currentbikeActive = -1;
    this.currentlinedata = '';
    this.currentlineActive = -1;
    this.currentlinefavdata = '';
    this.onelinefav = '';
    this.favdetail = { data: '', type: '' };
    this.isdetailClose = false;
  }
}
