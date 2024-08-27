import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; 
import './index.scss';

const rootElement = document.documentElement;
const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (userPrefersDark) {
  rootElement.classList.add('dark');
}

function Root() {
  const [darkMode, setDarkMode] = useState(() => userPrefersDark);

  useEffect(() => {
    if (darkMode) {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <StrictMode>
      <App darkMode={darkMode} setDarkMode={setDarkMode} />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
