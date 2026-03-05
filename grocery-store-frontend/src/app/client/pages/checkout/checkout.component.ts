import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { OrderService } from '@core/services/order.service';
import { CartItem } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    cartItems: CartItem[] = [];
    loading = true;
    houseNumber = '';
    street = '';
    city = '';
    state = '';
    pinCode = '';

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart(): void {
        this.cartService.getCartItems().subscribe({
            next: (items) => {
                this.cartItems = items;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading cart:', err);
                this.loading = false;
            }
        });
    }

    get cartTotal(): number {
        return this.cartService.getCartTotal();
    }

    get deliveryAddress(): string {
        const parts = [this.houseNumber, this.street, this.city, this.state, this.pinCode].filter(part => part.trim());
        return parts.join(', ');
    }

    isFormValid(): boolean {
        return this.houseNumber.trim().length > 0 && this.city.trim().length > 0 && this.pinCode.trim().length > 0;
    }

    placeOrder(): void {
        if (this.cartItems.length === 0) {
            this.snackBar.open('Cart is empty', 'Close', { duration: 2000 });
            return;
        }
        const orderPayload = {
            items: this.cartItems.map(item => ({
                productId: item.product.id || (item.product as any)._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            total: this.cartTotal,
            deliveryAddress: this.deliveryAddress
        };

        this.orderService.placeOrder(orderPayload).subscribe({
            next: () => {
                this.snackBar.open('Order placed successfully', 'Close', { duration: 3000 });
                this.cartService.clearCart().subscribe();
                this.router.navigate(['/']);
            },
            error: () => {
                this.snackBar.open('Failed to place order', 'Close', { duration: 3000 });
            }
        });
    }
}
