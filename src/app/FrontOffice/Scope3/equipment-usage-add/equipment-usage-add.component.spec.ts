import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentUsageAddComponent } from './equipment-usage-add.component';

describe('EquipmentUsageAddComponent', () => {
  let component: EquipmentUsageAddComponent;
  let fixture: ComponentFixture<EquipmentUsageAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentUsageAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentUsageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
