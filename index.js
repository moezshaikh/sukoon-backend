const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Chat endpoint with English, Hindi (Hinglish), Marathi (Roman)
app.post("/chat", async (req, res) => {
  const { userMessage, language } = req.body;

  let systemPrompt;
  switch (language) {
    case "hi":
      systemPrompt =
        "You are Sukoon, a compassionate AI therapist. Respond in Hindi using Roman letters (Hinglish) with empathy, calmness, and kindness. Keep responses short, thoughtful, and emotionally supportive. Use open-ended questions. Avoid giving direct advice or diagnosing. Never be judgmental. Help users reflect and feel safe.";
      break;
    case "mr":
      systemPrompt =
        "You are Sukoon, a compassionate AI therapist. Respond in Marathi using Roman letters with empathy, calmness, and kindness. Keep responses short, thoughtful, and emotionally supportive. Use open-ended questions. Avoid giving direct advice or diagnosing. Never be judgmental. Help users reflect and feel safe.";
      break;
    default:
      systemPrompt =
        "You are Sukoon, a compassionate AI therapist. Respond in English with empathy, calmness, and kindness. Keep responses short, thoughtful, and emotionally supportive. Use open-ended questions. Avoid giving direct advice or diagnosing. Never be judgmental. Help users reflect and feel safe.";
  }

  try {
    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = groqResponse.data.choices[0].message?.content;
    res.json({ reply });
  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with Groq API." });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send(
    "🧘‍♀️ Sukoon API is running. Use POST /chat with { userMessage, language } to talk to the AI therapist."
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Sukoon backend running on port ${PORT}`);
});
