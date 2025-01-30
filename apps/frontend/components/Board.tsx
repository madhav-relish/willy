"use client";

import { BACKEND_URL, SOCKET_URL } from "@/lib/constants";
import React, { useRef, useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

interface MyBoard {
  brushColor: string;
  brushSize: number;
  roomId: string;
}

interface DrawingData {
  lastX: number;
  lastY: number;
  currentX: number;
  currentY: number;
  color: string;
  size: number;
}

const Board: React.FC<MyBoard> = ({ brushColor, brushSize, roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [windowSize, setWindowSize] = useState([0, 0]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    if (roomId) {
      newSocket.emit("joinRoom", roomId);
      console.log(`Joined room: ${roomId}`);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  // Fetch and render existing drawings from the server
  const fetchDrawings = useCallback(async () => {
    const response = await fetch(`${BACKEND_URL}/api/drawings/${roomId}`);
    if (response.ok) {
      const drawings: { data: string }[] = await response.json();
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        drawings.forEach((drawing) => {
          const data: DrawingData = JSON.parse(drawing.data);
          ctx.strokeStyle = data.color;
          ctx.lineWidth = data.size;
          ctx.beginPath();
          ctx.moveTo(data.lastX, data.lastY);
          ctx.lineTo(data.currentX, data.currentY);
          ctx.stroke();
        });
      }
    }
  }, [roomId]);

  useEffect(() => {
    if (socket) {
      // Fetch initial drawings when a user joins a room
      fetchDrawings();

      // Listen for drawing data from the server
      const handleDrawingData = (data: { data: string }) => {
        const parsedData: DrawingData = JSON.parse(data.data);
        const { lastX, lastY, currentX, currentY, color, size } = parsedData;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.strokeStyle = color;
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        }
      };

      socket.on("drawing", handleDrawingData);

      // Cleanup socket listeners when component unmounts
      return () => {
        socket.off("drawing", handleDrawingData);
      };
    }
  }, [socket, fetchDrawings]);

  // Function to start drawing
  useEffect(() => {
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const draw = (e: { offsetX: number; offsetY: number }) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas && canvas.getContext("2d");

      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        const drawingData = {
          roomId,
          data: JSON.stringify({
            lastX,
            lastY,
            currentX: e.offsetX,
            currentY: e.offsetY,
            color: brushColor,
            size: brushSize,
          }),
        };

        // Emit drawing data to the server via WebSocket
        socket?.emit("drawing", drawingData);

        // Save drawing immediately to the backend
        fetch(`${BACKEND_URL}/api/drawings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(drawingData),
        }).catch((error) => console.error("Error saving drawing:", error));
      }

      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const endDrawing = () => {
      isDrawing = false;
    };

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    // Set initial drawing styles
    if (ctx) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    // Event listeners for drawing
    if (canvas) {
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", endDrawing);
      canvas.addEventListener("mouseout", endDrawing);
    }

    return () => {
      // Clean up event listeners when component unmounts
      if (canvas) {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", endDrawing);
        canvas.removeEventListener("mouseout", endDrawing);
      }
    };
  }, [brushColor, brushSize, socket]);

  // Handle window resize
  useEffect(() => {
    const handleWindowResize = () => {
      if (typeof window !== "undefined") {
        setWindowSize([window.innerWidth, window.innerHeight]);
      }
    };

    window.addEventListener("resize", handleWindowResize);
    handleWindowResize(); // Set initial size

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [roomId]);

  return (
    <canvas
      ref={canvasRef}
      width={windowSize[0] > 600 ? windowSize[0] - 50 : 300}
      height={windowSize[1] > 400 ? windowSize[1] - 100 : 200}
      style={{ backgroundColor: "white" }}
    />
  );
};

export default Board;
