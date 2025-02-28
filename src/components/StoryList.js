import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/StoryList.css';

function StoryList() {
  console.log('StoryList component rendering');
  const [stories, setStories] = useState([]);
  const [error, setError] = useState('');
  // Add state for sorting
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    console.log('StoryList useEffect running');
    try {
      const loadedStories = JSON.parse(localStorage.getItem('stories') || '[]');
      setStories(loadedStories);
      console.log('Stories loaded:', loadedStories);
    } catch (err) {
      console.error("Error loading stories:", err);
      setError('Failed to load stories from storage');
    }
  }, []);

  const deleteStory = (id) => {
    try {
      const updatedStories = stories.filter(story => story.id !== id);
      setStories(updatedStories);
      localStorage.setItem('stories', JSON.stringify(updatedStories));
    } catch (err) {
      console.error("Error deleting story:", err);
      setError('Failed to delete story: ' + err.message);
      // Try to recover
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const downloadStory = (story) => {
    try {
      // Create a JSON string of the story
      const storyData = JSON.stringify(story, null, 2);
      
      // Create a blob with the data
      const blob = new Blob([storyData], { type: 'application/json' });
      
      // Create an object URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${story.title.replace(/\s+/g, '-').toLowerCase()}.json`;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading story:", err);
      setError('Failed to download story: ' + err.message);
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // Sorting function for stories
  const sortedStories = [...stories].sort((a, b) => {
    // Handle null/undefined values for authors
    const aValue = sortField === 'author' 
      ? (a.author || '').toLowerCase() 
      : a.title.toLowerCase();
    
    const bValue = sortField === 'author'
      ? (b.author || '').toLowerCase()
      : b.title.toLowerCase();
      
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Handle sort changes
  const handleSortChange = (e) => {
    setSortField(e.target.value);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="story-list">
      {stories.length > 0 && (
        <div className="story-list-header">
          <div className="sorting-controls">
            <div className="sort-group">
              <label htmlFor="sort-field">Sort by:</label>
              <select 
                id="sort-field" 
                value={sortField} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
              </select>
              <button 
                onClick={toggleSortDirection} 
                className="sort-direction-btn"
                title={sortDirection === 'asc' ? 'Ascending order' : 'Descending order'}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {stories.length === 0 ? (
        <div className="no-stories">
          <p>You don't have any storybooks yet.</p>
          <Link to="/upload" className="create-btn">Create Your First Story</Link>
        </div>
      ) : (
        <div className="stories-grid">
          {/* Use sortedStories instead of stories array */}
          {sortedStories.map(story => (
            <div className="story-card" key={story.id}>
              <Link to={`/read/${story.id}`} className="story-cover-link">
                <div className="story-cover">
                  {story.pages[0]?.imageUrl ? (
                    <img src={story.pages[0].imageUrl} alt={`Cover for ${story.title}`} />
                  ) : (
                    <div className="story-cover-placeholder">
                      <div className="placeholder-title">{story.title}</div>
                      <div className="placeholder-text">Open to read this story</div>
                    </div>
                  )}
                </div>
              </Link>
              <div className="story-info">
                <h3>{story.title}</h3>
                {/* New code to show author and link if available */}
                {story.author && (
                  <p className="story-author">
                    by {story.author}
                    {story.authorLink && (
                      <> – <a href={story.authorLink} target="_blank" rel="noopener noreferrer">Profile</a></>
                    )}
                  </p>
                )}
                <p>{story.pages.length} pages</p>
                <div className="story-actions">
                  <Link to={`/edit/${story.id}`} className="edit-btn">
                    Edit
                  </Link>
                  <button 
                    onClick={() => downloadStory(story)} 
                    className="download-btn"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => deleteStory(story.id)} 
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoryList;
