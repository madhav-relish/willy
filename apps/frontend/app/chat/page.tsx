"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Chat = () => {
  const [roomName, setRoomName] = useState("");
  const router = useRouter()
  const handleCreateRoom = async()=>{
    try{
        const response = await axios.post('http://localhost:3002/create-room',{
            name: roomName
        },
    {
        headers:{
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    })
        toast.success('Room created successfully!')
        router.push(`/chat/${response.data?.room?.id}`)
    }catch(error){
        console.error("Error while creating the room", error)
        toast.error("Error while creating the room")
    }
  }

  const joinRoom = async()=>{
    try{
        const response = await axios.post(`http://localhost:3002/room`)
        toast.success('Room created successfully!')
        router.push(`/chat?${response.data?.room?.id}`)
    }catch(error){
        console.error("Error while creating the room", error)
        toast.error("Error while creating the room")
    }
  }
  return (
    <div>
      <Input
        value={roomName}
        onChange={(e) => {
          console.log("Entered values::", e.target.value);
          setRoomName(e.target.value);
        }}
        placeholder="Enter a room name"
      />
      <Button onClick={handleCreateRoom}>Create Room</Button>
      <Button>Join Room</Button>
    </div>
  );
};

export default Chat;
