// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Suppress AbortError
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('AbortError') || args[0]?.includes?.('user aborted')) {
      return;
    }
    originalError(...args);
  };
}