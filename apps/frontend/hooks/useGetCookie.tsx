import { getCookie, useGetCookies } from 'cookies-next/client';
import React from 'react'

type Props = {
    cookieName: string
}

const useGetToken = () => {
    const value = useGetCookies();
    console.log("Token::", value)
    return {value}
}

export default useGetToken