import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, ApiResponse } from '@shared/models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = '/api/orders';

    constructor(private http: HttpClient) { }

    placeOrder(order: Partial<Order>): Observable<ApiResponse<Order>> {
        return this.http.post<ApiResponse<Order>>(this.apiUrl, order);
    }

    getMyOrders(): Observable<ApiResponse<Order[]>> {
        return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/me`);
    }
}
