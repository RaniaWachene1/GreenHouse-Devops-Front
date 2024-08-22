import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { EquipmentService } from '../../../services/equipment.service';
import { Equipment } from '../../../models/equipment';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User'; // Ensure User model is imported

@Component({
  selector: 'app-equipment-add',
  templateUrl: './equipment-add.component.html',
  styleUrls: ['./equipment-add.component.css']
})
export class EquipmentAddComponent implements OnInit {
  userId: number | undefined;
  equipmentTypes: string[] = ['Projector', 'Air Conditioner', 'Computer', 'Printer'];

  equipment: Equipment = {
    idEquipment: null,  // Initialize to null
    equipmentType: '',
    equipmentName: '',
    equipmentRef: '',
    quantity: 0,
    powerRating: 0,
    annualUsageHours: 0,
    emissionFactor: 0,
    co2Emissions: 0,
    scope: 'SCOPE_3',
    emissionSource: 'EQUIPMENT',
    user: null,  // Initialize to null
    printerType: '',  // Initialize to empty string or appropriate default
    computerType: '',  // Initialize to empty string or appropriate default
    projectorType: '',  // Initialize to empty string or appropriate default
    acType: ''  // Initialize to empty string or appropriate default
  };

  constructor(
    public dialogRef: MatDialogRef<EquipmentAddComponent>,
    private http: HttpClient,
    private equipmentService: EquipmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.idUser;
        this.equipment.user = user; // Assign the user object to the equipment
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveEquipment(): void {
    if (this.userId) {
      this.equipmentService.addEquipment(this.equipment, this.userId).subscribe(
        response => {
          console.log('Equipment saved', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error saving equipment', error);
        }
      );
    } else {
      console.error('User ID is not available');
    }
  }
}
