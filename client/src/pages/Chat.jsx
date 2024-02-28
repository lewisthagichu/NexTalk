import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

function Chat() {
    const {user} = useSelector(state => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/register')
        } 
    }, [])

  return (
    <div>Chat</div>
  )
}

export default Chat