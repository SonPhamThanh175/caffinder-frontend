import { lazy } from 'react';
import OwnerLayout from '../layouts/OwnerLayout';

const DashboardHome = lazy(() => import('../modules/Dashboard/pages/DashboardHome'));
const ProductList = lazy(() => import('../modules/Products/pages/ProductList/ProductList'));
const OrderList = lazy(() => import('../modules/Orders/pages/OrderList'));

const OwnerRoutes = {
  path: '/owner',
  element: <OwnerLayout />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardHome />
    },
    {
      path: 'products',
      element: <ProductList />
    },
    {
      path: 'orders',
      element: <OrderList />
    }
  ]
};

export default OwnerRoutes;