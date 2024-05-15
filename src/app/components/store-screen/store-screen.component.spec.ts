import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreScreenComponent } from './store-screen.component';

describe('StoreScreenComponent', () => {
  let component: StoreScreenComponent;
  let fixture: ComponentFixture<StoreScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
