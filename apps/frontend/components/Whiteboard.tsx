"use client";

import React, { useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [color, setColor] = useState("#000000"); // Default color

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setLastPosition({ x: offsetX, y: offsetY });
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosition) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;

    const { offsetX, offsetY } = event.nativeEvent;

    context.strokeStyle = color;
    context.lineWidth = 2; // Set line width
    context.beginPath();
    context.moveTo(lastPosition.x, lastPosition.y);
    context.lineTo(offsetX, offsetY);
    context.stroke();
    context.closePath();

    setLastPosition({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.lineCap = "round"; // Set line cap style
    }
  }, []);

  return (
    <div>
      <ColorPicker onChange={setColor} />
      <canvas
        ref={canvasRef}
        className="w-full h-full border"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
