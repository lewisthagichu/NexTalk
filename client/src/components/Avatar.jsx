import ProfileModal from './ProfileModal';
import defaultPhoto from '../assets/profile.png';

function Avatar({ modal, toggleModal, isMine }) {
  return (
    <>
      <img 
        onClick={toggleModal}
        src={defaultPhoto} 
        className="profile-photo"
        alt="Profile Photo"
      />
      {modal && <ProfileModal toggleModal={toggleModal} />}
    </>
  );
}

export default Avatar;
