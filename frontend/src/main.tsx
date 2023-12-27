import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './normalize.css';
import router from '@/routes/router';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={{ fontFamily: 'Roboto, sans-serif' }}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
