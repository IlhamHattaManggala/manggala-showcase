import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Package stylesheets — must load BEFORE index.css so our design system overrides them
import '@manggala31/react-spotlight/styles.css';
import '@manggala31/react-dashboard-grid/styles.css';
import '@manggala31/react-datatable/styles.css';
import '@manggala31/react-status-page/styles.css';
import '@manggala31/schema-form-react/styles.css';

// Our design system — loads last, wins the cascade
import './index.css';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
