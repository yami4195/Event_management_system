import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import App from './App.jsx'

// Import the favicon from the source assets so the bundler includes it.
import faviconUrl from './assets/favicon.png';

// Set favicon at runtime to use the bundled asset (works with Vite/CRA).
function setFavicon(href) {
  const selector = 'link[rel~="icon"]';
  let link = document.querySelector(selector);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'icon');
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.setAttribute('href', href);
}

setFavicon(faviconUrl);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
