import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFoodDetailComponent } from './view-food-detail.component';

describe('ViewFoodDetailComponent', () => {
  let component: ViewFoodDetailComponent;
  let fixture: ComponentFixture<ViewFoodDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFoodDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFoodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
