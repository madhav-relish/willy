"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoom } from "@/lib/api";
import axios from "axios";

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

  const joinRoom = async()=>{
    try{
        const response = await axios.post(`http://localhost:3002/join-room`,
       { roomId: userInput},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
       }
        )

        toast.success('Room Joined successfully!')
        router.push(`/chat/${response.data?.roomId}`)
    }catch(error){
        console.error("Error while creating the room", error)
        toast.error("Error while creating the room")
    }
  }

  return (
    <div>
      <Input
        value={userInput}
        onChange={(e) => {
          console.log("Entered values::", e.target.value);
          setUserInput(e.target.value);
        }}
        placeholder="Enter a room name or Room Id"
      />
      <Button onClick={handleCreateRoom}>Create Room</Button>
      <Button onClick={joinRoom}>Join Room</Button>
    </div>
  );
};

export default Chat;
