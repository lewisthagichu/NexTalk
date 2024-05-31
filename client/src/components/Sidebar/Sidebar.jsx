import Avatar from '../Avatar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdGroupAdd } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';
import { IoChatboxEllipses } from 'react-icons/io5';
import { reset, logout } from '../../features/auth/authSlice';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };
  return (
    <aside>
      <div className="container">
        <div className="profile">
          <Avatar profileExists={true} />
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
