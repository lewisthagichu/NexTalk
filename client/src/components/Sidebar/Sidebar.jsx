import styles from './sidebar.module.scss';
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
    <aside className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.profile}>
          <Avatar contact={user} profileExists={false} />
        </div>

        <div className={styles.nav}>
          <div className={`${styles.icon} ${styles.selected}`}>
            <IoChatboxEllipses />
          </div>
          <div className={styles.icon}>
            <MdGroupAdd />
          </div>
        </div>
      </div>
      <div onClick={handleLogout} className={styles.icon}>
        <BiLogOut />
      </div>
    </aside>
  );
}

export default Sidebar;
