'use client'
import Board from '@/components/Board';
import Menu from '@/components/Menu'
import Whiteboard from '@/components/Whiteboard';
import React, { useEffect, useState } from 'react'
import {SketchField, Tools} from 'react-sketch';

type Props = {}

const page = (props: Props) => {
  const [brushColor, setBrushColor] = useState('black');
  const [brushSize, setBrushSize] = useState<number>(5);

  useEffect(() => {
    console.log("CanvasDrawing ", brushSize);
  }, [brushSize]);
  return (
    <div >
        <div className='flex justify-center'>

        <Menu/>
        </div>
        <div>Welcome to Room: </div>

        <div className='tools' >
          <div>
            <span>Color: </span>
            <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
          </div>
          <div>
            <span>Size: </span>
            <input type="range" color='#fac176'
              min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
            <span>{brushSize}</span>
          </div>
        </div>

        {/* <Whiteboard/> */}
        <Board brushColor={brushColor} brushSize={brushSize} />
    </div>
  )
}

export default page