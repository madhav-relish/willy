import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

type Props = {
  isOpen?: boolean;
  title?: string
  value?: string;
  setValue?: (val : string) => void;
};

const PasscodePopup = ({ isOpen,title, value, setValue }: Props) => {
  return (
    <InputOTP maxLength={6} value={value} onChange={setValue}>
              <InputOTPGroup >
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup >
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
  );
};

export default PasscodePopup;
