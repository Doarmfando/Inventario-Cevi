// src/components/Sidebar/utils/sidebarUtils.tsx
import React from "react";
import { CONTAINER_ICONS, CONTAINER_STATUS_COLORS, CONTAINER_TYPE_LABELS } from "../constants/sidebarConstants";
import type { ContainerSummary } from "../../../features/containers/types/container.types";
import type { ContainersByType } from "../types/sidebar.types";

// Agregar export:
export type { ContainerSummary } from "../../../features/containers/types/container.types";

export const getContainerIcon = (type: string): React.ReactNode => {
  const iconConfig = CONTAINER_ICONS[type as keyof typeof CONTAINER_ICONS] || CONTAINER_ICONS.default;
  const IconComponent = iconConfig.icon;
  return <IconComponent className={`w-4 h-4 ${iconConfig.color}`} />;
};

export const getStatusColor = (status: string): string => {
  return CONTAINER_STATUS_COLORS[status as keyof typeof CONTAINER_STATUS_COLORS] || CONTAINER_STATUS_COLORS.default;
};

export const getTypeLabel = (type: string): string => {
  return CONTAINER_TYPE_LABELS[type as keyof typeof CONTAINER_TYPE_LABELS] || type;
};

export const groupContainersByType = (containers: ContainerSummary[]): ContainersByType => {
  return containers.reduce((acc, container) => {
    if (!acc[container.type]) {
      acc[container.type] = [];
    }
    acc[container.type].push(container);
    return acc;
  }, {} as ContainersByType);
};