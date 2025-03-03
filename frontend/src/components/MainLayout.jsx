import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import Feed from './Feed'
import Home from './Home'

const MainLayout = () => {
  return (
    <> 
       <LeftSideBar/>
       {/* <Home/> */}
      <div><Outlet/></div>
    </>
  )
}

export default MainLayout