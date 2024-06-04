import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergiesManagementComponent } from './energies-management.component';

describe('EnergiesManagementComponent', () => {
  let component: EnergiesManagementComponent;
  let fixture: ComponentFixture<EnergiesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergiesManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnergiesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
