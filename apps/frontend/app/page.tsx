
import RoomsComponent from "@/components/RoomsComponent";
// import Loader from "@/components/Loader";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { getUserDeatils } from "@/lib/api";
// import { BACKEND_URL } from "@/lib/constants";
// import { useUserStore } from "@/lib/store/useUserStore";
// import { generateRandomRoomId } from "@/lib/utils";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export default function Home() {
  // const [roomId, setRoomId] = useState("");
  // const [loadingJoin, setLoadingJoin] = useState(false);
  // const [loadingCreate, setLoadingCreate] = useState(false);
  // const router = useRouter();
 

  // const handleJoinRoom = () => {
  //   setLoadingJoin(true);
  //   if (roomId) {
  //     router.push(`/room?roomId=${roomId}`);
  //   }
  //   setLoadingJoin(false);
  // };

  // const handleCreateRoom = async () => {
  //   setLoadingCreate(true);
  //   const newRoomId = generateRandomRoomId();
  //   const response = await fetch(BACKEND_URL + "/api/rooms", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ roomId: newRoomId }),
  //   });

  //   if (response.ok) {
  //     router.push(`/room?roomId=${newRoomId}`);
  //   } else {
  //     console.error("Failed to create room");
  //   }
  //   setLoadingCreate(false);
  // };

 
  return (
    <>
    <RoomsComponent/>
    </>
    // <div className="flex flex-col justify-center items-center h-screen gap-2">
    //   <h1 className="text-3xl font-semibold">Welcome!</h1>
    //   <div className="flex items-center gap-2">
    //     <input
    //       type="text"
    //       required
    //       placeholder="Enter Room ID"
    //       value={roomId}
    //       onChange={(e) => setRoomId(e.target.value)}
    //       className="p-4 border rounded-lg"
    //       disabled={loadingJoin || loadingCreate}
    //     />
    //     <button
    //       disabled={loadingJoin || loadingCreate}
    //       onClick={handleJoinRoom}
    //       className="p-4 rounded-lg border hover:bg-black/30 ml-2 flex items-center"
    //     >
    //       {loadingJoin ? (
    //         <div className="flex items-center justify-center gap-2">
    //           {" "}
    //           <Loader />
    //           Joining Room...
    //         </div>
    //       ) : (
    //         "Join Room"
    //       )}
    //     </button>
    //   </div>
    //   <span className="text-xl font-semibold">Or</span>
    //   <button
    //     disabled={loadingJoin || loadingCreate}
    //     onClick={handleCreateRoom}
    //     className="p-4 w-48 rounded-lg border hover:bg-black/30 ml-2 text-center"
    //   >
    //     {loadingCreate ? (
    //       <div className="flex items-center justify-center gap-2">
    //         {" "}
    //         <Loader />
    //         Creating Room...
    //       </div>
    //     ) : (
    //       "Create Room"
    //     )}
    //   </button>
    // </div>
  );
}
