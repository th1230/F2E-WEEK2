import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapManagerService } from '../map/map-manager.service';

@Component({
  selector: 'app-view-food-card',
  templateUrl: './view-food-card.component.html',
  styleUrls: ['./view-food-card.component.scss'],
})
export class ViewFoodCardComponent implements OnInit {
  constructor(private MapManagerService: MapManagerService) {}
  @Output() triggerNext = new EventEmitter();
  @Input() data: any;
  @Input() type!: string;
  @Input() index!: number;
  ngOnInit(): void {}

  ngAfterViewInit() {
    console.log(this.data);
  }

  touchOff() {
    this.triggerNext.emit();
    console.log('emit');
  }

  cardClick() {
    if (this.index != undefined) {
      console.log(this.data);
      this.MapManagerService.setView(
        this.data.Position.PositionLat,
        this.data.Position.PositionLon
      );
    }
  }
}
