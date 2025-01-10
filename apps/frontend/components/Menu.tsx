import { LogOutIcon } from 'lucide-react';
import React from 'react'

type Props = {
  brushColor: string;
  setBrushColor: (val: string)=>void
  handleExitRoom: ()=>void
}

const Menu = ({brushColor, setBrushColor, handleExitRoom}: Props) => {

  return (
    <div className='bg-gray-200 rounded-b-lg p-4 w-48 flex items-center gap-2'>
        {/* <button>/</button>   */}
        <div className='p-2 hover:bg-black/30 rounded-lg'>
           
            <input type="color" value={brushColor} className='rounded-xl cursor-pointer w-8' onChange={(e) => setBrushColor(e.target.value)} />
          </div>
          <LogOutIcon  className='hover:cursor-pointer' onClick={handleExitRoom}/>
    </div>
  )
}

export default Menu