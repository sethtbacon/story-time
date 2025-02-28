import React from 'react';
import './styles/App.css';
// Remove the TestComponent import line

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Story Time</h1>
        <nav>
          <a href="/" className="nav-link">Home</a>
          <a href="/stories" className="nav-link">Stories</a>
          <a href="/about" className="nav-link">About</a>
        </nav>
      </header>
      <main>
        {/* TestComponent has been removed from here */}
        <h2>Welcome to Story Time!</h2>
        <p>A magical place where stories come to life.</p>
      </main>
      <footer>
        <p>&copy; 2023 Story Time App</p>
      </footer>
    </div>
  );
}

export default App;
