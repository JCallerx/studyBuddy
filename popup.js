
// --- Tab & UI Logic ---
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.target).classList.add('active');
  });
});

// --- Settings Panel Logic ---
const settingsBtn = document.getElementById('settingsBtn');
const settingsPane = document.getElementById('settingsPane');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const saveStatus = document.getElementById('saveStatus');

// Toggle the settings pane open/closed
settingsBtn.addEventListener('click', () => {
  settingsPane.style.display = settingsPane.style.display === 'none' ? 'block' : 'none';
});

// Save the API key to storage
saveSettingsBtn.addEventListener('click', () => {
  const newKey = apiKeyInput.value.trim();
  chrome.storage.local.set({ customApiKey: newKey }, () => {
    saveStatus.innerText = "Saved!";
    setTimeout(() => saveStatus.innerText = "", 2000); // Clear message after 2s
  });
});

// --- Load Saved Data on Open ---
document.addEventListener('DOMContentLoaded', () => {
  const answerPane = document.getElementById('answerPane');
  const explainPane = document.getElementById('explainPane');

  // Load saved answers AND the saved API key
  chrome.storage.local.get(['savedAnswer', 'savedExplanation', 'customApiKey'], (result) => {
    if (result.savedAnswer) answerPane.innerText = result.savedAnswer;
    if (result.savedExplanation) explainPane.innerText = result.savedExplanation;
    if (result.customApiKey) apiKeyInput.value = result.customApiKey; // Populate the input if a key exists
  });
});

// --- Capture & API Logic ---
document.getElementById('captureBtn').addEventListener('click', async () => {
  const answerPane = document.getElementById('answerPane');
  const explainPane = document.getElementById('explainPane');
  
  answerPane.innerText = "Capturing and thinking...";
  explainPane.innerText = "Capturing and thinking...";

  try {
    // 1. Get the API Key (Check storage first, fallback to config.js)
    const storageResult = await chrome.storage.local.get(['customApiKey']);
    const ACTIVE_API_KEY = storageResult.customApiKey

    if (!ACTIVE_API_KEY) {
      throw new Error("No API key found. Please add one in settings.");
    }

    // 2. Capture Image
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "jpeg" });
    const base64Image = dataUrl.split(',')[1];

    // 3. Setup API Call using the ACTIVE key
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${ACTIVE_API_KEY}`;

    const payload = {
      contents: [{
        parts: [
          { text: "Extract the question from this image and solve it." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            answer: { type: "STRING" },
            explanation: { type: "STRING" }
          },
          required: ["answer", "explanation"]
        }
      }
    };

    // 4. Execute API Call
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const jsonResult = JSON.parse(resultText);
    
    // 5. Save to storage & update UI
    chrome.storage.local.set({
      savedAnswer: jsonResult.answer || "No answer provided.",
      savedExplanation: jsonResult.explanation || "No explanation provided."
    });

    answerPane.innerText = jsonResult.answer || "No answer provided.";
    explainPane.innerText = jsonResult.explanation || "No explanation provided.";

  } catch (error) {
    console.error("Error during capture/solve:", error);
    answerPane.innerText = error.message.includes("No API key") 
      ? "Please set your API key in settings." 
      : "An error occurred. Check the console.";
    explainPane.innerText = "Error details logged to console.";
  }
});