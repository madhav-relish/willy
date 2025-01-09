'use client'

import React, { useEffect, useRef, useState } from 'react';
import ColorPicker from './ColorPicker';

const Board = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('#000000'); 

    useEffect(() => {


        // Variables to store drawing state
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;


        const startDrawing = (e: { offsetX: number; offsetY: number; }) => {
            isDrawing = true;


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
            }


            [lastX, lastY] = [e.offsetX, e.offsetY];
        };


        // Function to end drawing
        const endDrawing = () => {
            isDrawing = false;
        };


        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx = canvasRef.current?.getContext('2d');


        // Set initial drawing styles
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;


            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';


        }
        // Event listeners for drawing
        if(canvas){

            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', endDrawing);
            canvas.addEventListener('mouseout', endDrawing);
        }


        return () => {
            // Clean up event listeners when component unmounts
            if(canvas){

                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', endDrawing);
                canvas.removeEventListener('mouseout', endDrawing);
            }
        };
    }, []);


    return (
        <>
        <ColorPicker onChange={setColor}/>
        <canvas
            ref={canvasRef}
            width={600}
            height={400}
            // TODO:: Change color to white
            style={{ backgroundColor: 'red' }}
            />
            </>
    );
};


export default Board;
