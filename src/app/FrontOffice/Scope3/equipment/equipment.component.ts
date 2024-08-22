import { Component, OnInit } from '@angular/core';
import { Equipment } from '../../../models/equipment';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentService } from '../../../services/equipment.service';
import { AuthService } from '../../../services/auth.service';
import { EquipmentAddComponent } from '../equipment-add/equipment-add.component';
import { EditEquipmentComponent } from '../edit-equipment/edit-equipment.component';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.css'
})
export class EquipmentComponent implements OnInit {
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
  
    openDialog(): void {
      const dialogRef = this.dialog.open(EquipmentAddComponent, {
        width: '800px',
        height: '600px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadUserEquipment(); // Reload equipment after adding a new one
        }
        console.log('The dialog was closed');
      });
    }
  

  
    openEditDialog(equipment: Equipment): void {
      const dialogRef = this.dialog.open(EditEquipmentComponent, {
        width: '800px',
        height: '600px',
        data: { equipment }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.equipmentList.findIndex(e => e.idEquipment === result.idEquipment);
          if (index !== -1) {
            this.equipmentList[index] = result;
          }
        }
      });
    }
  }