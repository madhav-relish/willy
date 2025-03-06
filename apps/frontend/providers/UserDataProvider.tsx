'use client'
import { getUserDeatils } from '@/lib/api';
import { useUserStore } from '@/lib/store/useUserStore';
import { ReactNode, useEffect } from 'react'

type Props = {}

const UserDataProvider = ({children}:{children: ReactNode} ) => {
    const {setUser} = useUserStore()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserDeatils()
                setUser({email: data?.email, userId: data?.id, username: data?.name, rooms: data?.rooms})
                console.log('USER::', data)
            } catch (error) {
                console.log("Not authenticated");
            }
        };
        fetchUser();
    }, []);
    
  return (
    <>
        {children}
    </>
  )
}

export default UserDataProvider