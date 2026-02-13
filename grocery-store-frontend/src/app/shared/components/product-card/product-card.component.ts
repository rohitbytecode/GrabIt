import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@shared/models/interfaces';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
    @Input() product!: Product;
    @Output() addToCart = new EventEmitter<Product>();
    quantity = 1;

    onAddToCart(): void {
        for (let i = 0; i < this.quantity; i++) {
            this.addToCart.emit(this.product);
        }
    }

    increase(): void {
        if (this.quantity < 10) this.quantity++;
    }

    decrease(): void {
        if (this.quantity > 1) this.quantity--;
    }

    get discountPercent(): number {
        return this.product.featured ? 15 : 0;
    }

    onImageError(event: Event): void {
        (event.target as HTMLImageElement).src = 'assets/images/placeholder-product.svg';
    }
}
