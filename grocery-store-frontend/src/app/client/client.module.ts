import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CartComponent } from './pages/cart/cart.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

@NgModule({
    declarations: [
        HomeComponent,
        ProductsComponent,
        ProductDetailComponent,
        CategoriesComponent,
        CartComponent,
        AboutComponent,
        ContactComponent
    ],
    imports: [
        SharedModule,
        ClientRoutingModule
    ]
})
export class ClientModule { }
