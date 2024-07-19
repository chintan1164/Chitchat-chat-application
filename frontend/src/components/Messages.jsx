import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = ({ onImageClick }) => {
  useGetMessages();
  useGetRealTimeMessage();
  const { messages } = useSelector(store => store.message);

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {messages && messages.length > 0 ? (
        <div className='w-full'>
          {messages.map((message) => (
            <Message key={message._id} message={message} onImageClick={onImageClick} />
          ))}
        </div>
      ) : (
        <div className='md:min-w-[1100px] flex flex-col justify-center items-center'>
          <h1 className='text-2xl'>Let's start a new conversation</h1>
        </div>
      )}
    </div>
  );
};

export default Messages;
