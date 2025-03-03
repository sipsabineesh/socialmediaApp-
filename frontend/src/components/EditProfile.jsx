import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "./ui/select";
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { setAuthUser } from '@/redux/authSlice';
import { toast } from 'sonner';
  

const EditProfile = () => {
    const imageRef = useRef();
    const {user} =useSelector(store => store.auth);
console.log("user",user)    
    const [loading, setLoading] = useState(false);
    const [input,setInput] = useState({
        profilePhoto:user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) =>{
        const file = e.target.files?.[0];
        if(file) setInput({...input,profilePhoto:file})
    }

    const selectChangeHandler = (value) =>{
       setInput({...input,gender:value})
    }

    const editProfileHandler = async() => {
        const formData =  new FormData();
        formData.append("bio",input.bio);
        formData.append("gender",input.gender);
        if(input.profilePhoto)
             formData.append("profilePhoto",input.profilePhoto);

        try {
            setLoading(true)
            const res = await axios.post('https://socialmediaapp-8vkg.onrender.com/api/user/profile/edit',formData,{
             headers:{
                   'Content-Type':'multipart/form-data'
             },
                withCredentials:true
            }
        )
        if(res.data.success){
            const updatedData = {
                ...user,
                profilePicture: res.data.user?.profilePicture,
                bio : res.data.user?.bio,
                gender : res.data.user?.gender
            };
            dispatch(setAuthUser(updatedData));
            navigate(`/profile/${user?._id}`)
        }

        } catch (error) {
            toast.error(error.response.data.message)   
        }
        finally{
            setLoading(false);
        }
    }

  return (
    <div className='flex max-w-2xl mx-auto pl-10'>
        <section className='flex flex-col gap-6 w-full my-8'>
            <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                            <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="profile_pic"/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold'>{user?.username}</h1>
                            <span className='text-gray-600'>{user?.bio || "Bio here..."}</span>
                        </div> 
                    </div>
                    <input ref={imageRef}  onChange={fileChangeHandler} type='file' className='hidden'/>
                    <Button onClick={() => imageRef.current.click()} className='bg-[#0095f6] h-8 hover:bg-[#318bc7]'>Change Photo</Button>
                </div>
                <div>
                    <h1 className='font-semibold mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' className="focus-visible:ring-transparent" />
                </div>
                <div>
                    <h1 className='font-semibold mb-2'>Gender</h1>
                    <Select value={input.gender} onValueChange={selectChangeHandler} className='focus-visible:ring-transparent'>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">He</SelectItem>
                                <SelectItem value="female">She</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? (
                            <Button onClick={editProfileHandler} className='w-fit bg-[#0095f6] h-8 hover:bg-[#318bc7]'>
                                <Loader2/>
                                Please Wait
                            </Button>
                         )
                        :(
                            <Button onClick={editProfileHandler} className='w-fit bg-[#0095f6] h-8 hover:bg-[#318bc7]'>Submit</Button>
                        )
                    
                    }
                </div>
        </section>
    </div>
  )
}

export default EditProfile