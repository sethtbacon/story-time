// This service handles interactions with the OpenAI API for story generation

const API_ENDPOINT = process.env.REACT_APP_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';

/**
 * Generate a story based on user parameters
 * @param {Object} params - Story generation parameters
 * @param {string} params.prompt - User's story prompt
 * @param {string} params.theme - Selected theme/category
 * @param {string} params.length - Desired story length
 * @param {string} params.tone - Desired story tone
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<string>} - Generated story text
 */
export const generateStory = async (params, apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const { prompt, theme, length, tone } = params;
  
  // Create a well-structured prompt for the AI
  const fullPrompt = `Write a ${length} children's story with a ${tone} tone about ${prompt}. 
  Theme: ${theme}.
  Make the story engaging for young readers with clear paragraphs.
  Include a beginning, middle and end.
  The story should be appropriate for children.`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a creative children's story writer who creates engaging, age-appropriate content."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: getMaxTokens(length)
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate story');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};

/**
 * Determine maximum tokens based on desired story length
 */
function getMaxTokens(length) {
  switch (length) {
    case 'short':
      return 500;
    case 'medium':
      return 1000;
    case 'long':
      return 2000;
    default:
      return 1000;
  }
}

/**
 * Validate if the API key format is potentially valid
 */
export const validateApiKey = (apiKey) => {
  // Simple validation - OpenAI keys typically start with "sk-" and have a certain length
  return typeof apiKey === 'string' && apiKey.startsWith('sk-') && apiKey.length > 20;
};

/**
 * Extract pages from generated story text
 * @param {string} storyText - Complete story text
 * @returns {Array} - Array of page objects with text content
 */
export const extractPagesFromStory = (storyText) => {
  if (!storyText) return [];
  
  // Split into paragraphs and group them into pages
  const paragraphs = storyText.split('\n\n').filter(p => p.trim().length > 0);
  
  // Create pages from paragraphs (1-2 paragraphs per page depending on length)
  const pages = [];
  let currentPage = '';
  
  paragraphs.forEach((paragraph, index) => {
    // If paragraph is very short, combine with next paragraph
    if (currentPage && (currentPage.length + paragraph.length > 300)) {
      pages.push({ text: currentPage.trim() });
      currentPage = paragraph;
    } else {
      currentPage = currentPage 
        ? `${currentPage}\n\n${paragraph}` 
        : paragraph;
    }
    
    // Push the last paragraph or if we're at the end
    if (index === paragraphs.length - 1 && currentPage) {
      pages.push({ text: currentPage.trim() });
    }
  });
  
  return pages;
};
