import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLoginModalComponentComponent } from './error-login-modal-component.component';

describe('ErrorLoginModalComponentComponent', () => {
  let component: ErrorLoginModalComponentComponent;
  let fixture: ComponentFixture<ErrorLoginModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorLoginModalComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorLoginModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
