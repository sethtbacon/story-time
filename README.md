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