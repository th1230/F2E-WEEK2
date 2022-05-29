import { MapManagerService } from './../map/map-manager.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss'],
})
export class RouteCardComponent implements OnInit {
  @Output() triggerNext = new EventEmitter();
  @Input() data: any;
  @Input() index!: number;
  @Output() Clicked = new EventEmitter();
  @Input() isActive: boolean = false;

  constructor(private MapManagerService: MapManagerService) {}

  ngOnInit(): void {}

  touchOff() {
    this.triggerNext.emit();
    console.log('emit');
  }

  cardClick() {
    if (this.index != undefined) {
      this.MapManagerService.lineCardClick(this.index);
    }

    this.Clicked.emit();
  }
}
