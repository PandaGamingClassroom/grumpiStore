import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueBadgesManagementComponent } from './league-badges-management.component';

describe('LeagueBadgesManagementComponent', () => {
  let component: LeagueBadgesManagementComponent;
  let fixture: ComponentFixture<LeagueBadgesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueBadgesManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeagueBadgesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
