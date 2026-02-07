import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

const routes: Routes = [
    { path: 'login', component: AdminLoginComponent, data: { title: 'Admin Login' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
