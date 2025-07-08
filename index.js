const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { userMessage, systemPrompt } = req.body;

  try {
    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192", // or use "mixtral-8x7b-32768"
        messages: [
          {
            role: "system",
            content: systemPrompt || 
              "You are Sukoon, a compassionate AI therapist. Respond with empathy, calmness, and kindness. Keep responses short, thoughtful, and emotionally supportive. Use open-ended questions. Avoid giving direct advice or diagnosing. Never be judgmental. Help users reflect and feel safe.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = groqResponse.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with Groq API." });
  }
});

app.get("/", (req, res) => {
  res.send("🧘‍♀️ Sukoon API is running. Use POST /chat to talk to the AI therapist.");
});

app.listen(5000, () => {
  console.log("✅ Sukoon backend running with Groq at http://localhost:5000");
});
