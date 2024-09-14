import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrumpisAdminComponent } from './grumpis-admin.component';

describe('GrumpisAdminComponent', () => {
  let component: GrumpisAdminComponent;
  let fixture: ComponentFixture<GrumpisAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrumpisAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrumpisAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
