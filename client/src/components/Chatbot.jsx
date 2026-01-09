import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MessageCircle, Mic, Send, X } from "lucide-react";
import { BASE_URL } from "../config.js";

export default function Chatbot() {
  const QUICK_QUESTIONS = [
    "kaun kaun se loan milte hai",
    "What is the minimum loan amount?",
    "loan eligibility kya hai",
    "What documents are required?",
    "How much EMI will I pay?",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [voices, setVoices] = useState([]);
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    // Load voices for speech synthesis
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Close chatbot if clicked outside
    const handleOutsideClick = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playAudio = (text, lang = "en") => {
    const audio = new Audio(
      `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}`
    );
    audio.play();
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.lang = "hi-IN";

    const voice =
      window.speechSynthesis
        .getVoices()
        .find(
          (v) =>
            v.lang === "hi-IN" &&
            (v.name.toLowerCase().includes("female") ||
              v.name.toLowerCase().includes("neerja") ||
              v.name.toLowerCase().includes("heera") ||
              v.name.toLowerCase().includes("google"))
        ) || window.speechSynthesis.getVoices()[0];

    if (voice) utterance.voice = voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;

  const startListening = () => {
    recognition.start();
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
    };
    recognition.onerror = () => {
      toast("Mic error, try again!");
    };

    // Automatically send message when speech recognition ends
    recognition.onend = () => {
      if (input.trim()) {
        sendQuickMessage(input); // Send the message automatically when mic stops
      }
    };
  };

  const sendQuickMessage = async (textParam) => {
    const messageText = textParam ?? input;

    if (!messageText.trim()) {
      toast("Please type a message first!");
      return;
    }

    // User message
    setMessages((prev) => [...prev, { from: "user", text: messageText }]);
    setInput("");

    try {
      const res = await axios.post(`${BASE_URL}/api/chat`, {
        message: messageText,
      });

      const botReply = res.data.reply || "Sorry, I didn't understand that.";

      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      speak(botReply);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Server error. Please try again." },
      ]);
    }
  };

  const startAgain = () => {
    setMessages([]);
    setInput("");
    window.speechSynthesis.cancel();
  };

  return (
    <>
      {/* Floating Button - Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 cursor-pointer"
        aria-label="Open Chatbot"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatbotRef}
          className="fixed bottom-20 right-3 z-50
    w-[92vw] max-w-[380px]
    overflow-hidden rounded-2xl
    bg-white shadow-2xl
    transition-all duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-sm opacity-90">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto bg-gray-50 p-4">
            {messages.length === 0 && (
              <>
                <p className="mb-3 text-sm text-gray-500">
                  Quick questions you can ask 👇
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendQuickMessage(q)}
                      className="rounded-full border border-purple-200 bg-white px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 hover:scale-105 transition cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-4 flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-3 shadow-md ${
                    m.from === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}

            {messages.length > 0 && (
              <div className="flex justify-center my-4">
                <button
                  onClick={startAgain}
                  className="flex items-center gap-2 rounded-full border border-purple-300 bg-white px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 hover:scale-105 transition cursor-pointer shadow-sm"
                >
                  🔄 Start Again
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Controls */}
          <div className="border-t bg-white p-4 w-full overflow-hidden">
            <div className="flex items-center gap-2 w-full min-w-0">
              <button
                onClick={startListening}
                className="shrink-0 rounded-full bg-gray-200 p-3 text-gray-600 transition hover:bg-gray-300 hover:text-purple-600 hover:scale-110"
              >
                <Mic size={20} />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendQuickMessage()}
                placeholder="Type a message..."
                className="flex-1 min-w-0 w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-300"
              />

              <button
                onClick={sendQuickMessage}
                className="shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 text-white transition hover:scale-110"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
