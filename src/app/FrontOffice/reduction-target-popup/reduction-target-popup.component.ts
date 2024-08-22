import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reduction-target-popup',
  templateUrl: './reduction-target-popup.component.html',
  styleUrl: './reduction-target-popup.component.css'
})
export class ReductionTargetPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ReductionTargetPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { endYear: number; reductionAmbition: number }
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
