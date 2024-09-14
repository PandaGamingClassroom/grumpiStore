import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalsAdminComponent } from './medals-admin.component';

describe('MedalsAdminComponent', () => {
  let component: MedalsAdminComponent;
  let fixture: ComponentFixture<MedalsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalsAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedalsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
