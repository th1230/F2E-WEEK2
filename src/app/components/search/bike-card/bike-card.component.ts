import { MapManagerService } from './../map/map-manager.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bike-card',
  templateUrl: './bike-card.component.html',
  styleUrls: ['./bike-card.component.scss'],
})
export class BikeCardComponent implements OnInit {
  @Input() data: any;
  @Input() index!: number;
  @Input() isActive: boolean = false;
  @Output() Clicked = new EventEmitter();

  constructor(private MapManagerService: MapManagerService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

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

  cardClick() {
    if (this.index != undefined) {
      this.MapManagerService.bikeCardClick(
        this.index,
        this.data.StationPosition.PositionLat,
        this.data.StationPosition.PositionLon
      );
    }

    this.Clicked.emit();
  }
}
