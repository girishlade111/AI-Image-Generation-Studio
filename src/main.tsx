import React from 'react';
import { createRoot } from 'react-dom/client';
import AetherCanvas from '../aethercanvas-app';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AetherCanvas />
  </React.StrictMode>
);
