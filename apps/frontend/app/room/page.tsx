"use client";

/* eslint-disable */
import Board from "@/components/Board";
import Menu from "@/components/Menu";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const page = (props: Props) => {
  const params = useSearchParams();
  const roomId = params.get("roomId");
  const router = useRouter();

  console.log("Room ID:", roomId);
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState<number>(5);

  useEffect(() => {
    console.log("CanvasDrawing ", brushSize);
  }, [brushSize]);

  const handleExitRoom = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="flex justify-center">
        <Menu handleExitRoom={handleExitRoom} brushColor={brushColor} setBrushColor={setBrushColor} />
      </div>
      <div className="w-full flex gap-4">
      <div className="p-2">
        <div>Welcome to Room: {roomId}</div>
        <div>
          <div>
            <span>Size: </span>
            <input
              type="range"
              color="#fac176"
              min="1"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
            <span>{brushSize}</span>
          </div>
        </div>
      </div>
      </div>

      {/* <Whiteboard/> */}
      <Board
        brushColor={brushColor}
        brushSize={brushSize}
        roomId={roomId?.toString() ?? ""}
      />
    </div>
  );
};

export default page;
