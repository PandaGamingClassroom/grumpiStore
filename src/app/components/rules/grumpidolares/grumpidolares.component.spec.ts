import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrumpidolaresComponent } from './grumpidolares.component';

describe('GrumpidolaresComponent', () => {
  let component: GrumpidolaresComponent;
  let fixture: ComponentFixture<GrumpidolaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrumpidolaresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrumpidolaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
