import { TestBed } from '@angular/core/testing';

import { PageManagerService } from './page-manager.service';

describe('PageManagerService', () => {
  let service: PageManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
