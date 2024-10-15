import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroAdminComponent } from './intro-admin.component';

describe('CareerComponent', () => {
  let component: IntroAdminComponent;
  let fixture: ComponentFixture<IntroAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntroAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
