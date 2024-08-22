import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductionTargetComponent } from './reduction-target.component';

describe('ReductionTargetComponent', () => {
  let component: ReductionTargetComponent;
  let fixture: ComponentFixture<ReductionTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReductionTargetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReductionTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
