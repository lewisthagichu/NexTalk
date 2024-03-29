import EmptyAvatar from "./EmptyAvatar";

function Contacts({ contactId, username, selected, joinRoom, online }) {
    return (
        <div
            key={contactId}
            onClick={() => joinRoom(contactId)}
            className={`contact ${selected ? 'selected' : ''}`}
        >
            <EmptyAvatar userId={contactId} username={username} online={online} />
            <span className="text-gray-800">{username}</span>
        </div>
        )
  }
  

export default Contacts