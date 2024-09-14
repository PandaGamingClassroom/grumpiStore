import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueAdminComponent } from './league-admin.component';

describe('LeagueAdminComponent', () => {
  let component: LeagueAdminComponent;
  let fixture: ComponentFixture<LeagueAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
