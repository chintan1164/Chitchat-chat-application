import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '..';
import { setAuthUser } from '../redux/userSlice';
import { MdEdit } from 'react-icons/md';

const ProfileView = ({ handleBack }) => {
  const { authUser } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [userName, setUserName] = useState(authUser?.userName || "");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [editPassword, setEditPassword] = useState(false);
  const profilePhotoUrl = `data:image/jpeg;base64,${authUser?.profilephoto}`;

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/v1/user/update`, {
        userId: authUser._id,
        fullName,
        userName
      });
      const { message, user } = response.data;
      if (user) {
        dispatch(setAuthUser(user));
        toast.success(message);
      } else {
        toast.error(message);
      }
      setEditPassword(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user information");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/v1/user/changepassword`, {
        userId: authUser._id,
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      const { message } = response.data;
      toast.success(message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setEditPassword(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to change password');
    }
  };

  const handleCancelEdit = () => {
    setFullName(authUser?.fullName || "");
    setUserName(authUser?.userName || "");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setEditPassword(false);
  };

  const handleImageClick = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      console.log(file);
      if (file) {
        const reader = new FileReader();
        console.log(reader);
        reader.readAsDataURL(file);
        console.log(reader);
        reader.onloadend = async () => {
          const base64Image = reader.result.replace(/^data:image\/\w+;base64,/, '');
          console.log(base64Image);
          try {
            const res = await axios.put(
              `${BASE_URL}/api/v1/user/updatephoto/${authUser._id}`,
              { profilePhoto: base64Image }
            );
            const { message, user } = res.data;
            if (user) {
              dispatch(setAuthUser(user));
              toast.success(message);
            } else {
              toast.error(message);
            }
          } catch (error) {
            console.error(error);
            toast.error('Failed to update profile photo');
          }
        };
      }
    };
    input.click();
  };

  return (
    <div className='flex flex-col h-full'>
      <button onClick={handleBack} className='btn w-1/4 rounded-lg bg-myclr hover:bg-myclr2 text-white mb-4'>Back</button>
      <div className='mt-4 relative'>
        <img
          src={profilePhotoUrl}
          alt="profile"
          className="w-60 h-60 rounded-full mx-auto mb-2"
        />
        <button
          onClick={handleImageClick}
          className="absolute top-1/3 left-72 transform -translate-x-1/2 -translate-y-1/2 bg-myclr text-white p-2 w-auto rounded-full shadow-md hover:bg-myclr2 hover:text-black"
        >
          <MdEdit className='w-6 h-6' />
        </button>
        {!editPassword && (
          <>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-bordered rounded-lg my-2"
              placeholder="Enter full name"
            />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input input-bordered rounded-lg my-2"
              placeholder="Enter username"
            />
          </>
        )}
        {!editPassword && (
          <button onClick={() => setEditPassword(true)} className='btn rounded-lg bg-myclr hover:bg-myclr2 text-white my-2'>
            Change Password
          </button>
        )}
        {editPassword && (
          <>
            <div>
              <button onClick={() => setEditPassword(false)} className='btn rounded-lg bg-myclr hover:bg-myclr2 text-white my-2'>
                Change Name
              </button>
            </div>

            <input
              type='password'
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className='input input-bordered rounded-lg my-2'
              placeholder='Current password'
            />
            <input
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className='input input-bordered rounded-lg my-2'
              placeholder='New password'
            />
            <input
              type='password'
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              className='input input-bordered rounded-lg my-2'
              placeholder='Confirm new password'
            />
          </>
        )}
        <div className="flex justify-center mt-4">
          <button onClick={editPassword ? handleChangePassword : handleSaveChanges} className='btn rounded-lg bg-myclr hover:bg-myclr2 text-white mr-2'>Save</button>
          <button onClick={handleCancelEdit} className='btn rounded-lg bg-red-500 hover:bg-red-600 text-white ml-2'>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
