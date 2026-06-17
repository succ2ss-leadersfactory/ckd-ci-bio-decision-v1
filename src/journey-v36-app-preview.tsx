import { createRoot } from 'react-dom/client';
import './index.css';
import { FullFlowJourneyV36PreviewApp } from './full-flow-journey-v36-preview';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

if (!rootElement) {
  throw new Error('v36 preview root element was not found. Add #journey-root or #root to the preview HTML.');
}

createRoot(rootElement).render(<FullFlowJourneyV36PreviewApp />);
