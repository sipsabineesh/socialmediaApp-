import { useEffect } from "react";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from './redux/RTNSlice'
import ProtectedRoute from "./components/ProtectedRoute";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoute> <MainLayout /></ProtectedRoute>,
    children: [
      { 
        path: "/", // Default route for MainLayout
        element:<ProtectedRoute><Home /></ProtectedRoute> ,
      },
      { 
        path: "/profile/:id", // Dynamic profile route
        element:<ProtectedRoute> <Profile /></ProtectedRoute>,
      },
      { 
        path: "/account/edit", // Edit profile route
        element: <ProtectedRoute><EditProfile /></ProtectedRoute>,
      },
      { 
        path: "/chat", // Chat Page
        element: <ProtectedRoute><ChatPage /></ProtectedRoute>,
      },
    ],
  },
 
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
]);
function App() {
  const dispatch = useDispatch();
  const {user} = useSelector(store => store.auth);
  const {socket} = useSelector(store => store.socketio)
  useEffect(() => {
  if(user){
    const socketio = io('https://socialmediaapp-8vkg.onrender.com',{
      query:{
        userId:user?._id
      },
      transports:['websocket']
    })
    dispatch(setSocket(socketio));

    socketio.on('getOnlineUsers',(onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers))
    })

    socketio.on('notification',(notifications) => {
      dispatch(setLikeNotification(notifications))
    })

    return () => {
      socketio.close();
      dispatch(setSocket(null))
    }
   }
   else if(socket){
    socket.close();
    dispatch(setSocket(null))
   }
  }, [user,dispatch])

//   useEffect(() => {
//     if (user) {
//         // Fetch notifications when the user logs in
//         const fetchNotifications = async () => {
//             try {
//                 const res = await axios.get('https://socialmediaapp-8vkg.onrender.com/api/notification/all', { withCredentials: true });
//                 if (res.data.success) {
//                     dispatch(setLikeNotification(res.data.notifications));
//                 }
//             } catch (error) {
//                 console.error("Error fetching notifications:", error);
//             }
//         };

//         fetchNotifications();

//         // // Listen for real-time notifications
//         // socket.on('notification', (notification) => {
//         //     dispatch(addNotification(notification));
//         // });

//         // return () => {
//         //     socket.off('notification'); // Clean up when component unmounts
//         // };
//     }
// }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
