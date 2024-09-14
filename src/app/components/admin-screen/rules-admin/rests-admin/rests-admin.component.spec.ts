import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestsAdminComponent } from './rests-admin.component';

describe('RestsAdminComponent', () => {
  let component: RestsAdminComponent;
  let fixture: ComponentFixture<RestsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestsAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
