import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Scope1Service } from '../../../services/scope1.service';
import { Location as CustomLocation } from '../../../models/location';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { countries } from './country-data-store';

@Component({
  selector: 'app-add-location-dialog',
  templateUrl: './add-location-dialog.component.html',
  styleUrls: ['./add-location-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddLocationDialogComponent implements OnInit {
  locationForm: FormGroup;
  userId: number | undefined;

  countries = countries;
  states: string[] = [];
  primaryUses = [
    'Banking and Financial Service',
    'Education',
    'Entertainment',
    'Food Service',
    'Food Sales',
    'Health Care',
    'Manufacturing and Industrial',
    'Office',
    'Public Services',
    'Services',
    'Technology and Science'
  ];
  sqOptions = ['sqm - Square Meter', 'sqft - Square Foot'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddLocationDialogComponent>,
    private scope1Service: Scope1Service,
    private authService: AuthService,
    private http: HttpClient // For HTTP requests
  ) {
    this.locationForm = this.fb.group({
      nameLocation: ['', Validators.required],
      addressLocation: ['', Validators.required],
      aptSuite: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      country: ['', Validators.required],
      primaryUse: ['', Validators.required],
      grossArea: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      usesNaturalGas: [false],
      sq: ['sqm - Square Meter', Validators.required],
      latitude: [0],
      longitude: [0]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.userId = user.idUser;
      }
    });

    this.locationForm.get('country')?.valueChanges.subscribe(country => {
      this.updateStates(country);
    });
  }

  updateStates(countryName: string): void {
    const selectedCountry = this.countries.find(country => country.name === countryName);
    this.states = selectedCountry ? selectedCountry.states : [];
    this.locationForm.get('state')?.setValue('');
  }

  onAddLocation(): void {
    if (this.locationForm.valid && this.userId !== undefined) {
      const location = this.locationForm.value as CustomLocation;
      const fullAddress = `${location.addressLocation}, ${location.city}, ${location.state}, ${location.country}`;
      
      this.geocodeAddress(fullAddress, (lat, lng) => {
        if (lat !== 0 && lng !== 0) {
          this.locationForm.patchValue({ latitude: lat, longitude: lng });
          location.latitude = lat;
          location.longitude = lng;

          console.log(`Geocoded Latitude: ${lat}, Longitude: ${lng}`);
          this.scope1Service.addLocation(location, this.userId!).subscribe(
            newLocation => {
              this.dialogRef.close(newLocation);
            },
            (error: HttpErrorResponse) => {
              console.error('Error adding location:', error);
            }
          );
        } else {
          console.error('Geocoding failed, please check the address.');
        }
      });
    }
  }

  geocodeAddress(address: string, callback: (lat: number, lng: number) => void): void {
    const mapTilerGeocodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=0rsHEHwrx8g6tDwIMDAc`;

    this.http.get(mapTilerGeocodingUrl).subscribe(
      (response: any) => {
        if (response && response.features && response.features.length > 0) {
          const [lng, lat] = response.features[0].geometry.coordinates;
          console.log(`Geocoded address to Latitude: ${lat}, Longitude: ${lng}`);
          callback(lat, lng); // Return the latitude and longitude
        } else {
          console.error('No results found for the given address.');
          callback(0, 0); // Return 0, 0 if no result found
        }
      },
      error => {
        console.error('Geocoding API error:', error);
        callback(0, 0);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
