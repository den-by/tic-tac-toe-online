import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import ErrorPage from '../pages/Error/ErrorPage';
import MainPage from '../pages/Main/MainPage';
import NotFound from '@/pages/NotFound/NotFound';
import ComputerMatch from '../pages/ComputerMatch/ComputerMatch';
import PrivateRoom from '../pages/OnlineMatch/pages/PrivateRoom/PrivateRoom';
import OnlineGameProvider from '@/pages/OnlineMatch/context/OnlineGameContext';
import OnlineRoom from '../pages/OnlineMatch/pages/OnlineRoom/OnlineRoom';
import RequireAuth from '@/components/RequireAuth/RequireAuth';
import MatchHistoryPage from '@/pages/MatchHistory/MatchHistoryPage';
import { Routes } from '@/routes/routes';

const router = createBrowserRouter([
  {
    path: Routes.Main,
    element: <RootLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: Routes.OnlineMatchFriend,
            element: (
              <RequireAuth>
                <OnlineGameProvider>
                  <PrivateRoom />
                </OnlineGameProvider>
              </RequireAuth>
            ),
          },
          {
            path: Routes.OnlineMatchRandom,
            element: (
              <RequireAuth>
                <OnlineGameProvider>
                  <OnlineRoom />
                </OnlineGameProvider>
              </RequireAuth>
            ),
          },
          {
            path: Routes.ComputerMatch,
            element: <ComputerMatch />,
          },
          {
            path: Routes.MatchHistory,
            element: (
              <RequireAuth>
                <MatchHistoryPage />
              </RequireAuth>
            ),
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
