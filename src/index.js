import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { TitleProvider } from './contexts/TitleContext';

// Debug log to confirm script execution
console.log('React script is running');

// Use a try-catch to identify potential errors during mounting
try {
  const rootElement = document.getElementById('root');
  
  // Debug log to check if root element exists
  console.log('Root element found:', rootElement);
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <TitleProvider>
            <App />
          </TitleProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log('React app mounted successfully');
  } else {
    console.error('Root element not found in the DOM');
    document.body.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Error: Root element not found</h1><p>Please check your HTML structure</p></div>';
  }
} catch (error) {
  console.error('Error rendering React application:', error);
  document.body.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Something went wrong</h1><p>Error: ' + error.message + '</p></div>';
}