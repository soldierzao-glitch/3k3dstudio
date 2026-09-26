export type PageView = 'inicio' | 'como-funciona' | 'categorias' | 'galeria' | 'galeria-de-encomendas-reais' | 'fazer-pedido-sob-medida' | 'orcamento-personalizado';

export type ProjectCategory = 
  | 'all' 
  | 'sacro' 
  | 'geek-setup' 
  | 'decor-utilidades' 
  | 'articulados' 
  | 'mascotes' 
  | 'colecionaveis-fofos'
  | 'geek'
  | 'presentes'
  | 'decoracao'
  | 'tecnicas';

export interface ProjectItem {
  id: string;
  refId: string;
  category: ProjectCategory;
  categoryLabel: string;
  badgeTag: string;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  metaTag: string;
  clientName: string;
  clientInitials: string;
  clientLocation: string;
  clientReview: string;
  rating: number;
  highlightSpec: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  originalFileName?: string;
  fallbackUrl?: string;
  tags?: string[];
}

export interface QuoteConfig {
  technology: 'fdm' | 'sla';
  material: string;
  infill: number;
  layerHeight: string;
  finishLevel: string;
  dimensionX: number;
  dimensionY: number;
  dimensionZ: number;
  quantity: number;
  description: string;
}
