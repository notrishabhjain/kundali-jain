import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { KundaliProvider } from './context/KundaliContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KundaliProvider>
      <App />
    </KundaliProvider>
  </StrictMode>,
);
