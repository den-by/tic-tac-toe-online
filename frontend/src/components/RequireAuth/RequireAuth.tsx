import React from 'react';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }: { children: React.JSX.Element }) {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }
  return children;
}
export default RequireAuth;
