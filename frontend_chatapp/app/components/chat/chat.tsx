import { useState, useEffect, useRef } from "react";

interface Message {
  sender: string;
  message: string;
}

const Chat = ({ token, groupId }: { token: string; groupId: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Close the socket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Fetch previous messages
    fetch(`http://localhost:8000/api/chat/groups/${groupId}/messages/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedMessages = data.map((msg: any) => ({
          sender: msg.user,
          message: msg.content,
        }));
        setMessages(formattedMessages);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [token, groupId]);

  useEffect(() => {
    // Ensure groupId and token are valid before attempting to connect
    if (!groupId || isNaN(groupId) || !token) {
      console.error("Invalid groupId or token. WebSocket connection aborted.");
      return;
    }

    const newSocket = new WebSocket(
      `ws://localhost:8000/ws/chat/${groupId}/?token=${token}`
    );
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.typing) {
        setOtherTyping(true);
        setTimeout(() => setOtherTyping(false), 3000);
      } else {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      newSocket.close();
    };
  }, [token, groupId]);

  useEffect(() => {
    // Scroll to the bottom when a new message arrives
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    const data = {
      message,
      groupId,
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }

    setMessage("");
  };

  const handleTyping = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ typing: true }));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-lg mx-auto mt-4">
      <div className="overflow-y-auto h-64 p-4 bg-gray-50 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 animate-fade-in">
            <span className="font-bold text-blue-600">{msg.sender}: </span>
            <span className="text-gray-700">{msg.message}</span>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      {otherTyping && (
        <div className="text-gray-500 animate-pulse">Someone is typing...</div>
      )}
      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleTyping}
          placeholder="Type a message"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-blue-600"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
