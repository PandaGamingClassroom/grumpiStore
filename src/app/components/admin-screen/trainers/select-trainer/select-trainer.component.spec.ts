import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTrainerComponent } from './select-trainer.component';

describe('SelectTrainerComponent', () => {
  let component: SelectTrainerComponent;
  let fixture: ComponentFixture<SelectTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTrainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
