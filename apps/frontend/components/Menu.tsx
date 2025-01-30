import { LogOutIcon } from "lucide-react";
import React from "react";

type Props = {
  brushColor: string;
  setBrushColor: (val: string) => void;
  handleExitRoom: () => void;
};

const Menu = ({ brushColor, setBrushColor, handleExitRoom }: Props) => {
  return (
    <div className="bg-gray-200 rounded-b-lg p-4 w-48 flex items-center gap-2">
      {/* <button>/</button>   */}

      <input
        type="color"
        value={brushColor}
        className="rounded-full cursor-pointer w-8 h-8 hover:opacity-55"
        onChange={(e) => setBrushColor(e.target.value)}
      />

      <LogOutIcon className="hover:cursor-pointer" onClick={handleExitRoom} />
    </div>
  );
};

export default Menu;
