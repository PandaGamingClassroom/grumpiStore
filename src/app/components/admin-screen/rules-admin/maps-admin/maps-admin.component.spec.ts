import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsAdminComponent } from './maps-admin.component';

describe('MapsAdminComponent', () => {
  let component: MapsAdminComponent;
  let fixture: ComponentFixture<MapsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
