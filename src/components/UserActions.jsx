import React from 'react';
import { IoMdPersonAdd } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";

const UserActions = ({ showNewUsers, setShowNewUsers, fetchNewUsers, logoutHandler }) => (
  <div className='mt-2 flex justify-between w-full'>
    <button onClick={logoutHandler} className='btn  rounded-lg bg-myclr hover:bg-myclr2 text-myclr3'><RiLogoutBoxLine className='w-5 h-5 outline-none' /></button>
    {showNewUsers ?
      <button onClick={() => setShowNewUsers(false)} className='btn rounded-lg bg-myclr hover:bg-myclr2 text-white'>Friends</button> :
      <button onClick={fetchNewUsers} className='btn rounded-lg bg-myclr hover:bg-myclr2 text-white'><IoMdPersonAdd className='w-5 h-5 outline-none' /></button>
    }
  </div>
);

export default UserActions;
