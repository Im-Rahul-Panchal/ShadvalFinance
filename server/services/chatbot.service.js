import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { similarity } from "../utils/nlp.js";

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON manually
const knowledgeBasePath = path.join(__dirname, "../data/knowledgeBase.json");
const knowledgeBase = JSON.parse(
  fs.readFileSync(knowledgeBasePath, "utf-8")
);

const FALLBACK_RESPONSE =
  "Sorry, main is query ka answer generate nahi kar pa raha hoon.";

export function getBotResponse(userMessage) {
  userMessage = userMessage.toLowerCase();

  let bestMatch = { score: 0, answer: null };

  for (const item of knowledgeBase) {
    for (const q of item.questions) {
      const score = similarity(userMessage, q);
      if (score > bestMatch.score) {
        bestMatch = { score, answer: item.answer };
      }
    }
  }

  if (bestMatch.score > 0.75) {
    return bestMatch.answer;
  }

  return FALLBACK_RESPONSE;
}
