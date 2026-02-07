import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Check if user is logged in and is admin
        if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
            return true;
        }

        // Not authorized, redirect to admin login
        this.router.navigate(['/auth/admin-login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }
}
