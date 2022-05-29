import { TestBed } from '@angular/core/testing';

import { DataMangerService } from './data-manger.service';

describe('DataMangerService', () => {
  let service: DataMangerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataMangerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
