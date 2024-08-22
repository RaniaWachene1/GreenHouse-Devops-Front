import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Check if the route is restricted by role
      if (route.data['roles'] && !route.data['roles'].includes(currentUser.roles)) {
        // Role not authorized so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // Authorized so return true
      return true;
    }

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
