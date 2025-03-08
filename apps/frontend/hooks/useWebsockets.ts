import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

export interface ChatMessage {
  id: string;
  message?: string;
  gifUrl?: string;
  roomId: string;
  userId: string;
}

export const useWebSocket = (roomId: string, token: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    if (!roomId || !token) return;

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "chat") {
        setChatMessages((prev) => [...prev, data]);
        if (data.userId !== user.userId) {
          showNotification(data.message || "New message", data.gifUrl);
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [roomId, token, user.userId]);

  const sendMessage = (message: string, gifUrl?: string) => {
    if (socket && (message.trim().length > 0 || gifUrl)) {
      socket.send(JSON.stringify({ type: "chat", roomId, message, gifUrl }));
    }
  };

  const showNotification = (message: string, gifUrl?: string) => {
    if (Notification.permission === "granted") {
      new Notification("New Message", {
        body: message,
        icon: gifUrl,
      });
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return { chatMessages, sendMessage, isConnected: !!socket };
};
