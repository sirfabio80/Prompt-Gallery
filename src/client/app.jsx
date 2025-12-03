import React, { useState } from 'react';
import PromptGallery from './components/PromptGallery.jsx';
import PromptDetail from './components/PromptDetail.jsx';
import './app.css';

export default function App() {
  const [currentView, setCurrentView] = useState('gallery');
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  const showGallery = () => {
    setCurrentView('gallery');
    setSelectedPromptId(null);
  };

  const showPromptDetail = (promptId) => {
    setSelectedPromptId(promptId);
    setCurrentView('detail');
  };

  const handleEditPrompt = (promptId) => {
    // For now, just show an alert - full edit functionality would be implemented later
    alert(`Edit functionality for prompt ${promptId} would be implemented here`);
  };

  return (
    <div className="app">
      {currentView === 'gallery' && (
        <PromptGallery onSelectPrompt={showPromptDetail} />
      )}
      
      {currentView === 'detail' && selectedPromptId && (
        <PromptDetail 
          promptId={selectedPromptId}
          onBack={showGallery}
          onEdit={handleEditPrompt}
        />
      )}
    </div>
  );
}