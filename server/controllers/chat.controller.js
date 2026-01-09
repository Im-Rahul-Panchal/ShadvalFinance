import { getBotResponse } from "../services/chatbot.service.js";

export const chat = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const reply = getBotResponse(message);
  res.json({ reply });
};
