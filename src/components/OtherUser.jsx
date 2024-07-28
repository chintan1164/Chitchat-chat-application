import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {

    const dispatch = useDispatch();

    const { selectedUser, onlineUsers } = useSelector(store => store.user);

    const isOnline = onlineUsers?.includes(user._id);

    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
    }

    const userProPic = `data:image/jpeg;base64,${user?.profilephoto}`;

    return (
        <div>
            <div onClick={() => selectedUserHandler(user)} className={` ${selectedUser?._id === user?._id ? 'bg-myclr text-white rounded-md' : 'text-gray-400'} flex gap-2 items-center hover:bg-myclr2 hover:text-black rounded-md p-2 cursor-pointer`}>
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className='w-12 rounded-full'>
                        <img src={userProPic} alt='userprofile' />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2 font-semibold'>
                        <p>{user?.fullName}</p>
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1 opacity-30'></div>
        </div>
    )
}

export default OtherUser
