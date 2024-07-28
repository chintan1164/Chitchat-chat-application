import React from 'react'
import SideBar from './SideBar'
import MessageContainer from './MessageContainer'

const Homepage = () => {
  return (
    <div className='flex h-screen w-screen bg-mybg bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      <SideBar />
      <MessageContainer />
    </div>
  )
}

export default Homepage
