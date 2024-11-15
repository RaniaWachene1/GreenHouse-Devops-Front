import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './FrontOffice/home/home.component';
import { RegisterComponent } from './FrontOffice/register/register.component';
import { LoginComponent } from './FrontOffice/login/login.component';
import { AdminDashComponent } from './FrontOffice/admin-dash/admin-dash.component';
import { NotFoundComponent } from './FrontOffice/not-found/not-found.component';
import { DashboardComponent } from './FrontOffice/dashboard/dashboard.component';
import { VerifyEmailComponent } from './FrontOffice/verify-email/verify-email.component';
import { LocationsComponent } from './FrontOffice/Scope1/locations/locations.component';
import { NaturalGasComponent } from './FrontOffice/Scope1/natural-gas/natural-gas.component';
import { FootprintAnalyticsComponent } from './FrontOffice/Analytics/footprint-analytics/footprint-analytics.component';
import { ElectricityUsageComponent } from './FrontOffice/Scope2/electricity-usage/electricity-usage.component';
import { VehiclesComponent } from './FrontOffice/Scope1/vehicles/vehicles.component';
import { VehicleUsageComponent } from './FrontOffice/Scope1/vehicle-usage/vehicle-usage.component';
import { EquipmentComponent } from './FrontOffice/Scope3/equipment/equipment.component';
import { EquipmentUsageComponent } from './FrontOffice/Scope3/equipment-usage/equipment-usage.component';
import { ReductionTargetComponent } from './FrontOffice/reduction-target/reduction-target.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminDashComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'locations', component: LocationsComponent, canActivate: [AuthGuard] },
  { path: 'scope-one/natural-gas-consumption', component: NaturalGasComponent, canActivate: [AuthGuard] },
  { path: 'footprint-analytics', component: FootprintAnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'scope-two/electricity-usage', component: ElectricityUsageComponent, canActivate: [AuthGuard] },
  { path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuard] },
  { path: 'scope-one/vehicle-usage', component: VehicleUsageComponent, canActivate: [AuthGuard] },
  { path: 'Equipments', component: EquipmentComponent, canActivate: [AuthGuard] },
  { path: 'scope-three/equipment-usage', component: EquipmentUsageComponent, canActivate: [AuthGuard] },
  { path: 'reduction-target', component: ReductionTargetComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
