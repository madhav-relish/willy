"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { getAuthToken } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebsockets";
import { useUserStore } from "@/lib/store/useUserStore";
import { MessageCircleCodeIcon } from "lucide-react";

type Props = {
  roomId: string;
};

interface Message {
  id: string;
  message: string;
  userId: string;
}

const ChatRoom = ({ roomId }: Props) => {
  const token = getAuthToken() || "";
  const { chatMessages, sendMessage, isConnected } = useWebSocket(
    roomId,
    token
  );
  const { user } = useUserStore();
  const [inputText, setInputText] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<{ messages: Message[] }>(
          `http://localhost:3002/chats/${roomId}`
        );
        setAllMessages(response.data.messages);
        console.log("Fetched messages:", response.data.messages);
      } catch (error) {
        console.error("Error fetching old messages:", error);
      }
    };
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (chatMessages) {
      console.log(chatMessages);
      setAllMessages((prev) => [...prev, chatMessages]);
    }
  }, [chatMessages]);

  return (
    <div className="flex flex-col h-full gap-4 p-4 pb-0">
      ChatRoom : {roomId}
      {/* Chat Messages */}
      <div className="relative flex flex-col gap-2 w-full mb-10">
        { allMessages.length === 0 
        ? <div className="flex flex-col h-full items-center justify-center text-xl font-semibold"><MessageCircleCodeIcon size={48}/> Start connecting by sending messages</div>
        : allMessages?.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] px-4 py-2 rounded-lg ${
              msg?.userId === user.userId
                ? "bg-purple-600 text-white self-end" // User's messages on the right
                : "bg-red-300 text-black self-start" // Other users' messages on the left
            }`}
          >
            {msg?.message}
          </div>
        ))}
      </div>
      {/* Input Box */}
      <div className="fixed max-w-3/4 bottom-0 flex gap-2 px-4 py-2 dark:bg-black bg-light">
        <Input
          className="w-full"
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
        />
        <Button
          onClick={() => sendMessage(inputText)}
          disabled={inputText.length === 0 || !isConnected}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
