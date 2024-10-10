import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarWebComponent } from './nav-bar-web.component';

describe('NavBarWebComponent', () => {
  let component: NavBarWebComponent;
  let fixture: ComponentFixture<NavBarWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarWebComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
