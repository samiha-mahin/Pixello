import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div>
         <LeftSidebar/>
        <div>
             <Outlet/>  
            {/* Outlet is where the nested route's component appears inside a layout like MainLayout.  */}
        </div>
    </div>
  )
}

export default MainLayout