import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObtainEnergiesAdmin } from './energies-admin.component';

describe('ObtainEnergiesAdmin', () => {
  let component: ObtainEnergiesAdmin;
  let fixture: ComponentFixture<ObtainEnergiesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObtainEnergiesAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ObtainEnergiesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
