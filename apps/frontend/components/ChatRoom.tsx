"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
// import WebSocket from 'ws';

type Props = {
  roomId: string;
};

const ws = new WebSocket(
  `ws://localhost:8080?token=${localStorage.getItem("accessToken")}`
);
const ChatRoom = (props: Props) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomId: props.roomId,
      });
      console.log(data);
      ws.send(data);
    };
  }, []);

  const handleSendMessage = () => {
      console.log("Triggered")
    
    ws.onopen = ()=>{
        console.log("Inside ws")
        setSocket(ws)
        const data = JSON.stringify({
          type: "chat",
          roomId: props.roomId,
          message,
        });
        ws.send(data);
        console.log("Updated socket:", socket);
        setMessage("");
    }
    
   
  };

  if (!socket) {
    return <div>Connecting to server....</div>;
  }
  return (
    <div className="flex flex-col  gap-4 p-4">
      ChatRoom : {props.roomId}
      {/* Chat bubbles */}
      <div>
        <span className="bg-teal-500 dark:text-white text-black rounded-lg p-2">
          Hello
        </span>
      </div>
      {/* Input box */}
      <div className="fixed bottom-0 flex gap-2 w-full px-4 mb-2">
        <Input
          className="w-full"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <Button onClick={handleSendMessage} >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
