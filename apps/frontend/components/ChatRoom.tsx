"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { getAuthToken } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebsockets";
import { useUserStore } from "@/store/useUserStore";
import { MenuSquareIcon, MessageCircleCodeIcon } from "lucide-react";
import { useTopbar } from "@/store/useTopbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import PasscodePopup from "./PasscodePopup";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { ChatActions } from "./ChatActions";

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
  const { setTitle, setComponent } = useTopbar();
  const [inputText, setInputText] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isChatLocked, setIsChatLocked] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<{ messages: Message[] }>(
          `http://localhost:3002/chats/${roomId}`
        );
        setAllMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching old messages:", error);
      }
    };
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const roomName = user.rooms.find((item) => item.id == roomId);
    setTitle(roomName?.slug || "");
    setComponent(
      <ChatActions
        roomId={roomId}
        setIsChatLocked={setIsChatLocked}
        isChatLocked={isChatLocked}
      />
    );
    if (chatMessages) {
      setAllMessages((prev) => [...prev, chatMessages]);
    }
  }, [chatMessages, user]);

  const handleUnlockChat = () => {
    const savedPasscode = localStorage.getItem(`chat_passcode_${roomId}`);
    if (savedPasscode === passcode) {
      setPasscode("");
      setIsChatLocked(false);
      toast.success("Chat Unlocked!");
    } else {
      toast.error("Incorrect Passcode!");
    }
  };

  return (
    <div className={`flex flex-col h-full gap-4 p-4 pb-0 `}>
      {/* Chat Messages */}
      {isChatLocked ? (
        <Dialog open={isChatLocked}>
          <DialogContent>
            <DialogHeader>Enter Passcode</DialogHeader>
            <PasscodePopup
              isOpen={isChatLocked}
              value={passcode}
              setValue={(val) => setPasscode(val)}
            />
            <Button onClick={handleUnlockChat}>Unlock</Button>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="relative flex flex-col gap-2 w-full mb-10">
          {allMessages.length === 0 ? (
            <div className="flex flex-col gap-4 h-full items-center justify-center text-xl font-semibold">
              <MessageCircleCodeIcon size={48} /> Start connecting by sending
              messages
            </div>
          ) : (
            allMessages?.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-4 py-2 rounded-lg ${
                  msg?.userId === user.userId
                    ? "bg-purple-600 text-white self-end"
                    : "bg-red-300 text-black self-start"
                }`}
              >
                {msg?.message}
              </div>
            ))
          )}
        </div>
      )}
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
