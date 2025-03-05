"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoom, joinRoom } from "@/lib/api";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const router = useRouter()
  
  const handleCreateRoom = async()=>{
    try{
        const data = await createRoom(userInput)
        toast.success('Room created successfully!')
        router.push(`/chat/${data?.room?.id}`)
    }catch(error){
        console.error("Error while creating the room", error)
        toast.error("Error while creating the room")
    }
  }

  const handleJoinRoom = async()=>{
    try{
       const data = await joinRoom(userInput)
        toast.success('Room Joined successfully!')
        router.push(`/chat/${data?.roomId}`)
    }catch(error){
        console.error("Error while creating the room", error)
        toast.error("Error while creating the room")
    }
  }

  return (
    <div>
      <Input
      className="mb-3"
        value={userInput}
        onChange={(e) => {
          console.log("Entered values::", e.target.value);
          setUserInput(e.target.value);
        }}
        placeholder="Enter a room name or Room Id"
      />
      <Button className="mr-2" onClick={handleCreateRoom}>Create Room</Button>
      <Button onClick={handleJoinRoom}>Join Room</Button>
    </div>
  );
};

export default Chat;
