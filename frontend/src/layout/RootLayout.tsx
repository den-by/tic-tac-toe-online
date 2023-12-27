import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppWrapper from './appWrapper';
import NavBar from './NavBar/NavBar';

function RootLayout() {
  return (
    <>
      <AppWrapper>
        <NavBar />
        <Outlet />
      </AppWrapper>
      <Toaster />
      <ScrollRestoration />
    </>
  );
}
export default RootLayout;
