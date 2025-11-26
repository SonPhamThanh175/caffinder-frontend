import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleBasedRedirect from '../components/RoleBasedRedirect';
import AdminRoutes from './AdminRoutes';
import OwnerRoutes from './OwnerRoutes';
import UserRoutes from './UserRoutes';
import NotFound from '../pages/NotFound/NotFound';
import { LoginPage } from '../modules/Auth/pages/index';
// import UnauthorizedPage from '../pages/UnauthorizedPage';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <RoleBasedRedirect />
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <LoginPage />
      }
    ]
  },
  
  // Protected Admin routes
  {
    element: <PrivateRoute allowedRoles={['admin']} />,
    children: [
      {
        ...AdminRoutes,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            {AdminRoutes.element}
          </Suspense>
        )
      }
    ]
  },

  // Protected Owner routes
  {
    element: <PrivateRoute allowedRoles={['owner']} />,
    children: [
      {
        ...OwnerRoutes,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            {OwnerRoutes.element}
          </Suspense>
        )
      }
    ]
  },

  // Protected User routes
  {
    element: <PrivateRoute allowedRoles={['user']} />,
    children: [
      {
        ...UserRoutes,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            {UserRoutes.element}
          </Suspense>
        )
      }
    ]
  },

  // Error routes
  // {
  //   path: '/unauthorized',
  //   element: <UnauthorizedPage />
  // },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;