import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Import your main App component
import KYCIntegration from '../components/KYCIntegration';

// Render your React app using createRoot
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the KYCIntegration component globally in your Vite project
import { createApp } from 'react';

const app = createApp();

// Register the KYCIntegration component globally
app.component('KYCIntegration', KYCIntegration);

app.mount('#app');
