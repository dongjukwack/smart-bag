import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { unstableSetRender } from 'antd-mobile'
import App from './App.tsx';
import { AppProvider } from './store/AppContext';
import { ScenarioTester } from './store/ScenarioTester';
import 'leaflet/dist/leaflet.css';
import './index.css';

const antdRoots = new WeakMap<Element | DocumentFragment, Root>();

unstableSetRender((node, container) => {
  const root = antdRoots.get(container) ?? createRoot(container);
  antdRoots.set(container, root);
  root.render(node);

  return async () => {
    await Promise.resolve();
    root.unmount();
    antdRoots.delete(container);
  };
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
      <ScenarioTester />
    </AppProvider>
  </React.StrictMode>,
)
