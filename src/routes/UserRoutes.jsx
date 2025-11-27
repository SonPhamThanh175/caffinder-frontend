import { lazy } from 'react';
import UserLayout from '../layouts/UserLayout';

const Home = lazy(() => import('../pages/Home/Home'));
const ShopsList = lazy(() => import('../modules/Products/pages/ShopsList/ShopsList'));
const ShopsDetail = lazy(() => import('../modules/Products/pages/ShopsDetail/ShopsDetail'));
const OrderList = lazy(() => import('../modules/Orders/pages/OrderList/OrderList'));
const OrderDetail = lazy(() => import('../modules/Orders/pages/OrderDetail/OrderDetail'));

const UserRoutes = {
    path: '/user',
    element: <UserLayout />,
    children: [
        {
            path: '',
            element: <Home />,
        },
        {
            path: 'shops',
            element: <ShopsList />,
        },
        {
            path: 'shops/:id',
            element: <ShopsDetail />,
        },
        {
            path: 'orders',
            element: <OrderList />,
        },
                {
            path: 'orders/:id',
            element: <OrderDetail />,
        },
    ],
};

export default UserRoutes;