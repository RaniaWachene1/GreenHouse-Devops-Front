import { Component, OnInit } from '@angular/core';
import { Equipment } from '../../../models/equipment';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentService } from '../../../services/equipment.service';
import { AuthService } from '../../../services/auth.service';
import { EquipmentAddComponent } from '../equipment-add/equipment-add.component';
import { EditEquipmentComponent } from '../edit-equipment/edit-equipment.component';
import { EquipmentUsageAddComponent } from '../equipment-usage-add/equipment-usage-add.component';
@Component({
  selector: 'app-equipment-usage',
  templateUrl: './equipment-usage.component.html',
  styleUrl: './equipment-usage.component.css'
})
export class EquipmentUsageComponent  implements OnInit {
  equipmentList: Equipment[] = [];
  searchText = '';
  userId: number | undefined;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private equipmentService: EquipmentService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.idUser;
        this.loadUserEquipment();
      }
    });
  }

  loadUserEquipment(): void {
    if (this.userId) {
      this.equipmentService.getEquipmentByUserId(this.userId).subscribe(equipment => {
        this.equipmentList = equipment;
      });
    }
  }

 


  openEditDialog(equipment: { idEquipment: any; co2Emissions: any; }): void {
    const dialogRef = this.dialog.open(EquipmentUsageAddComponent, {
      width: '800px',
      height: '400px',
      data: { id: equipment.idEquipment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the equipment list with the new CO2 emissions value
        equipment.co2Emissions = result;
      }
    });
  }
}