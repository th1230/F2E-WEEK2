import { TestBed } from '@angular/core/testing';

import { ApiKeyHeaderInterceptor } from './api-key-header.interceptor';

describe('ApiKeyHeaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiKeyHeaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiKeyHeaderInterceptor = TestBed.inject(ApiKeyHeaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
