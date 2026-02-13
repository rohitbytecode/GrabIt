import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { CategoryService } from '@core/services/category.service';
import { CartService } from '@core/services/cart.service';
import { Product, Category } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    featuredProducts: Product[] = [];
    dailyEssentials: Product[] = [];
    offerProducts: Product[] = [];
    categories: Category[] = [];
    loading = true;
    loadingProducts = true;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private cartService: CartService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadFeaturedProducts();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories.slice(0, 8);
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    loadFeaturedProducts(): void {
        this.productService.getFeaturedProducts().subscribe({
            next: (products) => {
                this.featuredProducts = products;
                this.dailyEssentials = products.slice(0, 4);
                this.offerProducts = products.slice(4, 8);
                this.loadingProducts = false;
            },
            error: () => this.loadingProducts = false
        });
    }

    onAddToCart(product: Product): void {
        this.cartService.addToCart(product).subscribe({
            next: () => this.snackBar.open('Added to cart', 'Close', { duration: 2000 }),
            error: () => this.snackBar.open('Unable to add product', 'Close', { duration: 3000 })
        });
    }

    navigateToCategory(categoryId: string): void {
        this.router.navigate(['/products'], { queryParams: { categoryId } });
    }
}
