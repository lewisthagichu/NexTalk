import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

function Chat() {
    const {user, isError, isSuccess, isLoading, message} = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
      if (isError) {
        console.log(message);
      }

      if(!user) {
        navigate('/register')
      }
    }, [isError, user, navigate, message])

  return (
    <div>Chat</div>
  )
}

export default Chat