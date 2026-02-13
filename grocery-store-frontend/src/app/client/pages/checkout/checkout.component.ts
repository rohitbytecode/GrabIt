import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  address = 'Home - Mumbai';
  slot = 'Today, 6 PM - 8 PM';
  payment = 'cod';

  constructor(private snackBar: MatSnackBar) {}

  placeOrder(): void {
    this.snackBar.open('Order placed successfully!', 'Close', { duration: 2500 });
  }
}
