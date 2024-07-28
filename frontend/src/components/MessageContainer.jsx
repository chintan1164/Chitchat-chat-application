import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SendInput from './SendInput';
import Messages from './Messages';
import UserProfile from './UserProfile';
import UserDetailsHeader from './UserDetailsHeader';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaDownload } from "react-icons/fa";

const MessageContainer = () => {
  const { selectedUser, authUser, onlineUsers } = useSelector((store) => store.user);
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const handleUserProfile = () => {
    setShowUserDetails((prevState) => !prevState);
  };

  const handleImageClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const handleBackClick = () => {
    setFullScreenImage(null);
  };

  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = fullScreenImage;
    link.download = 'image_ChitChat.png';
    link.click();
  };

  return (
    <>
      {selectedUser !== null ? (
        <div className='w-3/4 flex flex-col bg-mybg'>
          {fullScreenImage ? (
            <>
              <div className="flex items-center justify-between mr-3 mb-4 ml-3 mt-3">
                <button onClick={handleBackClick} className="btn bg-myblue hover:bg-myclr w-fit"><IoMdArrowRoundBack className='w-5 h-5 ' /></button>
                <button onClick={handleDownloadClick} className="btn bg-myblue hover:bg-myclr w-fit"><FaDownload className='w-5 h-5 ' /></button>
              </div>
              <div className="flex flex-col items-center justify-center h-full overflow-auto mb-5">
                <img src={fullScreenImage} alt="Full Screen" className="max-w-full max-h-full" />
              </div>
            </>
          ) : showUserDetails ? (
            <UserProfile selectedUser={selectedUser} handleUserProfile={handleUserProfile} />
          ) : (
            <>
              <UserDetailsHeader
                selectedUser={selectedUser}
                handleUserProfile={handleUserProfile}
                isOnline={isOnline}
              />
              <Messages onImageClick={handleImageClick} />
              <SendInput />
            </>
          )}
        </div>
      ) : (
        <div className='md:min-w-[1100px] flex flex-col justify-center items-center'>
          <h1 className='text-4xl text-white font-bold'>Hello, {authUser?.fullName}</h1>
          <h1 className='text-2xl text-white'>Let's start a conversation</h1>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
