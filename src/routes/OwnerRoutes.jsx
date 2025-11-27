import { lazy } from 'react';
import OwnerLayout from '../layouts/OwnerLayout';

const DashboardHome = lazy(() => import('../modules/Admin/Dashboard/pages/DashboardHome'));
const ShopsList = lazy(() => import('../modules/User/Products/pages/ShopsList/ShopsList'));
const OrderList = lazy(() => import('../modules/User/Orders/pages/OrderList/OrderList'));

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
      element: <ShopsList />
    },
    {
      path: 'orders',
      element: <OrderList />
    }
  ]
};

export default OwnerRoutes;