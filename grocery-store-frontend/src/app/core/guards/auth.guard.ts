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

        // Check if the route being accessed is an admin route
        const isAdminRoute = state.url.startsWith('/admin');

        // Not authorized, redirect to corresponding login
        this.router.navigate([isAdminRoute ? '/admin' : '/auth/login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }
}
