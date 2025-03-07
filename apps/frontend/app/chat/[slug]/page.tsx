
import ChatRoom from '@/components/ChatRoom'
import React from 'react'

async function ChatPage({ params }: {
  params: Promise<{
      slug: string
  }>
}) {
  
    const roomId = (await params)?.slug
  
  return (
    <div>
     <ChatRoom roomId={roomId || ""}/>
    </div>
  )
}

export default ChatPage