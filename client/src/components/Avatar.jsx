import { useState } from 'react';
import { useChatContext } from '../hooks/useChatContext';
import ProfileModal from './modals/ProfileModal';
import defaultPhoto from '../assets/profile.png';

function Avatar({ contact, profileExists }) {
  const [modal, setModal] = useState(false);
  const [isOnline, setIsOnline] = useState(null);
  const { onlineUsers } = useChatContext();

  let userIdBase10;
  let colorIndex;
  let color;

  const colors = [
    'bg-teal-200',
    'bg-red-200',
    'bg-green-200',
    'bg-purple-200',
    'bg-blue-200',
    'bg-yellow-200',
    'bg-orange-200',
    'bg-pink-200',
    'bg-fuchsia-200',
    'bg-rose-200',
  ];

  if (!profileExists) {
    userIdBase10 = parseInt(contact?._id.substring(10), 16);
    colorIndex = userIdBase10 % colors.length;
    color = colors[colorIndex];
  }

  // useEffect(() => {
  //   const isOnline = onlineUsers.some(
  //     (item) => item._id === contact?._id && item.username === contact.username
  //   );

  //   setIsOnline(isOnline);
  // }, [onlineUsers]);

  // Toggle profile modal
  function toggleModal() {
    setModal(!modal);

    if (modal) {
      document.body.classList.add('active-modal');
    } else {
      document.body.classList.remove('active-modal');
    }
  }

  return (
    <div>
      {profileExists && (
        <div>
          <img
            onClick={toggleModal}
            src={defaultPhoto}
            className="profile-photo"
            alt="Profile Photo"
          />
        </div>
      )}

      {!profileExists && (
        <div
          className={`empty-avatar relative rounded-full flex items-center ${color}`}
          onClick={toggleModal}
        >
          <div className="text-center w-full opacity-70">
            {contact?.username[0].toUpperCase()}
          </div>
          {/* <div
            className={`absolute w-3 h-3 ${
              isOnline ? 'bg-green-400' : 'bg-gray-400'
            } bottom-0 right-0 rounded-full border border-white`}
          ></div> */}
        </div>
      )}

      {modal && <ProfileModal toggleModal={toggleModal} />}
    </div>
  );
}

export default Avatar;
