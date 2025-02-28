import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/StoryUploader.css';

function StoryUploader() {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState([{ text: '', imageUrl: '' }]);
  const [error, setError] = useState('');
  const [isImported, setIsImported] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef(null);
  
  // Add state to track the image input mode for each page
  const [imageInputModes, setImageInputModes] = useState([{ mode: 'url' }]);

  // New state for author field
  const [author, setAuthor] = useState('');

  // Load story data if in edit mode
  useEffect(() => {
    if (storyId) {
      try {
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        const storyToEdit = stories.find(story => story.id === storyId);
        
        if (storyToEdit) {
          setTitle(storyToEdit.title);
          setPages(storyToEdit.pages);
          // Load the author name if it exists
          if (storyToEdit.author) {
            setAuthor(storyToEdit.author);
          }
          setIsEditMode(true);
          
          // Initialize image input modes for all pages
          const modes = storyToEdit.pages.map(() => ({ mode: 'url' }));
          setImageInputModes(modes);
        } else {
          setError('Story not found.');
          setTimeout(() => navigate('/'), 3000); // Redirect to home page after 3 seconds
        }
      } catch (err) {
        console.error("Error loading story for editing:", err);
        setError('Failed to load story for editing: ' + err.message);
      }
    }
  }, [storyId, navigate]);

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle page text change
  const handlePageTextChange = (index, e) => {
    const updatedPages = [...pages];
    updatedPages[index].text = e.target.value;
    setPages(updatedPages);
  };

  // Handle page image URL change
  const handlePageImageChange = (index, e) => {
    const updatedPages = [...pages];
    updatedPages[index].imageUrl = e.target.value;
    setPages(updatedPages);
  };

  // Handle toggling between URL and file upload for a page
  const toggleImageInputMode = (index, mode) => {
    const newModes = [...imageInputModes];
    
    // Ensure we have a mode entry for this index
    while (newModes.length <= index) {
      newModes.push({ mode: 'url' });
    }
    
    newModes[index].mode = mode;
    setImageInputModes(newModes);
  };

  // Handle image file selection
  const handleImageFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError(`File "${file.name}" is not an image.`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large (max 5MB).');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Convert image to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const updatedPages = [...pages];
      updatedPages[index].imageUrl = event.target.result;
      setPages(updatedPages);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setTimeout(() => setError(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Add a new page
  const addPage = () => {
    setPages([...pages, { text: '', imageUrl: '' }]);
    setImageInputModes([...imageInputModes, { mode: 'url' }]);
  };

  // Remove a page
  const removePage = (index) => {
    if (pages.length <= 1) {
      setError('A story must have at least one page.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    const updatedPages = [...pages];
    updatedPages.splice(index, 1);
    setPages(updatedPages);

    const updatedModes = [...imageInputModes];
    updatedModes.splice(index, 1);
    setImageInputModes(updatedModes);
  };

  // Import a story from JSON file
  const importStory = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Parse the JSON file
        const storyData = JSON.parse(e.target.result);
        
        // Validate the story structure
        if (!storyData.title || !Array.isArray(storyData.pages)) {
          throw new Error("Invalid story format. The file must contain title and pages.");
        }
        
        // Set the form data from the imported story
        setTitle(storyData.title);
        setPages(storyData.pages);
        
        // Set import flag and clear any errors
        setIsImported(true);
        setError('');
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
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

  // Open file dialog
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Save the story (create new or update existing)
  const saveStory = () => {
    try {
      // Validate inputs
      if (!title.trim()) {
        setError('Please enter a story title.');
        return;
      }
      
      for (let i = 0; i < pages.length; i++) {
        if (!pages[i].text.trim()) {
          setError(`Please enter text for page ${i + 1}.`);
          return;
        }
      }
      
      // Create story object
      const story = {
        id: isEditMode ? storyId : uuidv4(), // Use existing ID if editing
        title: title.trim(),
        author: author.trim(),       // New: author of the story
        pages: pages.map(page => ({
          text: page.text.trim(),
          imageUrl: page.imageUrl.trim()
        }))
      };
      
      // Get existing stories
      const existingStories = JSON.parse(localStorage.getItem('stories') || '[]');
      
      if (isEditMode) {
        // Replace the existing story
        const updatedStories = existingStories.map(s => 
          s.id === storyId ? story : s
        );
        localStorage.setItem('stories', JSON.stringify(updatedStories));
      } else {
        // Add new story
        localStorage.setItem('stories', JSON.stringify([...existingStories, story]));
      }
      
      // Navigate back to home
      navigate('/');
      
    } catch (err) {
      console.error("Error saving story:", err);
      setError('Failed to save story: ' + err.message);
    }
  };

  return (
    <div className="story-uploader">
      <h2>{isEditMode ? `Edit Story: ${title}` : (isImported ? 'Edit Imported Story' : 'Create a New Story')}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {!isEditMode && (
        <div className="import-section">
          <button onClick={triggerFileInput} className="import-btn">
            Import Story from File
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={importStory} 
            accept=".json"
            style={{ display: 'none' }} 
          />
          {isImported && <div className="import-success">Story imported successfully! You can edit it below.</div>}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="story-title">Story Title:</label>
        <input 
          type="text"
          id="story-title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter the story title"
          className="form-control"
        />
      </div>
      
      {/* New: Author input */}
      <div className="form-group">
        <label htmlFor="author">Author (optional)</label>
        <input 
          id="author"
          type="text" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author's name"
          className="form-control"
        />
      </div>
      
      <h3>Pages</h3>
      {pages.map((page, index) => (
        <div key={index} className="page-form">
          <h4>Page {index + 1}</h4>
          
          <div className="form-group">
            <label htmlFor={`page-text-${index}`}>Text:</label>
            <textarea
              id={`page-text-${index}`}
              value={page.text}
              onChange={(e) => handlePageTextChange(index, e)}
              placeholder="Enter the page text"
              className="form-control"
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <div className="image-input-toggle">
              <button 
                className={`toggle-btn ${imageInputModes[index]?.mode === 'upload' ? 'active' : ''}`}
                onClick={() => toggleImageInputMode(index, 'upload')}
                type="button"
              >
                <span className="icon">📤</span> Upload Image
              </button>
              <button 
                className={`toggle-btn ${imageInputModes[index]?.mode === 'url' ? 'active' : ''}`}
                onClick={() => toggleImageInputMode(index, 'url')}
                type="button"
              >
                <span className="icon">🔗</span> Image URL
              </button>
            </div>
            
            {imageInputModes[index]?.mode === 'url' ? (
              <>
                <label htmlFor={`page-image-${index}`}>Image URL (optional):</label>
                <input
                  type="text"
                  id={`page-image-${index}`}
                  value={page.imageUrl}
                  onChange={(e) => handlePageImageChange(index, e)}
                  placeholder="Enter an image URL"
                  className="form-control"
                />
              </>
            ) : (
              <>
                <label htmlFor={`page-image-file-${index}`}>Upload Image (optional):</label>
                <input
                  type="file"
                  id={`page-image-file-${index}`}
                  onChange={(e) => handleImageFileChange(index, e)}
                  accept="image/*"
                  className="form-control file-input"
                />
                <div className="image-upload-help">
                  Max file size: 5MB. Supported formats: JPEG, PNG, GIF.
                </div>
              </>
            )}
            
            {page.imageUrl && (
              <div className="image-preview">
                <img src={page.imageUrl} alt={`Preview for page ${index + 1}`} />
              </div>
            )}
          </div>
          
          <button 
            type="button" 
            onClick={() => removePage(index)}
            className="remove-btn"
          >
            Remove Page
          </button>
        </div>
      ))}
      
      <div className="actions">
        <button onClick={addPage} className="add-page-btn">Add Page</button>
        <button onClick={saveStory} className="save-btn">
          {isEditMode ? 'Update Story' : 'Save Story'}
        </button>
        {isEditMode && (
          <button 
            onClick={() => navigate('/')} 
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default StoryUploader;
