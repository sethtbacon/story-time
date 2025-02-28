/**
 * Extracts the dominant/average color from an image
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<string>} - A promise that resolves to a CSS color string
 */
export const extractColorFromImage = (imageUrl) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl) {
      resolve('#f0f0f0'); // Default background if no image
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle CORS issues
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resize for performance - we don't need to analyze the whole image
        const size = 50;
        canvas.width = size;
        canvas.height = size;
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, size, size);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, size, size).data;
        
        // Calculate average color (simple approach)
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }
        
        // Get average
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        // Adjust for better readability - lighten very dark colors
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 128) {
          // Lighten dark colors
          r = Math.min(255, r + 50);
          g = Math.min(255, g + 50);
          b = Math.min(255, b + 50);
        }
        
        // Convert to CSS color with reduced opacity for better text readability
        const color = `rgba(${r}, ${g}, ${b}, 0.25)`;
        resolve(color);
      } catch (error) {
        console.error("Error extracting color:", error);
        resolve('#f0f0f0'); // Fallback color
      }
    };
    
    img.onerror = () => {
      console.error("Failed to load image for color extraction");
      resolve('#f0f0f0'); // Fallback color
      reject(new Error("Failed to load image"));
    };
    
    img.src = imageUrl;
  });
};
