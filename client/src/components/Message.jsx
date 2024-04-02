import { useSelector } from "react-redux"
import {extractTime, extractDate} from '../utils/extractTime'

function Message({message, prevMsg, senderName}) {
  const {user} = useSelector(state => state.auth)
  const isMine = message.sender === user.id;
  const msgTime = extractTime(message.createdAt);
  const currentDay = extractDate(message.createdAt)

  let daySeparator = null;
  if (prevMsg) {
    const prevDay = extractDate(prevMsg.createdAt)
    if (prevDay !== currentDay) {
      // If the previous message was created on a different day, display the current day as a separator
      daySeparator = currentDay
    }
  } else {
    // For the first message, display the current day as a separator
    daySeparator = currentDay
  }

  return (
    <>
      <div>{daySeparator}</div>
      <div key={message.id}  className={"message-container " + (isMine ? 'text-right' : 'text-left')} > 
          <div>
            <small className="name">{senderName}</small>   
            <small className="time">{msgTime}</small>     
          </div>
          <div className={"message " + (isMine ? 'bg-blue-400 text-white' : 'bg-white text-gray-500')}>{message.text}</div>  
      </div>
    </>
    
  )
}

export default Message