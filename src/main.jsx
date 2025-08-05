import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './utils/axiosConfig.jsx'; // Global axios setup (adds token etc.)

// ✅ Mount app with React 18 API
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
