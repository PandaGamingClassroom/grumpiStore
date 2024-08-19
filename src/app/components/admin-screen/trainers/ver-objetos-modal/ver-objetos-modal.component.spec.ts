import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerObjetosModalComponent } from './ver-objetos-modal.component';

describe('VerObjetosModalComponent', () => {
  let component: VerObjetosModalComponent;
  let fixture: ComponentFixture<VerObjetosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerObjetosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerObjetosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
