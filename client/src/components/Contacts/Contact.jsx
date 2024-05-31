import { React, useContext, memo } from 'react';
import Avatar from '../Avatar';
import { ChatContext } from '../../context/ChatContext';
import useFetchLatestMessage from '../../hooks/useFetchLatestMessage';
import { getUnreadNotifications } from '../../utils/getUnreadNotiifications';

const Contact = ({ contact, joinRoom, selected, online }) => {
  const { notifications, setNotifications } = useContext(ChatContext);
  const unreadNotifications = getUnreadNotifications(notifications);
  const contactNotifications = unreadNotifications?.filter(
    (n) => n.sender === contact._id
  );
  // const {latestMessage} = useFetchLatestMessage(contact.id)
  // console.log(`Nots: ${JSON.stringify(contactNotifications)}`);
  return (
    <div
      key={contact._id}
      onClick={() => joinRoom(contact)}
      className={`contact ${selected ? 'selected' : ''}`}
    >
      <div className="contact-left">
        <Avatar
          userId={contact._id}
          username={contact.username}
          online={online}
          profileExists={false}
        />

        <div className="contact-context">
          <p className="text-gray font-semibold text-lg">{contact.username}</p>
          <p className="latest-text"></p>
        </div>
      </div>
      <div className="contact-right">
        <p className="text-time">30/5/2024</p>
        <div
          className={contactNotifications?.length > 0 ? 'notification' : 'hide'}
        >
          <small>
            {contactNotifications?.length > 0 ? contactNotifications.length : 0}
          </small>
        </div>
      </div>
    </div>
  );
};

export default Contact;
