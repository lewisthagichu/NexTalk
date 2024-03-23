/* eslint-disable no-undef */
import React from 'react'

function Profile() {
  return (
    <div className="border-b border-gray-100 py-2 pl-4">
            <form onSubmit={profileSubmit} className="flex items-center gap-2">
              <label htmlFor="file-upload" className='profile-photo'>
                <img 
                  src={currentProfile || defaultProfile} 
                  className="profile-photo cursor-pointer"
                  alt="Profile Photo"
                  />
              </label>
              <input 
                type="file" 
                label="image"
                name="myProfile" 
                id="file-upload"
                accept='.jpeg, .png, .jpg'
                onChange={(e) => handleProfileChange(e)}
              />
              <button>Submit</button>
            </form>
          </div>
  )
}

export default Profile