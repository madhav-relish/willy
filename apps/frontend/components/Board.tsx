import { BACKEND_URL } from '@/lib/constants';
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

useEffect(()=>{
  const newSocket = io('http://localhost:5001');
  console.log(newSocket, "Connected to socket");
  setSocket(newSocket);
  return () => {newSocket.disconnect()}
},[])


    useEffect(() => {
        if (socket) {
          socket.emit('joinRoom', roomId);
    
          const fetchDrawings = async () => {
              const response = await fetch(BACKEND_URL+`/api/drawings/${roomId}`);
              if (response.ok) {
                  const drawings = await response.json();
                  const ctx = canvasRef.current?.getContext('2d');
                  if (ctx) {
                      drawings.forEach((drawing: any) => {
                          const data = JSON.parse(drawing.data);
                          ctx.strokeStyle = data.color;
                          ctx.lineWidth = data.size;
                          ctx.beginPath();
                          ctx.moveTo(data.lastX, data.lastY);
                          ctx.lineTo(data.currentX, data.currentY);
                          ctx.stroke();
                      });
                  }
              }
          };

          fetchDrawings();

          const handleDrawingData = (data: any) => {
              const { lastX, lastY, currentX, currentY, color, size } = data;
              const canvas = canvasRef.current;
              const ctx = canvas && canvas.getContext('2d');
              if (ctx) {
                  ctx.strokeStyle = color;
                  ctx.lineWidth = size;
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
                socket.emit('drawing', drawingData);
                // Save drawing data to the backend
               fetch(BACKEND_URL+'/api/drawings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(drawingData),
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