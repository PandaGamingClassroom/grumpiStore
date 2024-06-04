import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueBadgesComponent } from './league-badges.component';

describe('LeagueBadgesComponent', () => {
  let component: LeagueBadgesComponent;
  let fixture: ComponentFixture<LeagueBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueBadgesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeagueBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
