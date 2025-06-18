// This is server-side code that Netlify will run for you.
exports.handler = async function (event, context) {
  // Get the prompt from the incoming request from your React app
  const { prompt } = JSON.parse(event.body);

  // Your secret API key, securely accessed from Netlify's Environment Variables
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      return { statusCode: geminiResponse.status, body: JSON.stringify(errorData) };
    }

    const data = await geminiResponse.json();
    return { statusCode: 200, body: JSON.stringify(data) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: 'Failed to fetch from Gemini API' } }) };
  }
};