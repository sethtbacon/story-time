# Story Time

Story Time is an interactive reading app designed for kids. Create, read, and share engaging stories with a modern, customizable reading experience.

## Features

- **Interactive Reading:** Navigate stories via clicks/taps and keyboard arrow keys.
- **Customizable Settings:** Adjust text size and choose from multiple fonts. Preferences are stored in localStorage.
- **Story Management:** Create, edit, delete, and download storybooks.
- **JSON Story Schema:** Stories are stored as JSON. See [story-schema.json](./story-schema.json) for details.

## JSON Story Schema

The following JSON schema defines how stories are structured in Story Time:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Story",
  "type": "object",
  "required": ["id", "title", "pages"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the story."
    },
    "title": {
      "type": "string",
      "description": "Title of the story."
    },
    "pages": {
      "type": "array",
      "minItems": 1,
      "description": "Array of page objects.",
      "items": {
        "type": "object",
        "required": ["text"],
        "properties": {
          "text": {
            "type": "string",
            "description": "Text content for the page."
          },
          "imageUrl": {
            "type": "string",
            "format": "uri",
            "description": "Optional URL for the page image."
          }
        }
      }
    }
  }
}
```

## Getting Started

1. **Install Dependencies**  
   ```bash
   npm install
   ```

2. **Start the App**  
   ```bash
   npm start
   ```  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**  
   ```bash
   npm run build
   ```

## Project Structure

- **/src/components/** – Contains React components like StoryList, StoryReader, StoryUploader, and Settings.  
- **/src/styles/** – CSS files for styling the app.  
- **/src/contexts/** – Global contexts shared across components.  
- **/public/** – Public assets including the manifest.

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## GitHub Repository

For more details, source code, and contribution guidelines, visit the [Story Time GitHub repository](https://github.com/sethtbacon/story-time).

## License

This project is licensed under the [MIT License](LICENSE).

Enjoy reading, creating, and sharing stories with Story Time!
# Story Time

Story Time is an interactive reading app designed for kids. Create, read, and share engaging stories with a modern and customizable reading experience.

## Features

- **Interactive Reading:** Navigate stories via clicks/taps and keyboard arrow keys.
- **Customizable Settings:** Adjust text size and choose from multiple fonts. Your preferences are saved in localStorage.
- **Story Management:** Create, edit, delete, and download storybooks.
- **JSON Story Schema:** Stories are stored as JSON in localStorage. See the included schema file for details.

## JSON Story Schema

Use the following JSON schema as a guide to structure your stories:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Story",
  "type": "object",
  "required": ["id", "title", "pages"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the story."
    },
    "title": {
      "type": "string",
      "description": "Title of the story."
    },
    "pages": {
      "type": "array",
      "minItems": 1,
      "description": "Array of page objects.",
      "items": {
        "type": "object",
        "required": ["text"],
        "properties": {
          "text": {
            "type": "string",
            "description": "Text content for the page."
          },
          "imageUrl": {
            "type": "string",
            "format": "uri",
            "description": "Optional URL for the page image."
          }
        }
      }
    }
  }
}
```

For a complete reference, see [story-schema.json](./story-schema.json).

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Start the App**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

- **/src/components/**: Contains React components such as StoryList, StoryReader, StoryUploader, and Settings.
- **/src/styles/**: CSS files for component styling.
- **/src/contexts/**: Global context for sharing story title data.
- **/public/**: Public assets and manifest.

## Contributing

Contributions are welcome! Fork the repository, implement your changes, and submit a pull request.

## License

This project is licensed under the MIT License.

Story Time brings stories to life with an engaging and intuitive interface. Enjoy your reading and happy storytelling!