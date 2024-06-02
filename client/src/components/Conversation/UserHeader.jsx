import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IoSearch, IoCall } from 'react-icons/io5';
import Avatar from '../Avatar';

function UserHeader({ activeUsers, selectedUser }) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      const isOnline = activeUsers.some(
        (item) =>
          item.id === selectedUser._id &&
          item.username === selectedUser.username
      );

      setIsOnline(isOnline);
    }
  }, [selectedUser, activeUsers]);
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
