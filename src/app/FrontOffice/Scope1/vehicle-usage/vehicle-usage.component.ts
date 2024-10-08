import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../models/vehicle.model';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { VehicleService } from '../../../services/vehicle.service';
import { EmissionService } from '../../../services/emission.service';
import { VehicleUsageModelComponent } from '../vehicle-usage-model/vehicle-usage-model.component';

@Component({
  selector: 'app-vehicle-usage',
  templateUrl: './vehicle-usage.component.html',
  styleUrls: ['./vehicle-usage.component.css']
})
export class VehicleUsageComponent implements OnInit {
  vehicles: Vehicle[] = [];
  searchText = '';
  userId: number | undefined;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private vehicleService: VehicleService,
    private emissionService: EmissionService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.idUser;
        this.loadUserVehicles();
      }
    });
  }

  loadUserVehicles(): void {
    if (this.userId) {
      this.vehicleService.getVehiclesByUserId(this.userId).subscribe(vehicles => {
        this.vehicles = vehicles;
      });
    }
  }

  getVehicleIcon(vehicle: Vehicle): string {
    if (vehicle.carType) {
      return 'fas fa-car'; // Font Awesome car icon
    } else if (vehicle.hgvType) {
      return 'fas fa-truck'; // Font Awesome truck icon
    } else if (vehicle.motorbikeType) {
      return 'fas fa-motorcycle'; // Font Awesome motorcycle icon
    } else if (vehicle.vanType) {
      return 'fas fa-shuttle-van'; // Font Awesome van icon
    } else {
      return 'fas fa-car-side'; // Default Font Awesome car icon
    }
  }

  addFuelConsumption(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(VehicleUsageModelComponent, {
      width: '600px',
      height: '400px',
      data: { vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        vehicle.fuelType = result.fuelType;
        vehicle.fuelConsumption = result.fuelConsumption;

        if (vehicle.idVehicle !== undefined) {
          this.vehicleService.updateVehicle(vehicle, vehicle.idVehicle).subscribe(() => {
            this.calculateVehicleEmissions(vehicle);
          }, error => {
            console.error('Error updating vehicle:', error);
          });
        } else {
          console.error('Vehicle ID is undefined');
        }
      }
    });
  }

  calculateVehicleEmissions(vehicle: Vehicle): void {
    this.emissionService.calculateCO2FromVehicle(vehicle.idVehicle!, vehicle.fuelConsumption!, vehicle.fuelType!).subscribe(emissions => {
      vehicle.co2Emissions = emissions;
      console.log('Vehicle emissions updated successfully', emissions);
      this.loadUserVehicles(); // Reload vehicles to reflect changes
    }, error => {
      console.error('Error calculating vehicle emissions:', error);
    });
  }
}
