import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompleteDataProfesorComponent } from './edit-complete-dataProfesor.component';

describe('TrainersEditComponent', () => {
  let component: EditCompleteDataProfesorComponent;
  let fixture: ComponentFixture<EditCompleteDataProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCompleteDataProfesorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCompleteDataProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
