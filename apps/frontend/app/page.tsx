'use client';
import { BACKEND_URL } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const generateRandomRoomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomId = '';
  for (let i = 0; i < 8; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return roomId;
};

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleJoinRoom = () => {
    setLoading(true)
    if (roomId) {
      router.push(`/room?roomId=${roomId}`);
    }
    setLoading(false)
  };

  const handleCreateRoom = async () => {
    setLoading(true)
    const newRoomId = generateRandomRoomId();
    const response = await fetch(BACKEND_URL+'/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: newRoomId }),
    });
  
    if (response.ok) {
      router.push(`/room?roomId=${newRoomId}`);
    } else {
      console.error('Failed to create room');
    }
    setLoading(false)
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen gap-2'>
      <h1 className='text-3xl font-semibold'>Welcome!</h1>
      <div>
        <input
          type="text"
          required
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className='p-4 border rounded-lg'
          disabled={loading}
        />
        <button disabled={loading} onClick={handleJoinRoom} className='p-4 rounded-lg border hover:bg-black/30 ml-2'>
          Join Room
        </button>
      </div>
      <span className='text-xl font-semibold'>Or</span>
      <button disabled={loading} onClick={handleCreateRoom} className='p-4 w-48 rounded-lg border hover:bg-black/30 ml-2'>
        Create Room
      </button>
    </div>
  );
}