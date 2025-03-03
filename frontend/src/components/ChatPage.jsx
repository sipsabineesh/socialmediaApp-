import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { useEffect } from 'react';

const ChatPage = () => {
    const [textMessage, setTextMessage] =  useState("")
    const dispatch = useDispatch();
    const {user,suggestedUsers,selectedUser} = useSelector(store => store.auth);
    const {onlineUsers,messages} = useSelector(store => store.chat);

    const sendMessageHandler = async (receiverId) => {
     try {
       const res = await axios.post(`http://localhost:8000/api/message/send/${receiverId}`,{textMessage},{
        headers:{
            'Content-Type':'application/json'
        },
        withCredentials:true
       }
       )
       console.log(res)
       if(res.data.success){
        dispatch(setMessages([...messages,res.data.newMessage]));
        setTextMessage("");
       }
      
     } catch (error) {
    
     }
    }

    useEffect(() => {
        return () => {
           dispatch(setSelectedUser(null));
        }
      }, [])
      
  return (
    <div className='flex ml-[16%] h-screen'>
        <section className='w-full md:w-1/4 my-8'>
            <h1 className='font-bold text-xl mb-4 px-3'>{user?.username}</h1>
            <hr className='mb-4 border-gray-300'/>
            <div className='overflow-y-auto h-[80vh]'>
            {
                suggestedUsers.map((suggestedUser) => {
                    const isOnline = onlineUsers.includes(suggestedUser?._id)
                    return(
                        <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                            <Avatar className='w-14 h-14'>
                                <AvatarImage src={suggestedUser?.profilePicture} alt="profile_pic"/>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='font-medium'>{suggestedUser?.username}</span>
                                <span className={`text-sm font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}> { isOnline ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </section>
        {
            selectedUser? (
            <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                <div className='flex px-3 py-2 border-b border-gray-300 sticky top-0 b-white z-10'>
                     <Avatar>
                      <AvatarImage src={selectedUser?.profilePicture} alt="profile_pic"/>
                      <AvatarFallback>CN</AvatarFallback>
                     </Avatar>
                     <div className='flex flex-col px-3 py-2'>
                        <span>{selectedUser?.username}</span>
                     </div>
                </div>
                <Messages selectedUser={selectedUser}/>
                <div className='flex items-center p-4 border-t-gray-300'>
                    <Input type='text' value={textMessage} onChange={(e) => setTextMessage(e.target.value)} className='flex-1 mr-2 focus-visible:ring-transparent' placeholder='Type Something...'/>
                    <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                </div>
            </section>
            ):(
                <div className='flex flex-col items-center justify-center mx-auto'>
                    <MessageCircle className='w-24 h-24 my-4'/>
                    <h1 className='font-medium text-lg'>Your Messages</h1>
                    <span>Open a conversation</span>
                </div>
         ) 
        }
    </div>
  )
}

export default ChatPage