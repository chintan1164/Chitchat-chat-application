import React from 'react';

const UserDetailsHeader = ({ selectedUser, handleUserProfile, isOnline }) => {
  return (
    <div className='flex gap-4 items-center bg-myblue text-white px-4 py-2 mb-2'>
      <div className={`avatar ${isOnline ? 'online' : ''}`}>
        <div className='w-14 rounded-full'>
          <img
            src={`data:image/jpeg;base64,${selectedUser?.profilephoto}`}
            onClick={handleUserProfile}
            className='cursor-pointer'
            alt='userprofile'
          />
        </div>
      </div>
      <div className='flex flex-col flex-1'>
        <div className='flex justify-between'>
          <p onClick={handleUserProfile} className='cursor-pointer text-white text-xl font-bold'>
            {selectedUser?.fullName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsHeader;
