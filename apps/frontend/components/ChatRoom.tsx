import React from 'react'

type Props = {
    roomId: string
}

const ChatRoom = (props: Props) => {
  return (
    <div>ChatRoom : {props.roomId}</div>
  )
}

export default ChatRoom