import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrumpidolarsComponent } from './grumpidolars.component';

describe('GrumpidolarsComponent', () => {
  let component: GrumpidolarsComponent;
  let fixture: ComponentFixture<GrumpidolarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrumpidolarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrumpidolarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
