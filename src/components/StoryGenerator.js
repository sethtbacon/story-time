import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/StoryGenerator.css';
import { TitleContext } from '../contexts/TitleContext';
import { generateStory, validateApiKey, extractPagesFromStory } from '../services/openaiService';

function StoryGenerator() {
  const navigate = useNavigate();
  const { setTitle } = useContext(TitleContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedStory, setGeneratedStory] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [rememberKey, setRememberKey] = useState(true);
  const [storyParams, setStoryParams] = useState({
    title: '',
    prompt: '',
    theme: 'adventure',
    length: 'medium',
    tone: 'friendly',
    author: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editedPages, setEditedPages] = useState([]);
  
  // Theme options
  const themeOptions = [
    { value: 'adventure', label: 'Adventure' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'educational', label: 'Educational' },
    { value: 'animals', label: 'Animals' },
    { value: 'friendship', label: 'Friendship' },
    { value: 'science', label: 'Science' }
  ];
  
  // Length options
  const lengthOptions = [
    { value: 'short', label: 'Short (1-2 min read)' },
    { value: 'medium', label: 'Medium (3-5 min read)' },
    { value: 'long', label: 'Long (6-10 min read)' }
  ];
  
  // Tone options
  const toneOptions = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'exciting', label: 'Exciting' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'educational', label: 'Educational' }
  ];
  
  useEffect(() => {
    setTitle('Generate AI Story');
    
    // Try to load API key from localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    return () => {
      setTitle('Story Time');
    };
  }, [setTitle]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryParams({
      ...storyParams,
      [name]: value
    });
  };
  
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };
  
  const handleGenerateStory = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!storyParams.prompt.trim()) {
      setError('Please enter a story prompt');
      return;
    }
    
    if (!storyParams.title.trim()) {
      setError('Please enter a title for your story');
      return;
    }
    
    // Validate API key
    if (!validateApiKey(apiKey)) {
      setError('Please enter a valid OpenAI API key');
      return;
    }
    
    // Save API key if rememberKey is checked
    if (rememberKey) {
      localStorage.setItem('openai_api_key', apiKey);
    } else {
      localStorage.removeItem('openai_api_key');
    }
    
    setLoading(true);
    
    try {
      // Generate the story
      const storyText = await generateStory({
        prompt: storyParams.prompt,
        theme: storyParams.theme,
        length: storyParams.length,
        tone: storyParams.tone
      }, apiKey);
      
      // Process story into pages
      const pages = extractPagesFromStory(storyText);
      
      // Create a new story object
      const newStory = {
        id: uuidv4(),
        title: storyParams.title,
        author: storyParams.author || 'AI Generated',
        authorLink: storyParams.author ? null : 'https://openai.com',
        pages
      };
      
      setGeneratedStory(newStory);
      setEditedPages(pages);
      
    } catch (err) {
      console.error('Story generation error:', err);
      setError(err.message || 'Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveStory = () => {
    try {
      // Get existing stories from localStorage
      const existingStories = JSON.parse(localStorage.getItem('stories') || '[]');
      
      // Create final story with edited pages
      const finalStory = {
        ...generatedStory,
        pages: editedPages
      };
      
      // Add new story to the list
      const updatedStories = [finalStory, ...existingStories];
      
      // Save to localStorage
      localStorage.setItem('stories', JSON.stringify(updatedStories));
      
      // Navigate to the story reader
      navigate(`/read/${finalStory.id}`);
      
    } catch (err) {
      console.error('Error saving story:', err);
      setError('Failed to save story: ' + err.message);
    }
  };
  
  const handleEditPageText = (index, newText) => {
    const updatedPages = [...editedPages];
    updatedPages[index] = { ...updatedPages[index], text: newText };
    setEditedPages(updatedPages);
  };
  
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  const handleReset = () => {
    setGeneratedStory(null);
    setEditedPages([]);
    setError('');
  };

  return (
    <div className="story-generator">
      {!generatedStory ? (
        <div className="generator-form-container">
          <div className="generator-intro">
            <h2>Create an AI-Generated Story</h2>
            <p>Describe what you'd like your story to be about, and our AI will create a unique story for you!</p>
          </div>
          
          <form onSubmit={handleGenerateStory} className="generator-form">
            <div className="form-group">
              <label htmlFor="title">Story Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={storyParams.title}
                onChange={handleInputChange}
                placeholder="Enter a title for your story"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prompt">Story Prompt:</label>
              <textarea
                id="prompt"
                name="prompt"
                value={storyParams.prompt}
                onChange={handleInputChange}
                placeholder="Describe what you want your story to be about..."
                rows={4}
                required
              />
              <p className="form-hint">
                Example: "a brave rabbit who discovers a magical garden" or "space explorers finding a new planet"
              </p>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="theme">Theme:</label>
                <select
                  id="theme"
                  name="theme"
                  value={storyParams.theme}
                  onChange={handleInputChange}
                >
                  {themeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="length">Story Length:</label>
                <select
                  id="length"
                  name="length"
                  value={storyParams.length}
                  onChange={handleInputChange}
                >
                  {lengthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="tone">Story Tone:</label>
                <select
                  id="tone"
                  name="tone"
                  value={storyParams.tone}
                  onChange={handleInputChange}
                >
                  {toneOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="author">Author Name (optional):</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={storyParams.author}
                  onChange={handleInputChange}
                  placeholder="Your name (optional)"
                />
              </div>
            </div>
            
            <div className="api-key-section">
              <div className="form-group">
                <label htmlFor="apiKey">OpenAI API Key:</label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your OpenAI API key"
                  required
                />
                <p className="form-hint">
                  You need an OpenAI API key to generate stories. 
                  <a href="https://platform.openai.com/signup" target="_blank" rel="noopener noreferrer">
                    Get a key here
                  </a>
                </p>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberKey}
                    onChange={() => setRememberKey(!rememberKey)}
                  />
                  Remember my API key
                </label>
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-actions">
              <button
                type="submit"
                className="generate-btn"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Story'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="generated-story-container">
          <div className="generated-story-header">
            <h2>{generatedStory.title}</h2>
            <p className="story-author">by {generatedStory.author}</p>
          </div>
          
          <div className="story-controls">
            <button 
              onClick={handleToggleEditMode} 
              className="control-btn"
            >
              {editMode ? 'Preview Story' : 'Edit Story'}
            </button>
            <button 
              onClick={handleSaveStory} 
              className="control-btn save-btn"
            >
              Save Story
            </button>
            <button 
              onClick={handleReset} 
              className="control-btn reset-btn"
            >
              Generate New Story
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="generated-content">
            {editMode ? (
              <div className="story-editor">
                <p className="editor-instructions">
                  Edit the text for each page of your story below. Click "Preview Story" to see how it will look.
                </p>
                {editedPages.map((page, index) => (
                  <div key={index} className="page-editor">
                    <h3>Page {index + 1}</h3>
                    <textarea
                      value={page.text}
                      onChange={(e) => handleEditPageText(index, e.target.value)}
                      rows={6}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="story-preview">
                {editedPages.map((page, index) => (
                  <div key={index} className="preview-page">
                    <h3>Page {index + 1}</h3>
                    <div className="preview-text">
                      {page.text.split('\n\n').map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryGenerator;
