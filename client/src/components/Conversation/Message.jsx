import { useSelector } from 'react-redux';
import { extractTime, extractDate } from '../../utils/extractTime';
import axios from 'axios';

function Message({ message, prevMsg, senderName }) {
  const { user } = useSelector((state) => state.auth);
  const isMine = message.sender === user.id;
  const { text, file } = message;
  const msgTime = extractTime(message.time);
  const currentDay = extractDate(message.time);

  let daySeparator = null;
  if (prevMsg) {
    const prevDay = extractDate(prevMsg.createdAt);
    if (prevDay !== currentDay) {
      // If the previous message was created on a different day, display the current day as a separator
      daySeparator = currentDay;
    }
  } else {
    // For the first message, display the current day as a separator
    daySeparator = currentDay;
  }

  return (
    <>
      <div className="day-separator">{daySeparator}</div>
      <div
        key={message.id}
        className={'message-container ' + (isMine ? 'text-right' : 'text-left')}
      >
        <div>
          <small className="name">{senderName}</small>
          <small className="time">{msgTime}</small>
        </div>
        <div
          className={
            'message ' +
            (isMine ? 'bg-blue-400 text-white' : 'bg-white text-gray-500')
          }
        >
          {text}
          {file && (
            <div className="">
              <a
                target="_blank"
                className="flex items-center gap-1 border-b"
                href={axios.defaults.baseURL + '/uploads/' + file}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                    clipRule="evenodd"
                  />
                </svg>
                {message.file}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Message;
