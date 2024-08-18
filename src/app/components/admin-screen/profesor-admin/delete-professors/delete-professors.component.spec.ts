import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProfessorsComponent } from './delete-professors.component';

describe('DeleteTrainersComponent', () => {
  let component: DeleteProfessorsComponent;
  let fixture: ComponentFixture<DeleteProfessorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProfessorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProfessorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
