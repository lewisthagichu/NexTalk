import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../../hooks/useChatContext';
import { MdGroupAdd } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';
import { IoChatboxEllipses } from 'react-icons/io5';
import { reset, logout } from '../../features/auth/authSlice';
import Avatar from '../Avatar';
import getSocket from '../../utils/socket';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { setSelectedUser, setOnlineUsers } = useChatContext();

  const handleLogout = () => {
    const socket = getSocket(user.token);
    socket.disconnect();

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
