import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrumpisComponent } from './grumpis.component';

describe('GrumpisComponent', () => {
  let component: GrumpisComponent;
  let fixture: ComponentFixture<GrumpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrumpisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrumpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
