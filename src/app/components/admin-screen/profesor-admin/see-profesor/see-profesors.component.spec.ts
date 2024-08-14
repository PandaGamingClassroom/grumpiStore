import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeProfesorsComponent } from './see-profesors.component';

describe('SeeTrainersComponent', () => {
  let component: SeeProfesorsComponent;
  let fixture: ComponentFixture<SeeProfesorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeProfesorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeeProfesorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
