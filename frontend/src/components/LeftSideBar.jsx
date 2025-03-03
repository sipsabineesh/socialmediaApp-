// import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import CreatePost from './CreatePost'
// import { toast } from 'sonner'
// import { setAuthUser } from '@/redux/authSlice'
// import { setPosts, setSelectedPost } from '@/redux/postSlice'
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
// import { Button } from './ui/button'
// import { setNotificationsAsRead } from '@/redux/RTNSlice'

// const LeftSideBar = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const {user} = useSelector(store => store.auth);
//   const { likeNotification } = useSelector(store => store.realTimeNotification)
//   const [open,setOpen] = useState(false);
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);
//   const [localNotifications, setLocalNotifications] = useState([...likeNotification]);
//   const [readNotification, setReadNotification] = useState(false); // New state

  
//   useEffect(() => {
//    setLocalNotifications([...likeNotification])
//   }, [likeNotification])
  
//   const logoutHandler = async() => {
//     try {
//         const res = await axios.get('https://socialmediaapp-8vkg.onrender.com/api/user/logout',{
//             withCredentials:true
//         })
//         if(res.data.success){
//           dispatch(setAuthUser(null));
//           dispatch(setSelectedPost(null));
//           dispatch(setPosts([]));
//           navigate('/login');
//           toast.success(res.data.message);
//         }
//     } catch (error) {
//         toast.success(error.response.data.message);
//     }
//   }

  

//   const sidebarHandler = async(textType) => {
//     if(textType === 'Logout'){
//       logoutHandler();
//     }
//     else if(textType === 'Home'){
//       navigate(`/`)
//     }
//     else if(textType === 'Create'){ 
//       setOpen(true)
//     }
//     else if(textType === 'Profile'){
//       navigate(`/profile/${user?._id}`)
//     }
//     else if(textType === 'Messages'){
//       navigate(`/chat`)
//     }
//   }

//   const markNotificationsAsRead = async() => { 
//     const res = await axios.put('https://socialmediaapp-8vkg.onrender.com/api/notification/read',{},{
//       withCredentials:true
//     })
//     console.log("res",res)
//     dispatch(setNotificationsAsRead())
//   }

//   // const handlePopoverOpen = async(openState) => {
//   //   setIsPopoverOpen(openState);
//   //   try {
//   //     if (openState) {
//   //       await markNotificationsAsRead();
//   //       setTimeout(() => {
//   //         dispatch(setLocalNotifications())
//   //       }, 2000);
       
//   //     }
//   //   } catch (error) {
      
//   //   }
    
//   // };
//   const handlePopoverOpen = async (openState) => {
//     if (openState) {
//       setIsPopoverOpen(true); // Open popover immediately
  
//       setTimeout(() => {
//         dispatch(setLocalNotifications()); // Clear local notifications after 2 secs
//         setIsPopoverOpen(false); // Close popover after 2 secs
//       }, 2000);
  
//        // Mark as read AFTER popover opens
//     } else {
//       setIsPopoverOpen(false); // Close popover normally when clicked outside
//     }
//     await markNotificationsAsRead();
//   };
  
  
//   const sidebarItems = [
//     {icon:<Home/>,text:"Home"},
//     {icon:<Search/>,text:"Search"},
//     {icon:<TrendingUp/>,text:"Explore"},
//     {icon:<MessageCircle/>,text:"Messages"},
//     {icon:<Heart/>,text:"Notifications"},
//     {icon:<PlusSquare/>,text:"Create"},
//     {icon:(
//         <Avatar className='w-6 h-6'>
//          <AvatarImage src={user?.profilePicture}/>
//          <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//     ),text:"Profile"
//   },
//     {icon:<LogOut/>,text:"Logout"},
//   ]
//   return (
//     <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
//         <div className='flex flex-col'>
//             <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
//        <div>
//         {sidebarItems.map((item,index) => {
//             return(
//                 <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
//                     {item.icon}
//                     <span>{item.text}</span>
//                     {
//                       item.text === 'Notifications' && localNotifications?.length > 0 && (
//                         <Popover open={isPopoverOpen} onOpenChange={(open) => handlePopoverOpen(open)}>
//                           <PopoverTrigger>
//                             <Button size='icon' className='w-5 h-5 absolute left-6 bottom-6 rounded-full bg-red-600 hover:bg-red-600'>{localNotifications?.length}</Button>
//                           </PopoverTrigger>
//                           <PopoverContent>
//                             <div>
//                               {
//                                 localNotifications.length === 0 ? (<p>No new notifications</p>) :(
//                                   localNotifications.map((notification) => {
//                                     return(
//                                      <div key={notification?.userId} className='flex items-center gap-3 my-2'>
//                                         <Avatar>
//                                           <AvatarImage src={notification?.userDetails?.profilePicture}/>
//                                           <AvatarFallback>CN</AvatarFallback>
//                                         </Avatar>
//                                         <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
//                                      </div>
//                                     )
//                                   }
//                                 )
//                                 )
//                               }
//                             </div>
//                           </PopoverContent>
//                         </Popover>
//                       )

//                     }
//                 </div>
//             )
//         })

//         }
//         </div>
//        </div>
//         <CreatePost open={open} setOpen={setOpen} />
//     </div>
//   )
// }
 
// export default LeftSideBar

import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Menu } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CreatePost from './CreatePost'
import { toast } from 'sonner'
import { setAuthUser } from '@/redux/authSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { setNotificationsAsRead } from '@/redux/RTNSlice'

const LeftSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification)
  const [open, setOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([...likeNotification]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
   setLocalNotifications([...likeNotification])
  }, [likeNotification])

  const logoutHandler = async() => {
    try {
        const res = await axios.get('https://socialmediaapp-8vkg.onrender.com/api/user/logout',{
            withCredentials:true
        })
        if(res.data.success){
          dispatch(setAuthUser(null));
          dispatch(setSelectedPost(null));
          dispatch(setPosts([]));
          navigate('/login');
          toast.success(res.data.message);
        }
    } catch (error) {
        toast.success(error.response.data.message);
    }
  }

  const sidebarHandler = async(textType) => {
    setIsSidebarOpen(false); // Close sidebar on mobile when clicking an item
    if(textType === 'Logout'){
      logoutHandler();
    }
    else if(textType === 'Home'){
      navigate(`/`)
    }
    else if(textType === 'Create'){ 
      setOpen(true)
    }
    else if(textType === 'Profile'){
      navigate(`/profile/${user?._id}`)
    }
    else if(textType === 'Messages'){
      navigate(`/chat`)
    }
  }

  const markNotificationsAsRead = async() => { 
    await axios.put('https://socialmediaapp-8vkg.onrender.com/api/notification/read',{}, {
      withCredentials:true
    })
    dispatch(setNotificationsAsRead())
  }

  const handlePopoverOpen = async (openState) => {
    if (openState) {
      setIsPopoverOpen(true);
      setTimeout(() => {
        dispatch(setLocalNotifications());
        setIsPopoverOpen(false);
      }, 2000);
    } else {
      setIsPopoverOpen(false);
    }
    await markNotificationsAsRead();
  };

  const sidebarItems = [
    {icon:<Home/>,text:"Home"},
    {icon:<Search/>,text:"Search"},
    {icon:<TrendingUp/>,text:"Explore"},
    {icon:<MessageCircle/>,text:"Messages"},
    {icon:<Heart/>,text:"Notifications"},
    {icon:<PlusSquare/>,text:"Create"},
    {icon:(
        <Avatar className='w-6 h-6'>
         <AvatarImage src={user?.profilePicture}/>
         <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),text:"Profile"},
    {icon:<LogOut/>,text:"Logout"},
  ]

  return (
    <>
      <button className='md:hidden p-2 fixed top-4 left-4 z-20 bg-white rounded-full shadow-md' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu size={24} />
      </button>
      <div className={`fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-full md:w-[16%] h-screen bg-white shadow-lg flex flex-col items-center md:items-start transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className='flex flex-col w-full'>
            <h1 className='my-8 pl-3 font-bold text-xl hidden md:block'>LOGO</h1>
            <div className='w-full flex md:flex-col items-center md:items-start'>
                {sidebarItems.map((item,index) => {
                    return(
                        <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 w-full justify-center md:justify-start'>
                            {item.icon}
                            <span className='hidden md:inline'>{item.text}</span>
                            {
                              item.text === 'Notifications' && localNotifications?.length > 0 && (
                                <Popover open={isPopoverOpen} onOpenChange={(open) => handlePopoverOpen(open)}>
                                  <PopoverTrigger>
                                    <Button size='icon' className='w-5 h-5 absolute left-6 bottom-6 rounded-full bg-red-600 hover:bg-red-600'>{localNotifications?.length}</Button>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div>
                                      {
                                        localNotifications.length === 0 ? (<p>No new notifications</p>) :(
                                          localNotifications.map((notification) => {
                                            return(
                                             <div key={notification?.userId} className='flex items-center gap-3 my-2'>
                                                <Avatar>
                                                  <AvatarImage src={notification?.userDetails?.profilePicture}/>
                                                  <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                             </div>
                                            )
                                          }
                                        )
                                        )
                                      }
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )
                            }
                        </div>
                    )
                })}
            </div>
        </div>
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </>
  )
}
 
export default LeftSideBar
