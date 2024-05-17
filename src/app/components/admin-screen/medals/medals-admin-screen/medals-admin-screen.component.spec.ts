import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalsAdminScreenComponent } from './medals-admin-screen.component';

describe('MedalsAdminScreenComponent', () => {
  let component: MedalsAdminScreenComponent;
  let fixture: ComponentFixture<MedalsAdminScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalsAdminScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedalsAdminScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
