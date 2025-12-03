import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AIchat() {
  const [isOpen, setIsOpen] = useState(true);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(() => {
  
    const savedMessages = localStorage.getItem("aiChatMessages");
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch {
      
        return [
          { sender: "bot", text: "Hi there! I'm SirajVerse AI, your personal AI assistant." },
        ];
      }
    }
   
    return [
      { sender: "bot", text: "Hi there! I'm SirajVerse AI, your personal AI assistant." },
    ];
  });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const api_url = `${import.meta.env.VITE_API_URL}?key=${import.meta.env.VITE_API_KEY}`;

 
  useEffect(() => {
    localStorage.setItem("aiChatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!text.trim()) {
      toast.warning("Please enter a message", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);

    try {
      const parts = [{ text }];

      const response = await fetch(api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        }),
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.log("Invalid JSON response:", rawText);
        toast.error("Invalid response from server", {
          position: "top-right",
          autoClose: 4000,
        });
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Error: Invalid API response." },
        ]);
        return;
      }

      const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
      setMessages((prev) => [...prev, { sender: "bot", text: aiReply }]);
      
      
      toast.success("Message sent successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't get a response right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearMessages = () => {
  
    setMessages([
      { sender: "bot", text: "Hi there! I'm SirajVerse AI, your personal AI assistant." },
    ]);
  
    localStorage.removeItem("aiChatMessages");
    
    
    toast.success("All messages cleared!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleClearConfirmation = () => {
    toast.info(
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Are you sure you want to clear all messages?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss();
              handleClearMessages();
            }}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Yes, Clear All
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  return (
    <>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      

      <div className="fixed top-[18%] bottom-4 right-4 sm:top-[13%] sm:bottom-auto
                      h-[77vh] max-h-[670px] w-[90vw] max-w-[350px]
                      bg-black border border-black rounded-lg shadow-xl flex flex-col z-50">

    
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900 text-white rounded-t-lg">
          <h3 className="font-semibold text-lg">SirajVerse AI Assistant</h3>
          <div className="flex items-center gap-3">
          
            {messages.length > 1 && (
              <button 
                onClick={handleClearConfirmation}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors"
                title="Clear all messages"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            )}
            
        
            <button 
              onClick={() => {
                setIsOpen(false);
                toast.info("Chat window closed", {
                  position: "top-right",
                  autoClose: 2000,
                });
              }} 
              className="text-white hover:text-gray-300"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

      
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-900 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg break-words ${
                  m.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                }`}
              >
                <p className="text-sm">{m.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Thinking...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-gray-700 bg-gray-900 flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !text.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            title={!text.trim() ? "Enter a message to send" : "Send message"}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
}