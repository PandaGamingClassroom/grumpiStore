import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatsAdminComponent } from './combats-admin.component';

describe('CombatsAdminComponent', () => {
  let component: CombatsAdminComponent;
  let fixture: ComponentFixture<CombatsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombatsAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CombatsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
