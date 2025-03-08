"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { getAuthToken } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebsockets";
import { useUserStore } from "@/store/useUserStore";
import {
  LockKeyholeIcon,
  MenuSquareIcon,
  MessageCircleCodeIcon,
  SendHorizonalIcon,
  StickerIcon,
} from "lucide-react";
import { useTopbar } from "@/store/useTopbar";
import PasscodePopup from "./PasscodePopup";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ChatActions, verifyPasscode } from "./ChatActions";
import { Label } from "./ui/label";
import GifSelector from "./GifSelector";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Image from "next/image";
import { Gif } from "@giphy/react-components";

type Props = {
  roomId: string;
};

interface Message {
  id: string;
  message: string;
  userId: string;
  gifUrl?: string;
  roomId: string;
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
  const [isSelectingGif, setIsSelectingGif] = useState(false);

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
    const roomName = user?.rooms?.find((item) => item.id == roomId);
    setTitle(roomName?.slug || "");
    setComponent(
      <ChatActions
        roomId={roomId}
        setIsChatLocked={setIsChatLocked}
        isChatLocked={isChatLocked}
      />
    );
    if (chatMessages.length > 0) {
      setAllMessages((prev) => [
        ...prev,
        ...chatMessages.filter((msg): msg is Message => msg.message !== undefined && msg.message !== null) as Message[],
      ]);
    }
  }, [chatMessages, user, isChatLocked]);

  const handleUnlockChat = async() => {
    const isValid = await verifyPasscode(passcode, roomId);
    if (isValid) {
      setPasscode("");
      setIsChatLocked(false);
      toast.success("Chat Unlocked!");
    } else {
      toast.error("Incorrect Passcode!");
    }
  };

  return (
    <div className={`flex flex-col h-full gap-4 p-4 pb-0 `}>
      <div className="relative flex flex-col gap-2 w-full mb-10 mt-10">
        {/* Empty Chat */}
        {allMessages.length === 0 ? (
          <div className="flex flex-col gap-4 h-full items-center justify-center text-xl font-semibold">
            <MessageCircleCodeIcon size={48} /> Start connecting by sending
            messages
          </div>
        ) : isChatLocked ? (
          <div className="rounded-lg border p-4 flex flex-col gap-3 justify-center">
            <div className="flex flex-col items-center justify-center gap-3 h-48">
              <LockKeyholeIcon size={48} />
              <div>This Chat is Locked!</div>
            </div>
            <Label className="self-center text-xl font-semibold">
              Enter Passcode
            </Label>
            <div className="w-full flex justify-center">
              <PasscodePopup
                isOpen={isChatLocked}
                value={passcode}
                setValue={(val) => setPasscode(val)}
              />
            </div>
            <Button onClick={handleUnlockChat}>Unlock</Button>
            {/* Chat Messages */}
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
              {msg?.message && <div>{msg.message}</div>}
              {msg?.gifUrl &&
                (console.log("GIF", msg.gifUrl),
                (
                  <img
                    // width={200}
                    // height={200}
                    src={msg.gifUrl}
                    alt="GIF"
                    className="rounded-md h-52 w-52"
                    // loading="lazy"
                  />
                ))}
            </div>
          ))
        )}
      </div>
      <Popover open={isSelectingGif} onOpenChange={(isOpen) => setIsSelectingGif(isOpen)}>
        <div className="fixed max-w-3/4 bottom-0 flex gap-2 px-4 py-2 dark:bg-black bg-light">
          <Input
            className="w-full"
            onChange={(e) => setInputText(e.target.value)}
            value={inputText}
          />
          <Button
          className="rounded-full w-10 h-10 "
            onClick={() => {sendMessage(inputText)
              setInputText("")
            }}
            disabled={inputText.length === 0 || !isConnected || isChatLocked}
          >
            <SendHorizonalIcon size={44} color="blue" fontSize={20}/>
          </Button>
          <div className="">
            <PopoverTrigger >
              <div className="bg-background border-4 overflow-hidden rounded-full w-10 h-10 flex items-center justify-center">
                <StickerIcon size={34} color="teal" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <GifSelector
                onSelect={(gifId) => {
                  console.log("URL", gifId);
                  sendMessage("", gifId);
                  setIsSelectingGif(false);
                }}
              />
            </PopoverContent>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default ChatRoom;
