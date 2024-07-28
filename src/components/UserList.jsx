import React from 'react';
import OtherUsers from './OtherUsers';
import OtherUser from './OtherUser';
import { useSelector } from "react-redux";

const UserList = ({ showNewUsers }) => {
  const { newUsers } = useSelector(store => store.user);

  return (
    <div className="h-screen">
      {showNewUsers ? newUsers.map((user) => <OtherUser key={user._id} user={user} />) : <OtherUsers />}
    </div>
  );
}

export default UserList;
