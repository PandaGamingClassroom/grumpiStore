import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesAdminComponent } from './rules-admin.component';

describe('RulesComponent', () => {
  let component: RulesAdminComponent;
  let fixture: ComponentFixture<RulesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RulesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
