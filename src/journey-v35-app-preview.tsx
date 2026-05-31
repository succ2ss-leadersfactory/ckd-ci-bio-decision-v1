import { createRoot } from 'react-dom/client';
import './index.css';
import { FullFlowJourneyV35App } from './full-flow-journey-v35-app';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

if (!rootElement) {
  throw new Error('v35 preview root element was not found. Add #journey-root or #root to the preview HTML.');
}

createRoot(rootElement).render(<FullFlowJourneyV35App />);
