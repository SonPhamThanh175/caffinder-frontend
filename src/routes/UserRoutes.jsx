import { lazy } from 'react';
import UserLayout from '../layouts/UserLayout';

const Home = lazy(() => import('../pages/Home/Home'))
const ProductList = lazy(() => import('../modules/Products/pages/ProductList/ProductList'));
const OrderList = lazy(() => import('../modules/Orders/pages/OrderList'));

const UserRoutes = {
  path: '/user',
  element: <UserLayout />,
  children: [
    {
      path: '',
      element: <Home />
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