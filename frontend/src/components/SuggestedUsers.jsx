import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser, setSuggestedUsers } from '@/redux/authSlice';

const SuggestedUsers = () =>{
  const dispatch =  useDispatch();
  const {user,suggestedUsers} = useSelector((store) => store.auth) || [];
  const followOrUnfollowHandler = async(userId) => {
    try {
       const res = await axios.post(`https://socialmediaapp-8vkg.onrender.com/api/user/${userId}/followorunfollow`,{},{withCredentials: true});
       if(res.data.success){
         toast.success(res.data.message);
         const updatedUsers = suggestedUsers.map((suggestUser) =>
          suggestUser._id === userId
            ? { ...suggestUser, followers: res.data.user?.followers }
            : suggestUser
        );
        dispatch(setSuggestedUsers(updatedUsers));
        const updatedFollowerData = {
                    ...user,
                    followers: res.data.followerUser?.followers,
                    following : res.data.followerUser?.following,
                  };
        dispatch(setAuthUser(updatedFollowerData));
      }
    } catch (error) {
      console.log(error)
    }
    
  }

  return (
    <div className='my-5'> 
     <div className='flex items-center gap-2'>
        <h1 className='text-gray-600 text-semibold' >Suggestions for you</h1>
        <span className='text-medium cursor-pointer'>See All </span>
      </div> 
      {
        suggestedUsers.map((suggestUser) => {
          const isFollowing = suggestUser.followers.includes(user._id);
          return (
               <div className='flex items-center justify-between my-5' key={suggestUser._id}>
                    <div className='flex items-center gap-2'>
                     <Link to={`/profile/${suggestUser?._id}`}>
                          <Avatar className='w-6 h-6'>
                              <AvatarImage src={suggestUser?.profilePicture} alt="profile_pic"/>
                              <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div>
                            <h1 className='font-semibold text-sm'>{suggestUser?.username}</h1>
                            <span className='text-gray-600 text-sm'>{suggestUser?.bio || "Bio here..."}</span>
                          </div> 
                          </Link>
                        </div>
                        <span onClick={() => followOrUnfollowHandler(suggestUser?._id)} className='font-bold cursor-pointer text-xs text-[#3BADF8] hover:text-[#3495e3]'>
                          { isFollowing ? 'Unfollow' : 'Follow' }
                        </span>
               <div>
              </div>
            </div>
          )
        
        })
      }
    </div>
  )
}

export default SuggestedUsers