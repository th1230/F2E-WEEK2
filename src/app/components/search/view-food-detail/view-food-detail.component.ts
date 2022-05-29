import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnyRecord } from 'dns';

@Component({
  selector: 'app-view-food-detail',
  templateUrl: './view-food-detail.component.html',
  styleUrls: ['./view-food-detail.component.scss'],
})
export class ViewFoodDetailComponent implements OnInit {
  constructor() {}
  @Output() triggerNext = new EventEmitter();
  @Input() data: any;
  @Input() type!: string;
  ngOnInit(): void {}

  ngAfterViewInit() {
    console.log(this.data);
  }

  touchOff() {
    this.triggerNext.emit();
    console.log('emit');
  }
}
