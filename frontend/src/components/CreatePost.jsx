import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({open,setOpen}) => {
  console.log("   open",open)
  const imageRef = useRef();
  const [file,setFile] = useState('');
  const [caption,setCaption] = useState('');
  const [imagePreview,setImagePreview] = useState('');
  const [loading,setLoading] = useState(false);
  const {user} = useSelector(store => store.auth);
  const {posts} = useSelector(store => store.post);
  const dispatch = useDispatch();


  const fileChangeHandler = async (e) => { 
    const file = e.target.files?.[0];
    if(file){
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl)

    }
  } 
  const createPostHandler = async(e) => {
   
    try {
      const formData = new FormData();
      formData.append("caption",caption);
      if(imagePreview) formData.append("image",file)
      setLoading(true)
      const res = await axios.post('https://socialmediaapp-8vkg.onrender.com/api/post/addpost',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      })
      if(res.data.success)
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message)
        setOpen(false)
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader  className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilePicture} alt='img'/>
            <AvatarFallback>CN </AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>Bio Here</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='Write a caption' />
        {
          imagePreview && (
            <div className='w-full h-64 flex items-center justify-center'>
              <img src={imagePreview} alt='preview_img' className='object-cover w-full h-full rounded-md'/>
            </div>
          )
        }
        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler}/>
        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>Select from the computer</Button>
        {
          imagePreview && ( 
          loading?(
           <Button>
            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
            Please Wait</Button>

          ):(
            <Button onClick={createPostHandler} className='w-full'>Post</Button>

          )

          )
      }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost