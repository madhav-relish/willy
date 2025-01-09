import React, { useRef, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface MyBoard {
    brushColor: string;
    brushSize: number;
    roomId: string;
}

const Board: React.FC<MyBoard> = (props) => {

    const { brushColor, brushSize, roomId } = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        console.log(newSocket, "Connected to socket");
        setSocket(newSocket);
    }, []);

    useEffect(() => {
        if (socket) {
          socket.emit('joinRoom', roomId);
    
          // Event listener for receiving drawing data from the socket
          const handleDrawingData = (data: any) => {
            const { lastX, lastY, currentX, currentY, color, size } = data;
    
            const canvas = canvasRef.current;
            const ctx = canvas && canvas.getContext('2d');
            if (ctx) {
              ctx.strokeStyle = color;
              ctx.lineWidth = size;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
    
              ctx.beginPath();
              ctx.moveTo(lastX, lastY);
              ctx.lineTo(currentX, currentY);
              ctx.stroke();
            }
          };
    
          socket.on('drawing', handleDrawingData);
    
          return () => {
            socket.off('drawing', handleDrawingData);
          };
        }
      }, [socket, roomId]);


    // Function to start drawing
    useEffect(() => {

        // Variables to store drawing state
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        const startDrawing = (e: { offsetX: number; offsetY: number; }) => {
            isDrawing = true;

            console.log(`drawing started`, brushColor, brushSize);
            [lastX, lastY] = [e.offsetX, e.offsetY];
        };

        // Function to draw
        const draw = (e: { offsetX: number; offsetY: number; }) => {
            if (!isDrawing) return;
        
            const canvas = canvasRef.current;
            const ctx = canvas && canvas.getContext('2d');
            if (ctx) {
              ctx.beginPath();
              ctx.moveTo(lastX, lastY);
              ctx.lineTo(e.offsetX, e.offsetY);
              ctx.stroke();
        
              // Emit the drawing data to the server
              if (socket) {
                socket.emit('drawing', {
                  roomId,
                  lastX,
                  lastY,
                  currentX: e.offsetX,
                  currentY: e.offsetY,
                  color: brushColor,
                  size: brushSize,
                });
              }
            }
        
            [lastX, lastY] = [e.offsetX, e.offsetY];
          };

        // Function to end drawing
        const endDrawing = () => {
            const canvas = canvasRef.current;
            const dataURL = canvas && canvas.toDataURL(); // Get the data URL of the canvas content

            // Send the dataURL or image data to the socket
            // console.log('drawing ended')
            if (socket) {
                socket.emit('canvasImage', dataURL);
                console.log('drawing ended')
            }
            isDrawing = false;
        };

        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx = canvasRef.current?.getContext('2d');

        // Set initial drawing styles
        if (ctx) {
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

        }
        // Event listeners for drawing
        if(canvas){
            console.log("Canvas1 Triggered")
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', endDrawing);
            canvas.addEventListener('mouseout', endDrawing);
        }

        return () => {
            // Clean up event listeners when component unmounts
            if(canvas){
                console.log("Canvas2 Triggered::")
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', endDrawing);
                canvas.removeEventListener('mouseout', endDrawing);
            }
        };
    }, [brushColor, brushSize, socket]);


    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    return (
        <canvas
            ref={canvasRef}
            width={windowSize[0] > 600 ? 600 : 300}
            height={windowSize[1] > 400 ? 400 : 200}
            style={{ backgroundColor: 'white' }}
        />
    );
};

export default Board;