'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomId) {
      router.push(`/room?roomId=${roomId}`);
    }
  };
  return (
    <div>
    <h1>Welcome to the Collaborative Whiteboard</h1>
    <input
      type="text"
      placeholder="Enter Room ID"
      value={roomId}
      onChange={(e) => setRoomId(e.target.value)}
    />
    <button onClick={handleJoinRoom}>Join Room</button>
  </div>
  );
}
