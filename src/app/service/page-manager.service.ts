import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PageManagerService {
  currentPage: number = -1;
  totalCount: number = -1;

  pageSub = new Subject<number>();
  maxPageSub = new Subject<number>();
  constructor() {}

  setPage(type: string) {
    if (type == '+') {
      if ((this.currentPage + 1) * 5 - this.totalCount < 5) {
        this.currentPage++;
        this.pageSub.next(this.currentPage);
      }
    } else if ((this.currentPage - 1) * 5 > 0) {
      this.currentPage--;
      this.pageSub.next(this.currentPage);
    }

    console.log(this.currentPage);
  }

  setTotalCount(total: number) {
    this.currentPage = 1;
    this.totalCount = total;
    this.pageSub.next(this.currentPage);

    let max;
    if (this.totalCount % 5 > 0) {
      max = Math.floor(this.totalCount / 5) + 1;
    } else if (this.totalCount % 5 == 0) {
      max = this.totalCount / 5;
    } else if (this.totalCount == 0) {
      max = 0;
    }

    this.maxPageSub.next(max);
  }
}
