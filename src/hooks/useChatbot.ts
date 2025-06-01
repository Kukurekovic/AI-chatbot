import { useState } from "react";
import axios from "axios";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const sendMessage = async (message: string) => {
    await delay(1000);
    const newMessages: Message[] = [
      ...messages,
      { text: message, sender: "user" },
    ];
    setMessages(newMessages);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBg2u0pAx2XxKF-nWshKKyr2N9d6enpAMc`, // Gemini API endpoint
        {
          contents: [
            {
              parts: [{ text: message }], //sending the user's message in the expected format
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = response.data.candidates[0].content.parts[0].text; // Extracts the AI's response from Gemini API response
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Optionally, add an error message to the chat
      setMessages([
        ...newMessages,
        { text: "Error: Could not get a response from Gemini.", sender: "bot" },
      ]);
    }
  };

  return { messages, sendMessage };
};

export default useChatbot;