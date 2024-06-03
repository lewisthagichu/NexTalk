import { useEffect, useState } from 'react';
import { IoSearch, IoCall } from 'react-icons/io5';
import Avatar from '../Avatar';

function UserHeader({ onlineUsers, selectedUser }) {
  const [isOnline, setIsOnline] = useState(null);
  console.log(onlineUsers);

  useEffect(() => {
    const isOnline = onlineUsers.some(
      (item) =>
        item._id === selectedUser._id && item.username === selectedUser.username
    );

    setIsOnline(isOnline);
  }, [selectedUser, onlineUsers]);
  const handleSubmit = (event) => {};
  return (
    <div className="user-details">
      <div className="profile">
        <Avatar profileExists={true} />
        <div className="name">
          <small className="username">{selectedUser.username}</small>
          <small>{isOnline ? 'Online' : 'Offline'}</small>
        </div>
      </div>

      <form className="search-bar chat active" onSubmit={handleSubmit}>
        <input type="text" placeholder="Search..." />
      </form>

      <div className="calls">
        <div className="icons">
          <IoSearch color="#7d8da1" size={22} />
        </div>
        <div className="icons">
          <IoCall color="#7d8da1" size={20} />
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
