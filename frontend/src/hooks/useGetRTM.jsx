import {useEffect} from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {setMessages} from '@/redux/chatSlice';

const useGetRTM = () => {
    const dispatch = useDispatch();
    const {socket} = useSelector(store => store.socketio);
    const {messages} = useSelector(store => store.chat);

    useEffect(() => {
     socket.on('newMessage', (newMessage) =>{
        dispatch(setMessages([...messages,newMessage]))
     })
    return() =>{
      socket?.off('newMessage')
    }
        
    },[messages,setMessages])
}
export default useGetRTM;