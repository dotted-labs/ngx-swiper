import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSwiperComponent } from './ngx-swiper.component';

describe('NgxSwiperComponent', () => {
  let component: NgxSwiperComponent;
  let fixture: ComponentFixture<NgxSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSwiperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
