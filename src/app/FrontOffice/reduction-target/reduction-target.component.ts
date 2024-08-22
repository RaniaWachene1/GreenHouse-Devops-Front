import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { EmissionService } from '../../services/emission.service';
import { ReductionTargetPopupComponent } from '../reduction-target-popup/reduction-target-popup.component';
import { User } from '../../models/User';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reduction-target',
  templateUrl: './reduction-target.component.html',
  styleUrls: ['./reduction-target.component.css']
})
export class ReductionTargetComponent implements OnInit, AfterViewInit {
  currentEmissions = 0;
  baseYear = 0;
  endYear = 0;
  reductionAmbition = 0;
  targetReduction = 0;

  userId: number | undefined;

  @ViewChild('emissionsChart') emissionsChart: ElementRef<HTMLCanvasElement> | undefined;
  chart: Chart | undefined;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private emissionService: EmissionService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.idUser;
        this.loadUserData();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.userId !== undefined) {
      this.fetchTotalFootprint(this.userId);
    }
  }

  loadUserData() {
    if (this.userId !== undefined) {
      this.authService.getUserById(this.userId).subscribe(user => {
        this.baseYear = user.baseYear;
        this.endYear = user.endYear;
        this.reductionAmbition = user.reductionAmbition;
      }, error => {
        console.error('Error fetching user data:', error);
      });
    }
  }

  fetchTotalFootprint(userId: number): void {
    this.emissionService.getTotalFootprintForUser(userId).subscribe(
      (data) => {
        this.currentEmissions = data.totalFootprint;
        this.targetReduction = this.calculateTargetReduction();
        this.updateChart();
      },
      (error) => {
        console.error('Error fetching total footprint data', error);
      }
    );
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(ReductionTargetPopupComponent, {
      width: '800px',
      height: '300px',
      data: {
        endYear: this.endYear,
        reductionAmbition: this.reductionAmbition
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.endYear = result.endYear;
        this.reductionAmbition = result.reductionAmbition;
        this.targetReduction = this.calculateTargetReduction();

        // Save the updated data to the backend here
        if (this.userId !== undefined) {
          this.authService.getUserById(this.userId).subscribe(user => {
            user.endYear = this.endYear;
            user.reductionAmbition = this.reductionAmbition;

            this.authService.updateUser(this.userId!, user).subscribe(() => {
              this.updateChart(); // Update the chart after saving
            }, error => {
              console.error('Error updating user:', error);
            });
          }, error => {
            console.error('Error fetching user details:', error);
          });
        } else {
          console.error('User ID is undefined');
        }
      }
    });
  }

  calculateTargetReduction(): number {
    return (this.currentEmissions * this.reductionAmbition) / 100;
  }

  updateChart() {
    if (this.emissionsChart) {
      const ctx = this.emissionsChart.nativeElement.getContext('2d');
      if (ctx) {
        if (this.chart) {
          this.chart.destroy(); // Destroy existing chart before creating a new one
        }
        const years = [];
        const emissions = [];
        const projectedEmissions = [];
        const targetEmissions = this.currentEmissions;
        const reductionPerYear = this.targetReduction / (this.endYear - this.baseYear);

        for (let year = this.baseYear; year <= this.endYear; year++) {
          years.push(year.toString());
          emissions.push(targetEmissions - reductionPerYear * (year - this.baseYear));
          projectedEmissions.push(targetEmissions); // Add logic for projected emissions if available
        }

        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: years,
            datasets: [
              {
                label: 'Target Emissions',
                data: emissions,
                fill: false,
                borderColor: 'rgba(83, 169, 44, 1)', // Green color for the target line
                backgroundColor: 'rgba(83, 169, 44, 0.2)', // Light green for point background
                pointBorderColor: 'rgba(83, 169, 44, 1)', // Green for point border
                tension: 0.1
              },
              {
                label: 'Projected Emissions',
                data: projectedEmissions,
                fill: false,
                borderColor: 'rgba(0, 0, 0, 1)', // Black color for the projected line
                backgroundColor: 'rgba(0, 0, 0, 0.2)', // Light black for point background
                pointBorderColor: 'rgba(0, 0, 0, 1)', // Black for point border
                borderDash: [5, 5],
                tension: 0.1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Total Carbon Emissions (tCO2e)'
                }
              }
            }
          }
        });
      }
    }
  }
}
