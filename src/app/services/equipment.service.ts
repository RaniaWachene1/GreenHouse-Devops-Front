import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private baseUrl = '/api/equipment';

  constructor(private http: HttpClient) { }

  getEquipmentByUserId(userId: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.baseUrl}/user/${userId}`);
  }

  addEquipment(equipment: Equipment, userId: number): Observable<Equipment> {
    return this.http.post<Equipment>(`${this.baseUrl}/add/${userId}`, equipment);
  }

  updateEquipment(equipment: Equipment, idEquipment: number): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.baseUrl}/${idEquipment}`, equipment);
  }

  deleteEquipment(idEquipment: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idEquipment}`);
  }
}
