import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AtSign, Heart, MessageCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { setAuthUser, setUserProfile } from '@/redux/authSlice'

const Profile = () => {

    const params = useParams();
    const userId = params.id;
    const dispatch = useDispatch();
    useGetUserProfile(userId);
    const [activeTab,setActiveTab] = useState('posts');
    const {userProfile,user} = useSelector(store => store.auth);
    const isLoggedInUserProfile = user?._id === userProfile?._id;
    const isFollowing = userProfile?.followers.includes(user._id) 
    
    const handleTabChange = (tab) => { 
      setActiveTab(tab);
    }

    const followOrUnfollowHandler = async() => {
      try {
         const res = await axios.post(`http://localhost:8000/api/user/${userId}/followorunfollow`,{},{withCredentials: true});
         if(res.data.success){
           toast.success(res.data.message);
           const updatedData = {
                          ...userProfile,
                          followers: res.data.user?.followers,
                          following : res.data.user?.following,
                      };
          dispatch(setUserProfile(updatedData));

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

    const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;
    return (
      
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
             <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {
                    isLoggedInUserProfile ? ( 
                        <>
                        <Link to='/account/edit'><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit Profile</Button>   </Link>
                        <Button variant='secondary' className='hover:bg-gray-200 h-8'>View Archive</Button>   
                        <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>   
                     </>
                    ):( 
                     <> {isFollowing ? (
                        <>
                            <Button onClick={followOrUnfollowHandler}  variant='secondary' className='h-8'>Unfollow</Button>  
                            <Button variant='secondary'>Message</Button>  
                        </> 
                     ) : (
                        <Button onClick={followOrUnfollowHandler} className='bg-[#0095F6] hover:bg-[#1888d2db] h-8'>Follow</Button>   
                     )}
                     </>
                    )
                }
               
              </div>
         
            <div className='flex items-center gap-4'>
              <p><span className='font-semibold'> {userProfile?.posts.length}</span> Posts</p>
              <p><span className='font-semibold'>{userProfile?.followers.length}</span> Followers</p> 
              <p><span className='font-semibold'>{userProfile?.following.length}</span> Following</p>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-semibold'> {userProfile?.bio || 'Bio Here...'}</span> 
              <Badge className='w-fit' variant='secondary'><AtSign/><span className='pl-1'>{userProfile?.username}</span></Badge>
              <span>Peaceful</span>
              <span>Helpful</span>
              <span>Mindful</span>
            </div>
            </div>
          </section>
         </div>
        <div className='border-t border-t-gray-200'> 
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>SAVED</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold' : ''}`} onClick={() => handleTabChange('reels')}>REELS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold' : ''}`} onClick={() => handleTabChange('tags')}>TAGS</span>
        </div>
        <div className='grid grid-cols-3 gap-1'>
          {
            displayedPost?.map((post) => {
              return (
                <div key={post?._id} className='relative group cursor-pointer'>
                  <img src={post.image} className='rounded-sm my-2 w-full aspect-square object-cover'/>
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex items-center text-white space-x-4'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart/>
                        <span className=''>{post?.likes.length}</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle/>
                        <span className=''>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
            )
            })
          }
        </div>
        </div>
        </div>
    </div>
    )
}

export default Profile