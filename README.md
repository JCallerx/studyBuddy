# Study Buddy

Study Buddy is a lightweight, personalized Chrome extension designed to help you study by visually analyzing questions on your screen and providing instant answers and step-by-step explanations. 

Powered by the **Google Gemini 2.5 Flash API**, this extension captures your current active tab, extracts the question using advanced multimodal AI, and formats the response into a clean, easy-to-read, tabbed interface.

## Features
- **One-Click Solving:** Click "Solve Question" to capture the visible screen and get a concise answer instantly.
- **Tabbed Interface:** Separates the direct answer from the detailed step-by-step explanation.
- **Persistent Memory:** Uses Chrome's local storage to remember your last asked question, even if you close the extension popup.
- **Secure API Key Management:** Safely store your personal Gemini API key locally within the extension's settings. No need for hardcoded config files.

## Prerequisites
- Google Chrome browser.
- A [Google Gemini API Key](https://aistudio.google.com/).

## Installation (How to Clone and Run)

Since this is an unpacked Chrome Extension, you'll need to load it directly into Chrome in Developer Mode.

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/JCallerx/studyBuddy.git>
   ```

Open Chrome Extensions:

Open Google Chrome.

Type chrome://extensions/ in the URL bar and press Enter.

Enable Developer Mode:

In the top right corner of the Extensions page, toggle Developer mode to ON.

Load the Extension:

Click the Load unpacked button that appears in the top left.

Select the folder where you cloned or extracted the project.

Pin the Extension (Optional):

Click the puzzle piece icon in your Chrome toolbar and pin "Carla's Study Buddy" for easy access.

Usage & Configuration
Set your API Key:

Open the extension by clicking its icon.

Click the ⚙️ Settings button.

Paste your Gemini API Key into the input field and click Save Key. (This key is stored securely in your local browser storage).

Solve a Question:

Navigate to a webpage containing a question you want to solve.

Open the extension and click Solve Question.

Wait a few moments while the AI analyzes the screen.

View the result in the Answer and Explanation tabs!

Files Structure
manifest.json: Configuration, metadata, and permissions for the Chrome Extension.

popup.html: The user interface and inline CSS styling for the extension.

popup.js: The core logic handling screen capture, API calls to Gemini, UI tab switching, and local storage.

Privacy
This extension takes a screenshot of your active tab only when you explicitly click the "Solve Question" button. The image is sent securely to the Google Gemini API for processing and is not stored externally. Your API key is saved locally on your device within your Chrome profile.
