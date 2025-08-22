// src/features/containers/types/product.types.ts

export interface ProductFormValidation {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export interface ProductPackaging {
  totalQuantity: number;
  packagedUnits: number;
  quantityPerPackage: number;
  unit: string;
}

export interface ProductPricing {
  basePrice: number;
  currentPrice: number;
  totalValue: number;
  pricePerUnit: number;
}

export interface ProductExpiry {
  expiryDate?: Date;
  daysRemaining?: number;
  isExpiringSoon: boolean;
  isExpired: boolean;
  warningLevel: 'none' | 'info' | 'warning' | 'danger';
}

export interface ProductMovement {
  id: string;
  productId: string;
  containerId: string;
  type: 'entrada' | 'salida' | 'transferencia' | 'ajuste';
  quantity: number;
  reason?: string;
  userId?: string;
  userName?: string;
  createdAt: Date;
  notes?: string;
}

export interface ProductAlert {
  id: string;
  productId: string;
  type: 'expiry' | 'low_stock' | 'quality' | 'temperature';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  isRead: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  manufacturingDate?: Date;
  expiryDate?: Date;
  supplier?: string;
  qualityGrade?: 'A' | 'B' | 'C';
  notes?: string;
  createdAt: Date;
}

export interface ProductQuality {
  grade: 'excelente' | 'bueno' | 'regular' | 'malo';
  appearance: number; // 1-10
  freshness: number; // 1-10
  aroma: number; // 1-10
  texture: number; // 1-10
  overall: number; // calculated average
  inspectedBy?: string;
  inspectedAt?: Date;
  notes?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isPerishable: boolean;
  defaultShelfLife?: number; // days
  storageRequirements?: {
    temperature?: {
      min: number;
      max: number;
      unit: 'celsius' | 'fahrenheit';
    };
    humidity?: {
      min: number;
      max: number;
    };
    specialRequirements?: string[];
  };
  createdAt: Date;
}

export interface ProductSupplier {
  id: string;
  name: string;
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  qualityRating: number; // 1-5
  isActive: boolean;
  products: string[]; // product IDs
  createdAt: Date;
}

export interface ProductSearchFilters {
  searchTerm?: string;
  category?: string;
  state?: string;
  containerId?: string;
  supplier?: string;
  expiryDateRange?: {
    from?: Date;
    to?: Date;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  qualityGrade?: string;
  sortBy?: 'name' | 'category' | 'expiryDate' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSummary {
  totalProducts: number;
  totalValue: number;
  totalWeight: number;
  byState: {
    fresco: number;
    congelado: number;
    porVencer: number;
    vencido: number;
  };
  byCategory: Record<string, number>;
  alerts: number;
  lowStock: number;
}

export interface ProductTransfer {
  id: string;
  productId: string;
  fromContainerId: string;
  toContainerId: string;
  quantity: number;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface ProductInventoryEntry {
  id: string;
  productId: string;
  containerId: string;
  quantity: number;
  price: number;
  supplier?: string;
  batchNumber?: string;
  expiryDate?: Date;
  entryType: 'purchase' | 'transfer' | 'adjustment' | 'return';
  invoiceNumber?: string;
  createdBy: string;
  createdAt: Date;
  notes?: string;
}

// Interfaces para formularios
export interface ProductFormStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  data?: Record<string, any>;
}

export interface ProductFormState {
  currentStep: number;
  steps: ProductFormStep[];
  isSubmitting: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

// Tipos de utilidad
export type ProductAction = 'view' | 'edit' | 'delete' | 'transfer' | 'adjust';
export type ProductStateAction = 'mark_fresh' | 'mark_frozen' | 'mark_expiring' | 'mark_expired';
export type ProductExportFormat = 'csv' | 'excel' | 'pdf';

// Configuración de vista
export interface ProductViewConfig {
  showImages: boolean;
  showBatchInfo: boolean;
  showQualityGrades: boolean;
  showAlerts: boolean;
  columnsVisible: string[];
  itemsPerPage: number;
  groupBy?: 'category' | 'container' | 'state' | 'supplier';
}