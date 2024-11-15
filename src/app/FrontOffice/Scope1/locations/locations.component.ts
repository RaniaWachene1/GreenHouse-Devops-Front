import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Scope1Service } from '../../../services/scope1.service';
import { AuthService } from '../../../services/auth.service';
import { Location } from '../../../models/location';
import { AddLocationDialogComponent } from '../add-location-dialog/add-location-dialog.component';
import { LocationDetailDialogComponent } from '../location-detail-dialog/location-detail-dialog.component';

// Import MapLibre
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: any;
  center: [number, number] = [10.1987, 36.8456]; // Default center for MapTiler (longitude, latitude)
  zoom = 12; // Default zoom level
  locations: Location[] = [];
  userId: number | undefined;

  constructor(
    private scope1Service: Scope1Service,
    public dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.idUser;
        this.loadUserLocations();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement, // Container ID
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=0rsHEHwrx8g6tDwIMDAc', // MapTiler style URL with API key
      center: this.center, // Starting position [lng, lat]
      zoom: this.zoom // Starting zoom level
    });

    this.addMarkersToMap(); // Add markers once the map is initialized
  }

  loadUserLocations(): void {
    if (this.userId) {
      this.scope1Service.getLocationsByUserId(this.userId).subscribe(locations => {
        this.locations = locations;
        this.addMarkersToMap();
      });
    }
  }

  addMarkersToMap(): void {
    this.locations.forEach(location => {
      const marker = new maplibregl.Marker()
        .setLngLat([location.longitude!, location.latitude!]) // Note: MapTiler uses [longitude, latitude]
        .addTo(this.map); // Add marker to map
    });
  }

  addLocation(): void {
    const dialogRef = this.dialog.open(AddLocationDialogComponent, {
      width: '800px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.userId !== undefined) {
        this.scope1Service.addLocation(result, this.userId).subscribe(
          (newLocation: Location) => {
            this.locations.push(newLocation);
            this.addMarkerToMap(newLocation);
          },
          error => {
            console.error('Error adding location:', error);
          }
        );
      }
    });
  }

  addMarkerToMap(location: Location): void {
    const marker = new maplibregl.Marker()
      .setLngLat([location.longitude!, location.latitude!])
      .addTo(this.map);
    this.map.setCenter([location.longitude!, location.latitude!]);
    this.map.setZoom(15); // Zoom in on the newly added location
  }

  zoomToLocation(location: Location): void {
    this.map.setCenter([location.longitude!, location.latitude!]);
    this.map.setZoom(15); // Zoom in when a location is selected
  }

  openLocationDetails(location: Location): void {
    const dialogRef = this.dialog.open(LocationDetailDialogComponent, {
      width: '800px',
      height: '600px',
      data: { location }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.deleted) {
        this.locations = this.locations.filter(loc => loc.idLocation !== location.idLocation);
      } else if (result) {
        const index = this.locations.findIndex(loc => loc.idLocation === result.idLocation);
        if (index !== -1) {
          this.locations[index] = result;
        }
      }
      this.addMarkersToMap(); // Refresh markers
    });
  }
}
