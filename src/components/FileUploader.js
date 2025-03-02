import React, { useState, useRef, useContext, useEffect } from 'react'; // Add useEffect
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Add uuidv4 import
import { TitleContext } from '../contexts/TitleContext';
import '../styles/FileUploader.css';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
  </svg>
);

function FileUploader() {
  const navigate = useNavigate();
  const { setTitle } = useContext(TitleContext);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  
  // Set the page title
  useEffect(() => {
    setTitle('Upload Story File');
    
    return () => {
      setTitle('Story Time');
    };
  }, [setTitle]);
  
  const importStory = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
      setError('Please select a JSON file.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const storyData = JSON.parse(e.target.result);
        
        if (!storyData.title || !Array.isArray(storyData.pages)) {
          throw new Error("Invalid story format. The file must contain title and pages.");
        }
        
        // Store the story in localStorage
        const existingStories = JSON.parse(localStorage.getItem('stories') || '[]');
        
        // Generate a new ID for the story
        const newStory = {
          ...storyData,
          id: uuidv4()
        };
        
        localStorage.setItem('stories', JSON.stringify([...existingStories, newStory]));
        
        // Show success message and redirect after a delay
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } catch (err) {
        console.error("Error importing story:", err);
        setError('Failed to import story: ' + err.message);
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      setTimeout(() => {
        setError('');
      }, 3000);
    };
    
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="file-uploader">
      <h2>Upload Story File</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Story uploaded successfully! Redirecting to home...</div>}
      
      <div className="upload-instructions">
        <h3>How to Upload a Story</h3>
        <p>
          Upload a JSON file that contains your story. The file should follow this structure:
        </p>
        <pre className="json-example">
{`{
  "title": "Story Title",
  "author": "Author Name",
  "pages": [
    { 
      "text": "Page 1 content",
      "imageUrl": "optional-image-url" 
    },
    { 
      "text": "Page 2 content",
      "imageUrl": "optional-image-url" 
    }
  ]
}`}
        </pre>
      </div>
      
      <div className="upload-area" onClick={triggerFileInput}>
        <UploadIcon />
        <p className="upload-text">
          Click to select a story file<br/>
          or drag and drop it here
        </p>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={importStory}
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="upload-actions">
        <button 
          className="cancel-btn"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default FileUploader;
