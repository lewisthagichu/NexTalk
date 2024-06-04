import Avatar from '../Avatar';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatContext } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { MdGroupAdd } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';
import { IoChatboxEllipses } from 'react-icons/io5';
import { reset, logout } from '../../features/auth/authSlice';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { setNotifications, setSelectedUser, setOnlineUsers } =
    useContext(ChatContext);

  const handleLogout = () => {
    setNotifications([]);
    setSelectedUser(null);
    setOnlineUsers([]);

    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };
  return (
    <aside>
      <div className="container">
        <div className="profile">
          <Avatar contact={user} profileExists={false} />
        </div>
        <nav>
          <div className="icons selected">
            <IoChatboxEllipses color="777A7E" size={28} />
          </div>
          <div className="icons">
            <MdGroupAdd color="777A7E" size={28} />
          </div>
        </nav>
      </div>
      <div onClick={handleLogout} className="icons">
        <BiLogOut color="777A7E" size={28} />
      </div>
    </aside>
  );
}

export default Sidebar;
