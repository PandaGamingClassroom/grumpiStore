import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObjetosModalComponent } from './edit-objetos-modal.component';

describe('VerObjetosModalComponent', () => {
  let component: EditObjetosModalComponent;
  let fixture: ComponentFixture<EditObjetosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditObjetosModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditObjetosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
