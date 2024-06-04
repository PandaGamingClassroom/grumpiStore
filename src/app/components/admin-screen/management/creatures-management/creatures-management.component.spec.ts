import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaturesManagementComponent } from './creatures-management.component';

describe('CreaturesManagementComponent', () => {
  let component: CreaturesManagementComponent;
  let fixture: ComponentFixture<CreaturesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaturesManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreaturesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
