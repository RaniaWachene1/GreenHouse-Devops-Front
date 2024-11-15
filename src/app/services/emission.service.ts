import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmissionService {

  private baseUrl = '/api/emissions';

  constructor(private http: HttpClient) { }

  calculateScope1Emissions(locationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/calculate/scope1/${locationId}`, {});
  }
  calculateCO2FromVehicle(id: number, fuelConsumption: number, fuelType: string): Observable<any> {
    const params = new HttpParams()
      .set('fuelConsumption', fuelConsumption.toString())
      .set('fuelType', fuelType);
    return this.http.post(`${this.baseUrl}/vehicle/${id}/calculate`, {}, { params });
  }
  calculateEmissionsCO2FromNaturalGas(id: number, naturalGasConsumption: number): Observable<any> {
    const params = new HttpParams().set('naturalGasConsumption', naturalGasConsumption.toString());
    return this.http.post(`${this.baseUrl}/${id}/calculate`, {}, { params });
  }
  calculateEmissionsCO2FromElectricity(id: number, electricityConsumption: number): Observable<any> {
    const params = new HttpParams().set('electricityConsumption', electricityConsumption.toString());
    return this.http.post(`${this.baseUrl}/${id}/calculate-electricity`, {}, { params });
  }

  calculateCO2FromEquipment(id: number, equipment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/equipment/${id}/calculate`, equipment);
  }

  getTotalFootprintForUser(userId: number): Observable<{ scope1Total: number, scope2Total: number, scope3Total: number, totalFootprint: number }> {
    return this.http.get<{ scope1Total: number, scope2Total: number, scope3Total: number, totalFootprint: number }>(`${this.baseUrl}/total-footprint/${userId}`);
  }
  saveEmission(locationId: number, co2Emissions: number, emissionSource: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, { locationId, co2Emissions, emissionSource });
  }
}
