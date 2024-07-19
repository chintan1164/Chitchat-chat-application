import React from 'react';

const UserProfile = ({ selectedUser, handleUserProfile }) => {
  return (
    <>
      <button onClick={handleUserProfile} className='btn w-fit mt-4 ml-4 bg-myclr hover:bg-myclr2 text-white'>
        Back
      </button>
      <div className='flex flex-col items-center text-white p-4'>
        <img
          src={`data:image/jpeg;base64,${selectedUser?.profilephoto}`}
          alt='userprofile'
          className='w-72 h-72 rounded-full mb-4'
        />
        <h2 className='text-3xl font-bold'>{selectedUser?.fullName}</h2>
        <p className='text-2xl'>{selectedUser?.userName}</p>
      </div>
    </>
  );
};

export default UserProfile;
