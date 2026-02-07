import { Component } from '@angular/core';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: 'pending' | 'processing' | 'delivered';
    date: Date;
    items: number;
}

@Component({
    selector: 'app-order-management',
    templateUrl: './order-management.component.html',
    styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent {
    // Mock orders data (UI only as specified)
    orders: Order[] = [
        { id: '1', orderNumber: 'ORD-001', customerName: 'John Doe', total: 1250, status: 'pending', date: new Date(), items: 5 },
        { id: '2', orderNumber: 'ORD-002', customerName: 'Jane Smith', total: 890, status: 'processing', date: new Date(), items: 3 },
        { id: '3', orderNumber: 'ORD-003', customerName: 'Bob Johnson', total: 2100, status: 'delivered', date: new Date(), items: 8 }
    ];

    displayedColumns: string[] = ['orderNumber', 'customer', 'items', 'total', 'status', 'date', 'actions'];

    updateOrderStatus(order: Order, newStatus: string): void {
        order.status = newStatus as 'pending' | 'processing' | 'delivered';
    }

    getStatusClass(status: string): string {
        return `status-${status}`;
    }
}
