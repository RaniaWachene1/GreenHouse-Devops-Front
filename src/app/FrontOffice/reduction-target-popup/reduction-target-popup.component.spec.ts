import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductionTargetPopupComponent } from './reduction-target-popup.component';

describe('ReductionTargetPopupComponent', () => {
  let component: ReductionTargetPopupComponent;
  let fixture: ComponentFixture<ReductionTargetPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReductionTargetPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReductionTargetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
