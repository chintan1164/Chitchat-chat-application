import axios from 'axios';
import React, { useState, useRef } from 'react';
import { IoSend } from 'react-icons/io5';
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messageSlice';

const SendInput = () => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.user);
  const { messages } = useSelector(store => store.message);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (message.trim().length === 0) {
      return;
    }
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/message/send/${selectedUser?._id}`, { message }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      dispatch(setMessages([...messages, res?.data?.newMessage]));
    } catch (error) {
      console.log(error);
    }
    setMessage("");
  };

  const handleFileChange = async (e) => {
    console.log("File input changed");
    const file = e.target.files[0];
    if (!file) return;

    console.log("File selected:", file);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await axios.post(`http://localhost:8000/api/v1/message/send-photo/${selectedUser?._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      dispatch(setMessages([...messages, res?.data?.newMessage]));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhotoClick = () => {
    console.log("Photo button clicked");
    fileInputRef.current.click();
  };

  return (
    <form onSubmit={onSubmitHandler} className='px-4 my-3'>
      <div className='w-full relative'>
        <button type='button' onClick={handlePhotoClick} className='absolute flex inset-y-0 start-0 ml-4 mr-4 items-center text-myclr2 hover:text-myclr3'>
          <MdOutlineAddPhotoAlternate class='w-6 h-6' />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type='text'
          placeholder='Send a message...'
          className='border text-sm pl-12 rounded-lg block w-full p-3 text-white border-myclr bg-myblue focus:outline-none focus:ring-2 focus:ring-myclr2'
        />
        <button type='submit' className='absolute flex inset-y-0 end-0 pr-4 items-center text-myclr2'>
          <IoSend />
        </button>
      </div>
    </form>
  );
};

export default SendInput;
