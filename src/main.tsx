import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Master design system — contains dark-theme overrides & package styles
import './index.css';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
