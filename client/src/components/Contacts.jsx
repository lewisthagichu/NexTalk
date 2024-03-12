import Avatar from "./Avatar";

function Contacts({ contactId, username, selected, joinRoom, online }) {
    return (
        <div
            key={contactId}
            onClick={() => joinRoom(contactId)}
            className={`border-b border-gray-100 py-2 pl-4 flex items-center gap-2 cursor-pointer ${selected ? 'bg-blue-50' : ''}`}
        >
            <Avatar userId={contactId} username={username} online={online} />
            <span className="text-gray-800">{username}</span>
        </div>
        )
  }
  

export default Contacts