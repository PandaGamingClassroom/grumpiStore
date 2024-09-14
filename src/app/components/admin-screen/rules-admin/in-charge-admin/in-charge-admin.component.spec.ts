import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InChargeAdminComponent } from './in-charge-admin.component';

describe('InChargeAdminComponent', () => {
  let component: InChargeAdminComponent;
  let fixture: ComponentFixture<InChargeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InChargeAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InChargeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
