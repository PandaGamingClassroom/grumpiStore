import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTheAppComponent } from './about-the-app.component';

describe('AboutTheAppComponent', () => {
  let component: AboutTheAppComponent;
  let fixture: ComponentFixture<AboutTheAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTheAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutTheAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
