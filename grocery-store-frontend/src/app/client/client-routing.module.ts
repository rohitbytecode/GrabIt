import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CartComponent } from './pages/cart/cart.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
    { path: '', component: HomeComponent, data: { title: 'Home' } },
    { path: 'products', component: ProductsComponent, data: { title: 'Products' } },
    { path: 'product/:id', component: ProductDetailComponent, data: { title: 'Product Details' } },
    { path: 'categories', component: CategoriesComponent, data: { title: 'Categories' } },
    { path: 'cart', component: CartComponent, data: { title: 'Shopping Cart' } },
    { path: 'about', component: AboutComponent, data: { title: 'About Us' } },
    { path: 'contact', component: ContactComponent, data: { title: 'Contact Us' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
