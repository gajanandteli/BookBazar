"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socket } from "@/lib/socket";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState<any>(null);

  const params = useParams();
  const receiverId = String(params.userId);

  async function loadProfile() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setUser(data);

    if (data?.id) {
      socket.emit("join", data.id);
    }
  }

  async function loadMessages() {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${receiverId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setMessages(data);
  }

  useEffect(() => {
    loadProfile();
    loadMessages();

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  async function sendMessage() {
    if (!text.trim()) return;

    const token = localStorage.getItem("token");

    const message = {
      receiverId,
      text,
    };

    try {
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      });

      socket.emit("sendMessage", {
        senderId: user?.id,
        receiverId,
        text,
      });

      setMessages((prev) => [
        ...prev,
        {
          senderId: user?.id,
          receiverId,
          text,
        },
      ]);

      setText("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-3xl h-[90vh] bg-white rounded-xl shadow-lg flex flex-col">

        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">BookBazaar Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg: any, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white p-3 rounded-lg w-fit max-w-[70%]"
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-5 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}