import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendAdminComponent } from './legend-admin.component';

describe('LegendAdminComponent', () => {
  let component: LegendAdminComponent;
  let fixture: ComponentFixture<LegendAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegendAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LegendAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
