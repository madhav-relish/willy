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
import { useEffect, useState } from "react";
import {
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  MenuSquareIcon,
  TextSelectIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import bcrypt from 'bcryptjs';

  // function to verify passcode
 export const verifyPasscode = async (inputPasscode: string, roomdId: string) => {
    const storedHash = localStorage.getItem(`chat_passcode_${roomdId}`);
    if (!storedHash) return false;
    
    return await bcrypt.compare(inputPasscode, storedHash);
  };

export const ChatActions = ({
  roomId,
  isChatLocked,
  setIsChatLocked,
}: {
  roomId: string;
  isChatLocked: boolean;
  setIsChatLocked: (val: boolean) => void;
}) => {
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [isEnteringPasscode, setIsEnteringPasscode] = useState(false);
  const [savedPasscode, setSavedPasscode] = useState(
    localStorage.getItem(`chat_passcode_${roomId}`)
  );

  useEffect(() => {
    if (Boolean(savedPasscode)) setIsChatLocked(true);
  }, [roomId]);

  const handleSetOrUpdatePasscode = async () => {
    if (passcode !== confirmPasscode) {
      toast.error("Passcodes didn't match!");
      return;
    }
    
    // Hash the passcode before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPasscode = await bcrypt.hash(passcode, salt);
    
    localStorage.setItem(`chat_passcode_${roomId}`, hashedPasscode);
    setSavedPasscode(hashedPasscode);
    toast.success("Passcode updated successfully!");
    setPasscode("");
    setConfirmPasscode("");
    setIsEnteringPasscode(false);
    setIsChatLocked(true);
  };

  const handleRemovePasscode = () => {
    localStorage.removeItem(`chat_passcode_${roomId}`);
    setSavedPasscode(null);
    toast.success("Passcode removed successfully!");
    setIsChatLocked(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuSquareIcon size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(roomId);
            toast.success("Coppied to clipboard!");
          }}
        >
          {" "}
          RoomId: {roomId}{" "}
        </DropdownMenuItem>
        {Boolean(savedPasscode) && (
          <DropdownMenuItem onClick={() => setIsChatLocked(true)}>
            <span>
              {isChatLocked ? (
                <LockKeyholeOpenIcon size={16} />
              ) : (
                <LockKeyholeIcon size={16} />
              )}
            </span>
            {isChatLocked ? "Unlock" : "Lock"} Chat
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => setIsEnteringPasscode(true)}>
          <span>
            <TextSelectIcon size={16} />
          </span>
          {Boolean(savedPasscode) ? "Change" : "Set"} Passcode
        </DropdownMenuItem>
        {!isChatLocked && Boolean(savedPasscode) && (
          <DropdownMenuItem onClick={handleRemovePasscode}>
            <span>
              <Trash2Icon size={16} />
            </span>{" "}
            Remove Passcode
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
      {/* Passcode Dialog */}
      <Dialog open={isEnteringPasscode}>
        <DialogHeader>
          <DialogContent>
            <DialogTitle>
              {" "}
              {Boolean(savedPasscode) ? "Change" : "Set"} Passcode
            </DialogTitle>
            <div className="flex flex-col gap-4 justify-center items-center">
              <Label className="self-center text-xl font-semibold">
                {" "}
                {Boolean(savedPasscode) ? "Old" : ""} Passcode
              </Label>
              <PasscodePopup value={passcode} setValue={setPasscode} />
              <Label className="self-center text-xl font-semibold">
                {" "}
                {Boolean(savedPasscode) ? "New" : "Confirm"} Passcode
              </Label>
              <PasscodePopup
                value={confirmPasscode}
                setValue={setConfirmPasscode}
              />
            </div>
            <Button
              disabled={!passcode || passcode.length < 6}
              onClick={handleSetOrUpdatePasscode}
            >
              Submit
            </Button>
          </DialogContent>
        </DialogHeader>
      </Dialog>
    </DropdownMenu>
  );
};
