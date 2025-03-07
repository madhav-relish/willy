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
import { MenuSquareIcon } from "lucide-react";
import { Button } from "./ui/button";
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

  useEffect(() => {
    const savedPasscode = localStorage.getItem(`chat_passcode_${roomId}`);
    if (savedPasscode) setIsChatLocked(true);
  }, [roomId]);

  const handleSetOrUpdatePasscode = () => {
    if (passcode !== confirmPasscode) {
      toast.error("Passcodes didn't match!");
      return;
    }
    localStorage.setItem(`chat_passcode_${roomId}`, passcode);
    toast.success("Passcode updated successfully!");
    setPasscode("");
    setConfirmPasscode("");
    setIsEnteringPasscode(false);
    setIsChatLocked(true);
  };

  const handleRemovePasscode = () => {
    localStorage.removeItem(`chat_passcode_${roomId}`);
    toast.success("Passcode removed successfully!");
    setIsChatLocked(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuSquareIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>RoomId: {roomId} </DropdownMenuItem>
        {localStorage.getItem(`chat_passcode_${roomId}`) && (
          <DropdownMenuItem onClick={() => setIsChatLocked(true)}>
            Lock Chat
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => setIsEnteringPasscode(true)}>
          Set/Update Passcode
        </DropdownMenuItem>
        {!isChatLocked && localStorage.getItem(`chat_passcode_${roomId}`) && (
          <DropdownMenuItem onClick={handleRemovePasscode}>
            Remove Passcode
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
      {/* Passcode Dialog */}
      <Dialog open={isEnteringPasscode}>
        <DialogHeader>
          {/* <DialogTitle>Set/Update Passcode</DialogTitle> */}
          <DialogContent>
            <Label>Passcode</Label>
            <PasscodePopup value={passcode} setValue={setPasscode} />
            <Label>Confirm Passcode</Label>
            <PasscodePopup
              value={confirmPasscode}
              setValue={setConfirmPasscode}
            />
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
