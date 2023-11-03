import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
const IndexPage = lazy(() => import('src/pages/dashboard/Dashboard'));
const Address = lazy(() => import('src/pages/dashboard/Address'));
const Withdraw = lazy(() => import('src/pages/dashboard/Withdraw'));
const Transaction = lazy(() => import('src/pages/dashboard/Transaction'));
const CashOut = lazy(() => import('src/pages/dashboard/CashOut'));

const PageFive = lazy(() => import('src/pages/dashboard/Dashboard'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'address', element: <Address /> },
      { path: 'transaction', element: <Transaction /> },
      { path: 'withdraw', element: <Withdraw /> },
      { path: 'cashout', element: <CashOut /> },
      {
        path: 'group',
        children: [
          // { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
