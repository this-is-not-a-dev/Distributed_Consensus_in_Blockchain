import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './index.css';
import App from './App';
import PresenterView from './presenter/PresenterView';

// The presenter popup loads this same bundle at a distinct hash so it never
// renders the main slide UI — just the notes meant for one pair of eyes.
const isPresenter = window.location.hash.startsWith('#/presenter');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* framer-motion follows the OS reduced-motion setting: transforms off, opacity fades stay */}
    <MotionConfig reducedMotion="user">{isPresenter ? <PresenterView /> : <App />}</MotionConfig>
  </StrictMode>,
);
