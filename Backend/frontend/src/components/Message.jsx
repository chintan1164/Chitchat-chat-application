import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useDate } from '../hooks/useDate';
import { BASE_URL } from '..';
import axios from 'axios';
import { deleteMessage } from '../redux/messageSlice';
import { MdOutlineDeleteForever } from "react-icons/md";

const Message = ({ message, onImageClick }) => {
  const scroll = useRef();
  const dispatch = useDispatch();
  const { authUser, selectedUser } = useSelector(store => store.user);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleDelete = async (messageId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/v1/message/delete/${messageId}`);

      if (!response.statusText === 'OK') {
        throw new Error('Network response was not ok');
      }
      dispatch(deleteMessage(messageId));
      console.log('Message deleted successfully:', response.data.message);
    } catch (error) {
      console.error('Failed to delete the message:', error);
    }
  };

  const { date, time } = useDate(message?.createdAt);
  const authUserProfilePhotoUrl = `data:image/jpeg;base64,${authUser?.profilephoto}`;
  const selectedUserProfilePhotoUrl = `data:image/jpeg;base64,${selectedUser?.profilephoto}`;

  return (
    <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img alt="dp" src={message?.senderId === authUser?._id ? authUserProfilePhotoUrl : selectedUserProfilePhotoUrl} class="w-10 h-10" />
        </div>
      </div>
      <div className='chat-header' style={{ display: 'flex', alignItems: 'center' }}>
        <time className='text-xs opacity-30 text-white'>{`${date}, ${time} `}</time>
        {isHovered && message?.senderId === authUser?._id && (
          <button onClick={() => handleDelete(message._id)} className="delete-button" style={{ color: 'darkred' }}>
            <MdOutlineDeleteForever />
          </button>
        )}
      </div>

      <div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-myclr3 text-black' : 'bg-myclr2 text-black'} font-medium `} style={{ maxWidth: '500px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
        {message?.message && <span>{message.message}</span>}
        {message?.photo && <img src={`data:image/png;base64,${message.photo}`} alt="Sent Image" className="mt-2 max-w-full h-auto cursor-pointer" onClick={() => onImageClick(`data:image/png;base64,${message.photo}`)} />}
      </div>
    </div>
  )
}

export default Message
