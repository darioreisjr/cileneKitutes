import { lazy } from 'react';

// Lazy load pages
export const Pages = {
  Index: lazy(() => import('@/pages/Index')),
  ProductDetails: lazy(() => import('@/pages/ProductDetails')),
  Cart: lazy(() => import('@/pages/Cart')),
  NotFound: lazy(() => import('@/pages/NotFound')),
} as const;

export const ROUTE_PATHS = {
  HOME: '/',
  PRODUCT_DETAILS: '/produto/:slug',
  CART: '/carrinho',
  NOT_FOUND: '*',
} as const;

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title?: string;
  description?: string;
}

export const routes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: Pages.Index,
    title: 'Início',
    description: 'Página inicial',
  },
  {
    path: ROUTE_PATHS.PRODUCT_DETAILS,
    element: Pages.ProductDetails,
    title: 'Detalhes do Produto',
  },
  {
    path: ROUTE_PATHS.CART,
    element: Pages.Cart,
    title: 'Carrinho',
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    element: Pages.NotFound,
    title: 'Página não encontrada',
  },
];
