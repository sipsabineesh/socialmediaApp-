import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({open,setOpen}) => {
  const dispatch =  useDispatch();
  const {posts,selectedPost} = useSelector(store => store.post);
  const {user} = useSelector(store => store.auth)
  const [text,setText] = useState("");
  const [comment,setComment] = useState([])
  
  useEffect(() => {
    if(selectedPost){
      setComment(selectedPost?.comments)
    }
  },[selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }


  const sendCommentHandler = async () => {
    try {
        const res = await axios.post(`https://socialmediaapp-8vkg.onrender.com/api/post/${selectedPost?._id}/comment`,{text},{
            headers:{
                'Content-Type':'application/json'
            },           
            withCredentials:true
        })
        if(res.data.success){
            const updatedCommentData = [...comment,res.data.comment];
            setComment(updatedCommentData);
            const updatedPostData = posts.map(p => p._id === selectedPost._id ? {
                ...p,
                comments:updatedCommentData
            } : p );
            dispatch(setPosts(updatedPostData))
            // console.log("POSTS AFTER COMMENT DISPATCH",posts)
            toast.success(res.data.message);
            setText("")
        }
        
    } catch (error) {
        console.log(error)
    }
}
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
         <div className='flex flex-1'>
         <div className='w-1/2'>
          <img
              className='rounded-l-lg w-full h-full object-cover'
              src={selectedPost?.image}
              alt='post image'
          />
          </div>
         
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex items-center gap-3'>
                <Link>
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture}/>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                </Link>
                <div>
                <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                {/* <span>Bio here...</span> */}
              </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center" >
                {/* {selectedPost?.author?._id !== user._id && (
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                )} */}
                <div className='cursor-pointer w-full'>Add to Favorites</div>
                </DialogContent>
            </Dialog> 
            </div>
            <hr/>
            <div className='flex-1 overflow-y-auto max-h-93 p-4'>
              {
                comment.map((comment) => <Comment key={comment._id}  comment={comment}/>)
              }
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type='text' value={text} onChange={changeEventHandler} placeholder='Add comments' className='text-sm w-full outline-none border border-gray-300 p-2 rounded'/>
                <Button disabled={!text.trim()} onClick={sendCommentHandler} variant="outline">Send</Button>
              </div>
            </div>
          </div>
         </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentDialog