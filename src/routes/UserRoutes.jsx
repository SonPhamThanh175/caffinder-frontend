import { lazy } from 'react';
import UserLayout from '../layouts/UserLayout';

const Dashboard = lazy(() => import('../modules/Dashboard/pages/DashboardHome'));
const ProductList = lazy(() => import('../modules/Products/pages/ProductList'));
const OrderList = lazy(() => import('../modules/Orders/pages/OrderList'));

const UserRoutes = {
  path: '/user',
  element: <UserLayout />,
  children: [
    {
      path: 'dashboard',
      element: <Dashboard />
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

export default UserRoutes;