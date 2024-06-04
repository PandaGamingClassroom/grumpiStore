import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalsManagementComponent } from './medals-management.component';

describe('MedalsManagementComponent', () => {
  let component: MedalsManagementComponent;
  let fixture: ComponentFixture<MedalsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedalsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
