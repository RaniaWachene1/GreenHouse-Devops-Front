import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmissionService } from '../../../services/emission.service';

@Component({
  selector: 'app-equipment-usage-add',
  templateUrl: './equipment-usage-add.component.html',
  styleUrl: './equipment-usage-add.component.css'
})
export class EquipmentUsageAddComponent  {
 powerRating: number | undefined;
annualUsageHours: number | undefined;

constructor(
  public dialogRef: MatDialogRef<EquipmentUsageAddComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private emissionService: EmissionService
) { }

onClose(): void {
  this.dialogRef.close();
}


onSubmit(): void {
  if (this.powerRating !== undefined && this.annualUsageHours !== undefined) {
    const equipmentData = {
      powerRating: this.powerRating,
      annualUsageHours: this.annualUsageHours
    };
    this.emissionService.calculateCO2FromEquipment(this.data.id, equipmentData).subscribe(response => {
      console.log('Response from backend:', response);
      this.dialogRef.close(response);
    });
  } else {
    console.error('Power Rating and Annual Usage Hours are required');
  }
}
}
