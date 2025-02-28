import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import '../styles/App.css';
import StoryUploader from './StoryUploader';
import StoryReader from './StoryReader';
import StoryList from './StoryList';
import Settings from './Settings';
import { TitleContext } from '../contexts/TitleContext';

function App() {
  const { title } = useContext(TitleContext);
  const location = useLocation();
  const [mainBackground, setMainBackground] = useState(undefined);
  
  const isReadingPage = location.pathname.includes('/read/');
  
  // Effect to sync main background color with localStorage
  useEffect(() => {
    if (isReadingPage) {
      // Check for stored background color every 100ms while in reading mode
      const intervalId = setInterval(() => {
        const storedColor = localStorage.getItem('currentBackgroundColor');
        if (storedColor) {
          setMainBackground(storedColor);
        }
      }, 100);
      
      return () => {
        clearInterval(intervalId);
        setMainBackground(undefined);
      };
    }
  }, [isReadingPage]);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>{title}</h1>
        {/* Only show navigation when not on reading page */}
        {!isReadingPage && (
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/upload" className="nav-link">Create Story</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
          </nav>
        )}
      </header>
      
      {/* When reading, make main transparent so body background shows */}
      <main style={{ backgroundColor: isReadingPage ? mainBackground : undefined }}>
        <Routes>
          <Route path="/" element={<StoryList />} />
          <Route path="/upload" element={<StoryUploader />} />
          <Route path="/edit/:storyId" element={<StoryUploader />} />
          <Route path="/read/:storyId" element={<StoryReader />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      
      <footer>
        <div className="footer-content">
          <p>Story Time - A fun reading app for kids</p>
          <p>
            Powered by{" "}
            <a
              href="https://github.com/sethtbacon/story-time"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
