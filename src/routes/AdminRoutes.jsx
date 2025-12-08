import { lazy } from 'react';
import AdminLayout from '../layouts/AdminLayout';

// Lazy load components
const DashboardHome = lazy(() => import('../modules/Admin/Dashboard/pages/DashboardHome'));
const UserList = lazy(() => import('../modules/Admin/Users/pages/UserList/UserList'));
const UserDetail = lazy(() => import('../modules/Admin/Users/pages/UserDetail/UserDetail'));
const ShopsManagement = lazy(() => import('../modules/Admin/Shops/ShopsManagement'));
const ShopDetail = lazy(() => import('../modules/Admin/Shops/ShopDetail/ShopDetail'));
const OrderList = lazy(() => import('../modules/User/Orders/pages/OrderList/OrderList'));

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
      path: 'shops',
      children: [
        {
          index: true,
          element: <ShopsManagement />
        },
        {
          path: ':shopId',
          element: <ShopDetail />
        }
      ]
    },
    {
      path: 'orders',
      element: <OrderList />
    }
  ]
};

export default AdminRoutes;