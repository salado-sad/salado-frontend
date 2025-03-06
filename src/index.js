import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Renders the root component of the React application.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Logs web vitals for performance measurement.
 * @param {function} onPerfEntry - Function to handle performance entries.
 */
reportWebVitals(console.log);