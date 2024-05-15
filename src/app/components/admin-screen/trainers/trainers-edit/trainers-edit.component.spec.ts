import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersEditComponent } from './trainers-edit.component';

describe('TrainersEditComponent', () => {
  let component: TrainersEditComponent;
  let fixture: ComponentFixture<TrainersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainersEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
