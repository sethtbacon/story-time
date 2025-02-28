import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [textSize, setTextSize] = useState(100); // Default text size (percentage)
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [saveMessage, setSaveMessage] = useState('');

  // Available font options
  const fontOptions = [
    { name: 'Arial (Sans-serif)', value: 'Arial, sans-serif' },
    { name: 'Georgia (Serif)', value: 'Georgia, serif' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { name: 'Courier New', value: '"Courier New", monospace' }
  ];

  useEffect(() => {
    // Load saved preferences
    const savedTextSize = localStorage.getItem('storyReaderTextSize');
    if (savedTextSize) {
      setTextSize(parseInt(savedTextSize, 10));
    }
    
    const savedFont = localStorage.getItem('storyReaderFont');
    if (savedFont) {
      setFontFamily(savedFont);
    }
  }, []);

  const increaseTextSize = () => {
    if (textSize < 200) { // Max size: 200%
      const newSize = textSize + 10;
      setTextSize(newSize);
      saveSettings({ textSize: newSize });
    }
  };
  
  const decreaseTextSize = () => {
    if (textSize > 70) { // Min size: 70%
      const newSize = textSize - 10;
      setTextSize(newSize);
      saveSettings({ textSize: newSize });
    }
  };
  
  const handleFontChange = (e) => {
    const newFont = e.target.value;
    setFontFamily(newFont);
    saveSettings({ font: newFont });
  };

  const saveSettings = (settings) => {
    try {
      if (settings.textSize) {
        localStorage.setItem('storyReaderTextSize', settings.textSize.toString());
      }
      
      if (settings.font) {
        localStorage.setItem('storyReaderFont', settings.font);
      }
      
      // Just update the message without setTimeout to clear
      // It will be less intrusive visually
      setSaveMessage('Settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Failed to save settings');
    }
  };

  return (
    <div className="settings-page">
      <h2>Application Settings</h2>
      
      <div className="settings-message-container">
        {saveMessage && (
          <div className="settings-message">
            {saveMessage}
          </div>
        )}
      </div>
      
      <div className="settings-section">
        <h3>Reading Preferences</h3>
        
        <div className="settings-layout">
          <div className="settings-column">
            {/* Text Size Setting */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Text Size</div>
                <div className="setting-description">
                  Adjust the size of text when reading stories
                </div>
              </div>
              
              <div className="setting-control">
                <button 
                  className="size-btn" 
                  onClick={decreaseTextSize}
                  disabled={textSize <= 70}
                >
                  −
                </button>
                <span className="size-value">{textSize}%</span>
                <button 
                  className="size-btn" 
                  onClick={increaseTextSize}
                  disabled={textSize >= 200}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Font Family Setting */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Font Family</div>
                <div className="setting-description">
                  Choose a font for reading story text
                </div>
              </div>
              
              <div className="setting-control">
                <select 
                  value={fontFamily} 
                  onChange={handleFontChange}
                  className="font-select"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Combined Preview Area - updated to better simulate reading area */}
          <div className="preview-column">
            <div 
              className="combined-text-preview" 
              style={{ 
                fontFamily: fontFamily,
                fontSize: `${textSize}%` 
              }}
            >
              <p>Once upon a time, in a land far, far away...</p>
              <p>There lived a brave knight who protected the realm.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button 
          onClick={() => navigate('/')}
          className="back-btn"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Settings;
