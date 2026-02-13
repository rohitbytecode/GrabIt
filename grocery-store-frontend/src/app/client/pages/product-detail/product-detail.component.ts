import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { Product } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    product: Product | null = null;
    relatedProducts: Product[] = [];
    loading = true;
    quantity = 1;
    selectedImage = '';

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadProduct(id);
            this.loadRelated();
        }
    }

    loadProduct(id: string): void {
        this.productService.getProductById(id).subscribe({
            next: (product) => {
                this.product = product;
                this.selectedImage = product.image;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    loadRelated(): void {
        this.productService.getFeaturedProducts().subscribe({
            next: (products) => this.relatedProducts = products.slice(0, 4)
        });
    }

    onAddToCart(): void {
        if (this.product) {
            this.cartService.addToCart(this.product, this.quantity).subscribe({
                next: () => this.snackBar.open(`Added ${this.quantity} item(s)`, 'Close', { duration: 2000 }),
                error: () => this.snackBar.open('Failed to add', 'Close', { duration: 3000 })
            });
        }
    }


    onAddRelatedToCart(product: Product): void {
        this.cartService.addToCart(product).subscribe({
            next: () => this.snackBar.open('Added to cart', 'Close', { duration: 2000 }),
            error: () => this.snackBar.open('Failed to add', 'Close', { duration: 3000 })
        });
    }

    onImageError(event: Event): void {
        (event.target as HTMLImageElement).src = 'assets/images/placeholder-product.svg';
    }

    increaseQuantity(): void {
        if (this.product && this.quantity < this.product.stock) this.quantity++;
    }

    decreaseQuantity(): void {
        if (this.quantity > 1) this.quantity--;
    }
}
