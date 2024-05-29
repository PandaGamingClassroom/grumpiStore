import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestsComponent } from './rests.component';

describe('RestsComponent', () => {
  let component: RestsComponent;
  let fixture: ComponentFixture<RestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
