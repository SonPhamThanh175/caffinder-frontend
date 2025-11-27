import { lazy } from 'react';
import AdminLayout from '../layouts/AdminLayout';

// Lazy load components
const DashboardHome = lazy(() => import('../modules/Dashboard/pages/DashboardHome'));
const UserList = lazy(() => import('../modules/Users/pages/UserList'));
const UserDetail = lazy(() => import('../modules/Users/pages/UserDetail'));
const ShopsList = lazy(() => import('../modules/Products/pages/ShopsList/ShopsList'));
const OrderList = lazy(() => import('../modules/Orders/pages/OrderList'));

const AdminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardHome />
    },
    {
      path: 'users',
      children: [
        {
          index: true,
          element: <UserList />
        },
        {
          path: ':id',
          element: <UserDetail />
        }
      ]
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

export default AdminRoutes;