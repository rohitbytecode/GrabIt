import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { CategoryManagementComponent } from './pages/category-management/category-management.component';
import { OrderManagementComponent } from './pages/order-management/order-management.component';

const routes: Routes = [
    { path: '', component: DashboardComponent, data: { title: 'Admin Dashboard' } },
    { path: 'products', component: ProductManagementComponent, data: { title: 'Product Management' } },
    { path: 'categories', component: CategoryManagementComponent, data: { title: 'Category Management' } },
    { path: 'orders', component: OrderManagementComponent, data: { title: 'Order Management' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
