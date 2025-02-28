import React, { createContext, useState } from 'react';

// Create the context
export const TitleContext = createContext();

// Create a provider component
export const TitleProvider = ({ children }) => {
  // Title can now be a string or a React element
  const [title, setTitle] = useState('Story Time');

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
