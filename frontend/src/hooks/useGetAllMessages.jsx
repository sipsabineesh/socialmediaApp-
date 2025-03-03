import {useEffect} from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {setMessages} from '@/redux/chatSlice';

const useGetAllMessages = (selectedUser) => {
    const dispatch = useDispatch();
    // const {selectedUser} = useSelector(store => store.auth);
    console.log("selectedUser IN USEGETALLMESSAGE",selectedUser);
    useEffect(() => {
        const fetchAllMessages = async() => {
          try {
                const res= await axios.get(`https://socialmediaapp-8vkg.onrender.com/api/message/all/${selectedUser?._id}`,
                    {
                        withCredentials:true
                    }
                )
                console.log(res)
                if(res.data.success){
                    dispatch(setMessages(res.data.messages))
                }
          } catch (error) {
            
          }
        }
        if (selectedUser?._id) {
            fetchAllMessages();
        }
    },[selectedUser?._id])
}
export default useGetAllMessages;