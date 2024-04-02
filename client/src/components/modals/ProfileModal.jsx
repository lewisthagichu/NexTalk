import { useState } from "react"
import { MdOutlinePersonOutline, MdOutlineClose, MdOutlineCalendarMonth } from "react-icons/md";
import defaultPhoto from '../../assets/profile.png'
import convertToBase64 from "../../utils/converttobase64"
import '../../css/modal.css'

function ProfileModal({toggleModal}) {
  const [profilePicture, setProfilePicture] = useState("")

  // Handle profile change
  async function handleChange(e) {
    const file = e.target.files[0]
    const base64 = await convertToBase64(file)
    setProfilePicture(base64)
  }

  // Handle prpfile submit
  function handleSubmit(e) {
    e.preventDefault()
    console.log(profilePicture);
    toggleModal()
  }

  return (
    <div onClick={toggleModal} className="modal overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="modal-form">
          <h2>User Info</h2>
          <label htmlFor="file-upload">
            <img 
              src={defaultPhoto} 
              className={"modal-photo"}
              alt="Profile Photo"
              />
          </label>
          <input 
            type="file" 
            name="myProfile" 
            id="file-upload"
            accept='.jpeg, .png, .jpg'
            onChange={(e) => handleChange(e)}
          />

          <div className="info">
            <div className="name">
              <MdOutlinePersonOutline size={25}/>
              <p>Bake</p>
            </div>
            <div className="joined">
              <MdOutlineCalendarMonth size={25}/>
              <p>Joined: 1/5/2023</p>
            </div>
          </div>

          <div className="btns">
            <button onClick={toggleModal} className="btn cancel" type="button">Cancel</button>
            <button className="btn save" type="submit">Save</button>
            <button onClick={toggleModal} className="close-modal" type="button"><MdOutlineClose size={20}/></button>
          </div>
          
        </form>
      </div>
    </div>
  )
}

export default ProfileModal