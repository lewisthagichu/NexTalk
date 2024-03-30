import { useSelector } from "react-redux"
import extractTime from '../utils/extractTime'

function Message({message, senderName}) {
    const {user} = useSelector(state => state.auth)
    const isMine = message.sender === user.id;
    const formattedTime = extractTime(message.createdAt);
  return (
    <div key={message.id}  className={"message-container " + (isMine ? 'text-right' : 'text-left')} > 
        <div>
        <small className="name">{senderName}</small>   
        <small className="time">{formattedTime}</small>     
        </div>
        <div className={"message " + (isMine ? 'bg-blue-400 text-white' : 'bg-white text-gray-500')}>{message.text}</div>  
    </div>
  )
}

export default Message