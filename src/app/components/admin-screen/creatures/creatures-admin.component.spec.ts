import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaturesAdminComponent } from './creatures-admin.component';

describe('CreaturesAdminComponent', () => {
  let component: CreaturesAdminComponent;
  let fixture: ComponentFixture<CreaturesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaturesAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreaturesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
