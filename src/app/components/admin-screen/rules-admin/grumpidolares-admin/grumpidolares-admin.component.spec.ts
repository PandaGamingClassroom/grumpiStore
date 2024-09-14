import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrumpidolaresAdminComponent } from './grumpidolares-admin.component';

describe('GrumpidolaresAdminComponent', () => {
  let component: GrumpidolaresAdminComponent;
  let fixture: ComponentFixture<GrumpidolaresAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrumpidolaresAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrumpidolaresAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
