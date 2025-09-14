// src/features/dashboard/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats, Product, CategoryData } from '../services/dashboardService';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    categoriesCount: 0,
    expiringItems: 0,
    outOfStock: 0
  });
  
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, lowStock, expiring, categories] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getLowStockProducts(),
        dashboardService.getExpiringProducts(),
        dashboardService.getProductsByCategory()
      ]);

      setStats(statsData);
      setLowStockProducts(lowStock);
      setExpiringProducts(expiring);
      setCategoryStats(categories);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    stats,
    lowStockProducts,
    expiringProducts,
    categoryStats,
    loading,
    error,
    refreshData
  };
};