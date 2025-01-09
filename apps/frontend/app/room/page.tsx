import Board from '@/components/Board';
import Menu from '@/components/Menu'
import Whiteboard from '@/components/Whiteboard';
import React from 'react'
import {SketchField, Tools} from 'react-sketch';

type Props = {}

const page = (props: Props) => {
  return (
    <div >
        <div className='flex justify-center'>

        <Menu/>
        </div>
        <div>Welcome to Room: </div>

        {/* <Whiteboard/> */}
        <Board/>

    </div>
  )
}

export default page