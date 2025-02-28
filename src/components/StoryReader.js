import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/StoryReader.css';
import { TitleContext } from '../contexts/TitleContext';
import { extractColorFromImage } from '../utils/ColorExtractor';

function StoryReader() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [textSize, setTextSize] = useState(100);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const { setTitle } = useContext(TitleContext);
  const readerRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');

  // Load story and handle title
  useEffect(() => {
    const stories = JSON.parse(localStorage.getItem('stories') || '[]');
    const foundStory = stories.find(s => s.id === storyId);
    if (foundStory) {
      setStory(foundStory);
      setTitle(
        <div className="story-header-content">
          <span
            onClick={() => navigate('/')}
            className="clickable-title"
            title="Return to Home"
          >
            {foundStory.title}
          </span>
          {foundStory.author && (
            <span className="story-author-byline">
              by {foundStory.author}
            </span>
          )}
        </div>
      );
    } else {
      navigate('/');
    }

    const savedTextSize = localStorage.getItem('storyReaderTextSize');
    if (savedTextSize) {
      setTextSize(parseInt(savedTextSize, 10));
    }
    const savedFont = localStorage.getItem('storyReaderFont');
    if (savedFont) {
      setFontFamily(savedFont);
    }
    setLoading(false);
    if (readerRef.current) {
      readerRef.current.focus();
    }
    return () => {
      setTitle('Story Time');
    };
  }, [storyId, navigate, setTitle]);

  // Keyboard navigation effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          if (story && currentPage < story.pages.length - 1) {
            setCurrentPage(currentPage + 1);
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
          }
          e.preventDefault();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, story]);

  // Extract color and apply to the document body
  useEffect(() => {
    if (story && story.pages[currentPage]?.imageUrl) {
      extractColorFromImage(story.pages[currentPage].imageUrl)
        .then(color => {
          setBackgroundColor(color);
        })
        .catch(err => {
          console.error("Color extraction failed:", err);
          setBackgroundColor('#f0f0f0');
        });
    } else {
      setBackgroundColor('#f0f0f0');
    }
  }, [currentPage, story]);

  // New effect to sync the body background color with our backgroundColor state
  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.transition = 'background-color 0.8s ease';
    
    // Store the current background color in localStorage
    localStorage.setItem('currentBackgroundColor', backgroundColor);
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.transition = '';
      // Clean up when unmounting
      localStorage.removeItem('currentBackgroundColor');
    };
  }, [backgroundColor]);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (story && currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate('/');
    }
  };

  const handlePageAreaClick = (e) => {
    if (e.target !== e.currentTarget &&
        !e.target.classList.contains('navigation-overlay') &&
        !e.target.classList.contains('nav-area') &&
        !e.target.classList.contains('nav-indicator')) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickPosition = x / rect.width;
    
    clickPosition < 0.5 ? goToPreviousPage() : goToNextPage();
  };

  const handlePrevAreaClick = (e) => {
    e.stopPropagation();
    goToPreviousPage();
  };

  const handleNextAreaClick = (e) => {
    e.stopPropagation();
    goToNextPage();
  };

  if (loading) {
    return <div className="loading">Loading story...</div>;
  }
  if (!story) {
    return <div className="error">Story not found!</div>;
  }
  const page = story.pages[currentPage];

  return (
    <div className="story-reader" style={{ backgroundColor }}>
      <div className="page-display">
        <div
          className="page-content"
          style={{
            backgroundImage: page.imageUrl ? `url(${page.imageUrl})` : 'none',
          }}
          onClick={handlePageAreaClick}
          ref={readerRef}
          tabIndex="0"
          role="region"
          aria-label={`Story page ${currentPage + 1} of ${story.pages.length}`}
        >
          <div className="navigation-overlay">
            <div
              className="nav-area prev-area"
              onClick={handlePrevAreaClick}
              aria-label="Previous page"
              role="button"
              tabIndex="0"
            >
              <div className="nav-indicator">◄</div>
            </div>
            <div
              className="nav-area next-area"
              onClick={handleNextAreaClick}
              aria-label="Next page"
              role="button"
              tabIndex="0"
            >
              <div className="nav-indicator">►</div>
            </div>
          </div>
          <div className="page-text-container" onClick={(e) => e.stopPropagation()}>
            <p
              className="page-text"
              style={{
                fontSize: `${textSize}%`,
                fontFamily: fontFamily
              }}
            >
              {page.text}
            </p>
          </div>
        </div>
        <div className="page-footer">
          <div className="page-navigation">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousPage();
              }}
              disabled={currentPage === 0}
              className="nav-button prev-button"
            >
              &#8592; Previous Page
            </button>
            <div className="page-number">
              Page {currentPage + 1} of {story.pages.length}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                goToNextPage();
              }}
              className="nav-button next-button"
            >
              {currentPage === story.pages.length - 1 ? 'Back to Library' : 'Next Page'}
            </button>
          </div>
        </div>
      </div>
      <div className="keyboard-help">
        <p>Keyboard navigation: Use ← and → arrow keys to navigate between pages</p>
      </div>
    </div>
  );
}

export default StoryReader;