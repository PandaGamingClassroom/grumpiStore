import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorAdmin } from './profesor-admin.component';

describe('TrainersAdminComponent', () => {
  let component: ProfesorAdmin;
  let fixture: ComponentFixture<ProfesorAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesorAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
