import React from 'react'
import { SidebarTrigger } from './ui/sidebar'

type Props = {}

const Topbar = (props: Props) => {
  return (
    <div className="fixed top-0 bg-background z-50 h-12 w-full p-3 border-b mb-4">
    <SidebarTrigger />
  </div>
  )
}

export default Topbar