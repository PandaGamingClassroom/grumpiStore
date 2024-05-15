import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersAdminComponent } from './trainers-admin.component';

describe('TrainersAdminComponent', () => {
  let component: TrainersAdminComponent;
  let fixture: ComponentFixture<TrainersAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainersAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
