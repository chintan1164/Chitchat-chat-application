import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '..';
import ProfileView from './ProfileView';
import SearchForm from './SearchForm';
import UserList from './UserList';
import UserActions from './UserActions';
import { setAuthUser, setNewUsers, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';

const SideBar = () => {
  const [search, setSearch] = useState("");
  const { otherUsers, authUser, newUsers } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showPreviousView, setShowPreviousView] = useState(false);
  const [showNewUsers, setShowNewUsers] = useState(false);
  const profilePhotoUrl = `data:image/jpeg;base64,${authUser?.profilephoto}`;

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
      dispatch(setMessages(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
    } catch (error) {
      console.log(error)
    }
  }

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const combinedUsers = [...(otherUsers || []), ...(newUsers || [])];
    const conversationUser = combinedUsers.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
    if (conversationUser) {
      const updatedUsers = combinedUsers.filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
      dispatch(setOtherUsers(updatedUsers));
    } else {
      toast.error("User not found!");
    }
  };

  const fetchNewUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/user/new`);
      const { data } = response;
      dispatch(setNewUsers(data));
      setShowNewUsers(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch new users');
    }
  };

  const changeProfile = () => {
    setShowPreviousView(true);
    setShowProfileInfo(true);
  };

  const handleBack = () => {
    setShowPreviousView(false);
    setShowProfileInfo(false);
  };

  return (
    <div className='w-1/4 min-w-[250px] bg-myblue text-white p-4 flex flex-col overflow-auto'>
      {showPreviousView ? (
        <ProfileView handleBack={handleBack} />
      ) : (
        <>
          <div className='mt-2 flex justify-between items-center'>
            <span onClick={() => window.location.reload()} className="text-4xl font-bold text-white mr-auto tracking-wide cursor-pointer flex items-center" >
              <img src='ChitChat2.png' class='w-14 h-14 mr-1' alt="ChitChat Logo" />
              Chit<span className="text-myclr2 text-3xl">Chat</span>
            </span>
            <img onClick={changeProfile} src={profilePhotoUrl} alt='userprofile' className='w-10 h-10 rounded-full cursor-pointer' ></img>
          </div>
          <SearchForm search={search} setSearch={setSearch} searchSubmitHandler={searchSubmitHandler} />
          <div className="divider my-4 px-3"></div>
          <div className='flex-1 overflow-y-auto'><UserList showNewUsers={showNewUsers} /></div>
          <UserActions
            showNewUsers={showNewUsers}
            setShowNewUsers={setShowNewUsers}
            fetchNewUsers={fetchNewUsers}
            logoutHandler={logoutHandler}
          />
        </>
      )}
    </div>
  );
}

export default SideBar;
