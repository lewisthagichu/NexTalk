import Avatar from "./Avatar";

function Contacts({ selectedUser, joinRoom, selected, online }) {
    return (
        <div
            key={selectedUser.id}
            onClick={() => joinRoom(selectedUser)}
            className={`contact ${selected ? 'selected' : ''}`}
        >
            <Avatar 
                userId={selectedUser.id} 
                username={selectedUser.username} 
                online={online}
                profileExists={false} />
            <span className="text-gray-800">{selectedUser.username}</span>
        </div>
        )
  }
  

export default Contacts