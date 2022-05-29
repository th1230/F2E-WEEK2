import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFoodCardComponent } from './view-food-card.component';

describe('ViewFoodCardComponent', () => {
  let component: ViewFoodCardComponent;
  let fixture: ComponentFixture<ViewFoodCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFoodCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFoodCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
