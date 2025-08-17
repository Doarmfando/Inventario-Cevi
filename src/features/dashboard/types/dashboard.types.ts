// types/dashboard.types.ts

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  categoriesCount: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  expirationDate: string;
  category: string;
  unitPrice: number;
  totalValue: number;
}

export interface CategoryData {
  category: string;
  count: number;
  value: number;
}

export interface TrendData {
  date: string;
  totalValue: number;
  totalProducts: number;
  movements: number;
}

export interface MovementData {
  day: string;
  entradas: number;
  salidas: number;
  ajustes: number;
}

export type DashboardTab = 'overview' | 'trends' | 'categories' | 'alerts';

export interface TabConfig {
  id: DashboardTab;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  badge?: number;
}

// Props interfaces
export interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export interface LowStockAlertProps {
  lowStockProducts: Product[];
}

export interface CategorySummaryProps {
  categoryStats: CategoryData[];
}

export interface ExpiringProductsAlertProps {
  expiringProducts: Product[];
}