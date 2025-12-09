import { lazy } from 'react';
import UserLayout from '../layouts/UserLayout';

const Home = lazy(() => import('../pages/Home/Home'));
const ShopsList = lazy(() => import('../modules/User/Products/pages/ShopsList/ShopsList'));
const ShopsDetail = lazy(() => import('../modules/User/Products/pages/ShopsDetail/ShopsDetail'));
const OrderList = lazy(() => import('../modules/User/Orders/pages/OrderList/OrderList'));
const OrderDetail = lazy(() => import('../modules/User/Orders/pages/OrderDetail/OrderDetail'));
const Favorite = lazy(() => import('../modules/User/Favorites/Favorite'));
const Reviews = lazy(() => import('../modules/User/Reviews/Review'));


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
        {
            path: 'favorites',
            element: <Favorite />,
        },
        {
            path: 'reviews',
            element: <Reviews />,
        },
    ],
};

export default UserRoutes;
