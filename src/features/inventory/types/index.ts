// CATEGORÍAS ACTUALIZADAS SEGÚN ESTRUCTURA DE CONTENEDORES - CORREGIDAS
export type ProductCategory = 
  | 'Pescados'
  | 'Mariscos' 
  | 'Causa' // CORREGIDA - Solo "Causa" (singular) para el plato peruano preparado
  | 'Tubérculos'
  | 'Cítricos'
  | 'Condimentos'
  | 'Verduras'
  | 'Bebidas'
  | 'Bebidas Alcohólicas'
  | 'Aceites'
  | 'Granos'
  | 'Harinas'
  // | 'Lácteos' // COMENTADO - No usado en mockData
  // | 'Proteínas' // COMENTADO - No usado en mockData
  // | 'Pastas' // COMENTADO - No usado en mockData
  | 'Suministros'
  | 'Limpieza';

// Unidades actualizadas según mockData.ts
export type ProductUnit = 
  | 'kg' 
  | 'porciones' // AGREGADA - Para la categoría Causa
  | 'litros' // CORREGIDA - Se mantiene 'litros' (plural)
  | 'unidades' // CORREGIDA - Se mantiene 'unidades' (plural)
  | 'botellas'
  | 'rollos'
  | 'paquetes';
  // | 'bolsa' // COMENTADO - No usado en mockData
  // | 'litro' // COMENTADO - Se usa 'litros'
  // | 'unidad' // COMENTADO - Se usa 'unidades'
  // | 'cubeta' // COMENTADO - No usado en mockData
  // | 'atado' // COMENTADO - No usado en mockData
  // | 'caja'; // COMENTADO - No usado en mockData

// CONTENEDORES ACTUALIZADOS - 7 CONTENEDORES SEGÚN ESTRUCTURA DE CONTENEDORES
export type Container = 
  | 'Congelador 1 - Pescado'
  | 'Congelador 2 - Mariscos'
  | 'Congelador 3 - Causa' // CORREGIDO - Era "Causas" ahora "Causa"
  | 'Congelador 4 - Verduras'
  | 'Refrigerador 5 - Gaseosas'
  | 'Refrigerador 6 - Cervezas'
  | 'Almacén Seco';

// RECOMENDACIONES DE CONTENEDORES POR CATEGORÍA - ACTUALIZADO SEGÚN ESTRUCTURA
export const CONTAINER_RECOMMENDATIONS: Record<ProductCategory, Container[]> = {
  'Pescados': ['Congelador 1 - Pescado'],
  'Mariscos': ['Congelador 2 - Mariscos'],
  'Causa': ['Congelador 3 - Causa'], // AGREGADA - Solo la Causa preparada va aquí
  'Tubérculos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras'], // Papas para causa → 3, otros → 4
  'Cítricos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras'], // Limones para causa → 3
  'Condimentos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras', 'Almacén Seco'], // Frescos → 3/4, secos → Almacén
  'Verduras': ['Congelador 4 - Verduras'],
  'Bebidas': ['Refrigerador 5 - Gaseosas'],
  'Bebidas Alcohólicas': ['Refrigerador 6 - Cervezas', 'Almacén Seco'], // Cervezas → 6, vinos → Almacén
  'Aceites': ['Almacén Seco'],
  'Granos': ['Almacén Seco'],
  'Harinas': ['Almacén Seco'],
  // 'Lácteos': ['Refrigerador 5 - Gaseosas', 'Refrigerador 6 - Cervezas'], // COMENTADO
  // 'Proteínas': ['Refrigerador 5 - Gaseosas', 'Refrigerador 6 - Cervezas'], // COMENTADO
  // 'Pastas': ['Almacén Seco'], // COMENTADO
  'Suministros': ['Almacén Seco'],
  'Limpieza': ['Almacén Seco']
};