import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpCheckoutComponent } from './mp-checkout.component';

describe('MpCheckoutComponent', () => {
  let component: MpCheckoutComponent;
  let fixture: ComponentFixture<MpCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
