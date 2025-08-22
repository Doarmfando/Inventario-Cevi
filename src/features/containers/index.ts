// src/features/containers/index.ts

// Componentes
export { default as ContainersView } from './components/ContainersView';
export { default as ContainerProductsView } from './components/ContainerProductsView';
export { default as ContainerCard } from './components/ContainerCard.tsx';
export { default as ContainerForm } from './components/ContainerForm.tsx';

// Tipos
export type {
  Container,
  ContainerProduct,
  ContainerStats,
  ContainerSummary,
  ContainerFormData,
  ProductFormData,
  ProductState,
} from './types/container.types';

// Datos y utilidades
export {
  mockContainers,
  mockContainerProducts,
  getContainersSummary,
  getContainerProducts,
  calculateContainerStats,
  calculateProductState,
} from './data/mockContainerData';