import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalsStoreComponent } from './medals-store.component';

describe('MedalsStoreComponent', () => {
  let component: MedalsStoreComponent;
  let fixture: ComponentFixture<MedalsStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalsStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedalsStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
