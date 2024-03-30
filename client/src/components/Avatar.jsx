import { useState } from "react"
import ProfileModal from './modals/ProfileModal';
import defaultPhoto from '../assets/profile.png';

function Avatar({ userId, username, online, profileExists }) {
  const [modal, setModal] = useState(false)
  let userIdBase10;
  let colorIndex;
  let color;

  const colors = ['bg-teal-200', 'bg-red-200',
                    'bg-green-200', 'bg-purple-200',
                    'bg-blue-200', 'bg-yellow-200',
                    'bg-orange-200', 'bg-pink-200', 'bg-fuchsia-200', 'bg-rose-200'];

  if (!profileExists) {
    userIdBase10 = parseInt(userId.substring(10), 16);
    colorIndex = userIdBase10 % colors.length;
    color = colors[colorIndex];
  }
  
  // Toggle profile modal
  function toggleModal() {
    setModal(!modal)

    if(modal) {
      document.body.classList.add('active-modal')
    } else {
      document.body.classList.remove('active-modal')
    }
  }

  return (
    <>
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
        <div className="text-center w-full opacity-70">{username[0]}</div>
        <div className={`absolute w-3 h-3 ${online ? 'bg-green-400' : 'bg-gray-400'} bottom-0 right-0 rounded-full border border-white`}></div>
      </div>
      )} 

      {modal && <ProfileModal toggleModal={toggleModal} />}
    </>
  );
}

export default Avatar;
