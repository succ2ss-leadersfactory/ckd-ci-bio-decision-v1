import { createRoot } from 'react-dom/client';
import './index.css';
import { FullFlowJourneyV36PreviewApp } from './full-flow-journey-v36-preview';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

function V37PreviewApp() {
  return <FullFlowJourneyV36PreviewApp />;
}

if (rootElement) {
  createRoot(rootElement).render(<V37PreviewApp />);
}
