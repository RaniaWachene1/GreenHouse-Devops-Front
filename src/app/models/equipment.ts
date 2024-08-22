import { User } from "./User";

export interface Equipment {
    printerType: any;
    computerType: any;
    projectorType: any;
    acType: any;
    idEquipment: number | null;
    equipmentType: string;
    equipmentName: string;
    equipmentRef: string;
    quantity: number;
    powerRating: number;
    annualUsageHours: number;
    emissionFactor: number;
    co2Emissions: number;
    scope: string;
    emissionSource: string;
    user: User | null;  // Ensure the user property is defined
  }
  