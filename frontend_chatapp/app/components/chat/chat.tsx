import { useState, useEffect, useRef } from "react";

const Chat = ({ token, groupId }: { token: string; groupId: number }) => {
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Close the socket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Ensure groupId and token are valid before attempting to connect
    console.log("groupId: ", groupId);
    console.log("token: ", token);

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
      setMessages((prevMessages) => [...prevMessages, message]);
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
    <div className="p-4 bg-white rounded shadow">
      <div>
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{msg.sender}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      {typing && <div className="text-gray-500">Someone is typing...</div>}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleTyping}
        placeholder="Type a message"
        className="p-2 mt-2 border border-gray-300 rounded shadow"
      />
      <button
        onClick={sendMessage}
        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
