import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { CategoryService } from '@core/services/category.service';

interface DashboardStats {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalRevenue: number;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    stats: DashboardStats = {
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0
    };
    loading = true;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.loadDashboardStats();
    }

    loadDashboardStats(): void {
        // Load products count
        this.productService.getProducts({ page: 1, pageSize: 1 }).subscribe({
            next: (response) => {
                this.stats.totalProducts = response.total;
            }
        });

        // Load categories count
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.stats.totalCategories = categories.length;
                this.loading = false;
            }
        });

        // Mock data for orders and revenue
        this.stats.totalOrders = 156;
        this.stats.totalRevenue = 45890;
    }
}
