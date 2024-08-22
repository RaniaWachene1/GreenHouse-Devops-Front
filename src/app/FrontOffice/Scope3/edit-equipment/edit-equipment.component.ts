import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EquipmentService } from '../../../services/equipment.service';
import { Equipment } from '../../../models/equipment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-equipment',
  templateUrl: './edit-equipment.component.html',
  styleUrls: ['./edit-equipment.component.css']
})
export class EditEquipmentComponent implements OnInit {
  equipment: Equipment;
  selectedCategory: string;
  equipmentTypes: string[] = ['Projector', 'Air Conditioner', 'Computer', 'Printer'];

  constructor(
    public dialogRef: MatDialogRef<EditEquipmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: Equipment },
    private equipmentService: EquipmentService,
    private toastr: ToastrService
  ) {
    this.equipment = { ...data.equipment };
    this.selectedCategory = this.equipment.equipmentType;
  }

  ngOnInit(): void {}

  saveChanges(): void {
    this.equipment.equipmentType = this.selectedCategory;
    this.equipmentService.updateEquipment(this.equipment, this.equipment.idEquipment!).subscribe(
      (result) => {
        this.toastr.success('Equipment updated successfully.');
        this.dialogRef.close(result);
      },
      (error: any) => {
        console.error('Error updating equipment:', error);
        this.toastr.error('Error updating equipment.');
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
