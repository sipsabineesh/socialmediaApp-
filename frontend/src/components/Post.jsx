import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent } from './ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import { setAuthUser, setSuggestedUsers, setUserProfile } from '@/redux/authSlice';

const Post = ({post}) => {
    const {user,suggestedUsers} = useSelector(store => store.auth)
    const {posts} = useSelector(store => store.post)
    const dispatch = useDispatch();
    const [text,setText] = useState("");
    const [open,setOpen] = useState(false);
    const [liked,setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLiked,setPostLiked] = useState(post.likes.length);
    const [comment,setComment] = useState(post.comments);
    // console.log("post:  ",post)
    // console.log("User ",user)
    const isFollowing = user.following.includes(post?.author?._id)
   
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }
        else {
            setText("");
        }
    }
    
    const likeDislikeHandler = async(postId) => { 
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://socialmediaapp-8vkg.onrender.com/api/post/${postId}/${action}`,{withCredentials:true})
            if(res.data.success){
                const updatedLikes = liked ? postLiked - 1 : postLiked + 1;
                dispatch(setPosts())
                setPostLiked(updatedLikes)
                setLiked(!liked);
                const updatedPostData = posts.map(p =>
                   p._id === post._id ? {
                   ...p,
                   likes : liked ? p.likes.filter(id => id !== user._id) : [...p.likes,user._id] 
                    } :p
            );
            dispatch(setPosts(updatedPostData))
                toast.success(res.data.message);
            }
        } catch (error) {
            
        }
    }

    const commentHandller = async () => {
        try {
            const res = await axios.post(`https://socialmediaapp-8vkg.onrender.com/api/post/${post._id}/comment`,{text},{
                headers:{
                    'Content-Type':'application/json'
                },           
                withCredentials:true
            })
            if(res.data.success){
                const updatedCommentData = [...comment,res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map(p => p._id === post._id ? {
                    ...p,
                    comments:updatedCommentData
                } : p );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const bookmarkHandler = async() => {
     try {
        const res =  await axios.get(`https://socialmediaapp-8vkg.onrender.com/api/post/${post._id}/bookmark`,{withCredentials:true})
        if(res.data.success){
          
            toast.success(res.data.message)
        }
     } catch (error) {
        
     }
    }
    const deletePostHandler = async() => {
        try {
            const res = await axios.delete(`https://socialmediaapp-8vkg.onrender.com/api/post/delete/${post._id}`,{withCredentials:true})
            if(res.data.success){
                const updatedPost = posts.filter((postItem) => postItem?._id !== post?._id)
                dispatch(setPosts(updatedPost))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

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
    <div className='my-8 w-full max-w-sm mx-auto'>
       <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
            <Avatar className='w-6 h-6'>
                <AvatarImage src={post.author?.profilePicture} alt="Post"/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex items-center gap-3'>
               <h1>{post.author?.username}</h1>
               {user?._id === post?.author?._id && <Badge variant='secondary'>Author</Badge>}
            </div> 
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center" >
                    { user && user?._id !== post?.author._id &&
                     <Button onClick={() => followOrUnfollowHandler(post?.author._id)} variant='ghost'className='cursor-pointer w-fit text-[#ED4956] font-bold'>
                       {isFollowing ? 'Unfollow' : 'Follow'} 
                     </Button>}
                    <Button variant='ghost'className='cursor-pointer w-fit'>Add to Favorites</Button>
                    { user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost'className='cursor-pointer w-fit'> Delete </Button> }
                </DialogContent>
            </Dialog>
        </div> 
        <img
            className='rounded-sm my-2 w-full object-cover aspect-square'
            src={post.image}
            alt='post image'
        />
         <div className='flex items-center justify-between my-2'>
              <div className='flex items-center gap-3'>
                {
                    liked ? 
                     <FaStar onClick={() => likeDislikeHandler(post._id)}  size={'22px'} className='cursor-pointer text-red-600'/> 
                     :
                     <FaRegStar onClick={() => likeDislikeHandler(post._id)} size={'22px'} className='cursor-pointer hover:text-gray-600'/>
                }
               
                <MessageCircle onClick={() => {
                    dispatch(setSelectedPost(post))
                    setOpen(true)
                }
                } className='cursor-pointer hover:text-gray-600'/>
                <Send className='cursor-pointer hover:text-gray-600'/>  
             </div>
            <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600'/>
         </div>
         <span className='font-medium block mb-2'>{postLiked !== 0 ? (postLiked > 1 ? `${postLiked} likes`: `${postLiked} like`):''} </span>
         <p>
            <span className='font-medium mr-2'>
                {post.author?.username}
            </span>
            {post.caption}
            </p>
            {comment.length > 0 && (
                <span onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true);
                }} className='cursor-pointer text-sm text-gray-400'> View all {comment.length} comments
                </span>
             )
            }
            <CommentDialog open={open} setOpen={setOpen}/>
            <div className='flex items-center justify-between'>
                <input 
                 type='text' 
                 placeholder='Add a comment...'
                 value={text}
                 onChange={changeEventHandler}
                 className='outline-none text-sm w-full'/>
                 { text && <span onClick={commentHandller} className='text-[#3BADF8] cursor-pointer'>Post</span>}
            </div>
         
    </div>
        
  )
}

export default Post