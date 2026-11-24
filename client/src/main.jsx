import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Set initial language on html element
try {
  const lang = localStorage.getItem('neev_lang') || 'en';
  document.documentElement.lang = lang;
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
