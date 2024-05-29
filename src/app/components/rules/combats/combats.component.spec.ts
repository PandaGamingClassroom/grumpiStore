import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatsComponent } from './combats.component';

describe('CombatsComponent', () => {
  let component: CombatsComponent;
  let fixture: ComponentFixture<CombatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CombatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
