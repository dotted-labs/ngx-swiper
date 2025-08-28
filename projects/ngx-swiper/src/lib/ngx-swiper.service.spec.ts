import { TestBed } from '@angular/core/testing';

import { NgxSwiperService } from './ngx-swiper.service';

describe('NgxSwiperService', () => {
  let service: NgxSwiperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSwiperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
