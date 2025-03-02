import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/StoryUploader.css';

// Define icon components
const CreateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
    <path
      fillRule="evenodd"
      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
    />
  </svg>
);

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
  </svg>
);

const GenerateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M5 8.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 5 8.25Z" />
    <path d="M8.5 2a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM15 8.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
    <path fillRule="evenodd" d="M7.5 6V3h2v3h3v2h-3v3h-2V8h-3V6h3Z" />
  </svg>
);

function StoryUploader() {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState([{ text: '', imageUrl: '' }]);
  const [error, setError] = useState('');
  const [isImported, setIsImported] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [mode, setMode] = useState(null);
  const fileInputRef = useRef(null);
  const jsonFileInputRef = useRef(null);

  // Add state to track the image input mode for each page
  const [imageInputModes, setImageInputModes] = useState([{ mode: 'url' }]);

  // New state for author field
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (storyId) {
      try {
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        const storyToEdit = stories.find((story) => story.id === storyId);

        if (storyToEdit) {
          setTitle(storyToEdit.title);
          setPages(storyToEdit.pages);
          if (storyToEdit.author) {
            setAuthor(storyToEdit.author);
          }
          setIsEditMode(true);
          setMode('create');

          const modes = storyToEdit.pages.map(() => ({ mode: 'url' }));
          setImageInputModes(modes);
        } else {
          setError('Story not found.');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error('Error loading story for editing:', err);
        setError('Failed to load story for editing: ' + err.message);
      }
    }
  }, [storyId, navigate]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePageTextChange = (index, e) => {
    const updatedPages = [...pages];
    updatedPages[index].text = e.target.value;
    setPages(updatedPages);
  };

  const handlePageImageChange = (index, e) => {
    const updatedPages = [...pages];
    updatedPages[index].imageUrl = e.target.value;
    setPages(updatedPages);
  };

  const toggleImageInputMode = (index, mode) => {
    const newModes = [...imageInputModes];
    while (newModes.length <= index) {
      newModes.push({ mode: 'url' });
    }
    newModes[index].mode = mode;
    setImageInputModes(newModes);
  };

  const handleImageFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(`File "${file.name}" is not an image.`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large (max 5MB).');
      setTimeout(() => setError(''), 3000);
      return;
    }

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

  const addPage = () => {
    setPages([...pages, { text: '', imageUrl: '' }]);
    setImageInputModes([...imageInputModes, { mode: 'url' }]);
  };

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

  const importStory = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const storyData = JSON.parse(e.target.result);

        if (!storyData.title || !Array.isArray(storyData.pages)) {
          throw new Error(
            'Invalid story format. The file must contain title and pages.'
          );
        }

        setTitle(storyData.title);
        setPages(storyData.pages);
        if (storyData.author) {
          setAuthor(storyData.author);
        }

        setIsImported(true);
        setError('');
        setMode('create');

        if (jsonFileInputRef.current) {
          jsonFileInputRef.current.value = '';
        }
      } catch (err) {
        console.error('Error importing story:', err);
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

  // eslint-disable-next-line no-unused-vars
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerJsonFileInput = () => {
    if (jsonFileInputRef.current) {
      jsonFileInputRef.current.click();
    }
  };

  const saveStory = () => {
    try {
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

      const story = {
        id: isEditMode ? storyId : uuidv4(),
        title: title.trim(),
        author: author.trim(),
        pages: pages.map((page) => ({
          text: page.text.trim(),
          imageUrl: page.imageUrl.trim(),
        })),
      };

      const existingStories = JSON.parse(localStorage.getItem('stories') || '[]');

      if (isEditMode) {
        const updatedStories = existingStories.map((s) =>
          s.id === storyId ? story : s
        );
        localStorage.setItem('stories', JSON.stringify(updatedStories));
      } else {
        localStorage.setItem(
          'stories',
          JSON.stringify([...existingStories, story])
        );
      }

      navigate('/');
    } catch (err) {
      console.error('Error saving story:', err);
      setError('Failed to save story: ' + err.message);
    }
  };

  // Render mode selection screen
  if (!storyId && mode === null) {
    return (
      <div className="story-creator-options">
        <h2>How do you want to make your story?</h2>

        <div className="creation-options">
          <button
            className="option-button create-option"
            onClick={() => setMode('create')}
          >
            <CreateIcon />
            <span className="option-label">Write It</span>
          </button>

          {/* Change this button to set mode to 'upload' instead of navigating */}
          <button
            className="option-button upload-option"
            onClick={() => setMode('upload')}
          >
            <UploadIcon />
            <span className="option-label">Add File</span>
          </button>

          <button
            className="option-button generate-option"
            onClick={() => navigate('/generate')}
          >
            <GenerateIcon />
            <span className="option-label">Magic Story</span>
          </button>
        </div>
      </div>
    );
  }

  // Render the file upload screen
  if (mode === 'upload' && !isImported) {
    return (
      <div className="story-uploader upload-mode">
        <div className="uploader-header">
          <h2>Import Story from File</h2>
          <button className="back-button" onClick={() => setMode(null)}>
            Back to Options
          </button>
        </div>

        <div className="upload-container">
          <div className="upload-instructions">
            <h3>How to Import a Story</h3>
            {error && <div className="error-message">{error}</div>}
            <p>
              Upload a JSON file that contains your story. The file should follow this
              structure:
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

          <div className="upload-area" onClick={triggerJsonFileInput}>
            <UploadIcon />
            <p className="upload-text">
              Click to select a story file
              <br />
              or drag and drop it here
            </p>
            <input
              type="file"
              ref={jsonFileInputRef}
              onChange={importStory}
              accept=".json"
              style={{ display: 'none' }}
            />
          </div>

          {isImported && (
            <div className="import-success">
              Story imported successfully! You can edit it below.
            </div>
          )}

          <div className="upload-actions">
            <button className="cancel-btn" onClick={() => setMode(null)}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the manual story creation screen (also used for editing imported stories)
  return (
    <div className="story-uploader">
      <div className="uploader-header">
        <h2>
          {isEditMode
            ? `Edit Story: ${title}`
            : isImported
            ? 'Edit Imported Story'
            : 'Create a New Story'}
        </h2>
        {!isEditMode && !storyId && (
          <button className="back-button" onClick={() => setMode(null)}>
            Back to Options
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

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
                className={`toggle-btn ${
                  imageInputModes[index]?.mode === 'upload' ? 'active' : ''
                }`}
                onClick={() => toggleImageInputMode(index, 'upload')}
                type="button"
              >
                <span className="icon">📤</span> Upload Image
              </button>
              <button
                className={`toggle-btn ${
                  imageInputModes[index]?.mode === 'url' ? 'active' : ''
                }`}
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
        <button onClick={addPage} className="add-page-btn">
          Add Page
        </button>
        <button onClick={saveStory} className="save-btn">
          {isEditMode ? 'Update Story' : 'Save Story'}
        </button>
        {!isEditMode ? (
          <button onClick={() => setMode(null)} className="cancel-btn">
            Cancel
          </button>
        ) : (
          <button onClick={() => navigate('/')} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
export default StoryUploader;