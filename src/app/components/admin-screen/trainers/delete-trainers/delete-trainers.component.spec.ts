import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTrainersComponent } from './delete-trainers.component';

describe('DeleteTrainersComponent', () => {
  let component: DeleteTrainersComponent;
  let fixture: ComponentFixture<DeleteTrainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTrainersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
