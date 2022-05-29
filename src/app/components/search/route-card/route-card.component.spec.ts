import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteCardComponent } from './route-card.component';

describe('RouteCardComponent', () => {
  let component: RouteCardComponent;
  let fixture: ComponentFixture<RouteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
