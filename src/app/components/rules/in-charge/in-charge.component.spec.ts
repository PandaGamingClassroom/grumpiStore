import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InChargeComponent } from './in-charge.component';

describe('InChargeComponent', () => {
  let component: InChargeComponent;
  let fixture: ComponentFixture<InChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InChargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
